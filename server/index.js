// server/index.js
const express = require('express');
const multer = require('multer');
const { Docker } = require('node-docker-api');
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const tar = require('tar');

const app = express();
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads');
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 * 1024 } // 5GB limit
});

// In-memory storage for models (replace with database in production)
let models = [];
let testResults = [];

// API Routes

// Get all models
app.get('/api/models', (req, res) => {
  res.json(models);
});

// Deploy a new model
app.post('/api/models/deploy', upload.single('dockerContainer'), async (req, res) => {
  try {
    const { modelName, description, port, endpoint } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No Docker container file uploaded' });
    }

    const modelId = uuidv4();
    const containerName = `model-${modelId}`;

    // Extract and load Docker image
    const imageName = await loadDockerImage(file.path, containerName);

    // Create model record
    const newModel = {
      id: modelId,
      name: modelName,
      description,
      status: 'stopped',
      accuracy: 0,
      inference_time: '0ms',
      created: new Date().toISOString().split('T')[0],
      image_count: 0,
      container_size: await getFileSize(file.path),
      container_name: containerName,
      image_name: imageName,
      port: port || 8080,
      endpoint: endpoint || '/predict',
      file_path: file.path
    };

    models.push(newModel);

    res.json({
      success: true,
      model: newModel,
      message: 'Model deployed successfully'
    });
  } catch (error) {
    console.error('Error deploying model:', error);
    res.status(500).json({ error: 'Failed to deploy model', details: error.message });
  }
});

// Start/Stop model container
app.post('/api/models/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const model = models.find(m => m.id === id);

    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    if (model.status === 'running') {
      await stopContainer(model.container_name);
      model.status = 'stopped';
    } else {
      await startContainer(model);
      model.status = 'running';
    }

    res.json({
      success: true,
      model,
      message: `Model ${model.status} successfully`
    });
  } catch (error) {
    console.error('Error toggling model:', error);
    res.status(500).json({ error: 'Failed to toggle model', details: error.message });
  }
});

// Delete model
app.delete('/api/models/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const modelIndex = models.findIndex(m => m.id === id);

    if (modelIndex === -1) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const model = models[modelIndex];

    // Stop container if running
    if (model.status === 'running') {
      await stopContainer(model.container_name);
    }

    // Remove container and image
    await removeContainer(model.container_name);
    await removeImage(model.image_name);

    // Remove uploaded file
    if (fs.existsSync(model.file_path)) {
      fs.unlinkSync(model.file_path);
    }

    models.splice(modelIndex, 1);

    res.json({
      success: true,
      message: 'Model deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting model:', error);
    res.status(500).json({ error: 'Failed to delete model', details: error.message });
  }
});

// Run test on model
app.post('/api/test/:id', upload.array('images'), async (req, res) => {
  try {
    const { id } = req.params;
    const model = models.find(m => m.id === id);
    const images = req.files;

    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    if (model.status !== 'running') {
      return res.status(400).json({ error: 'Model must be running to perform tests' });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'No images uploaded for testing' });
    }

    // Process each image
    const results = [];
    for (const image of images) {
      const result = await runInference(model, image);
      results.push(result);
      testResults.push(result);
    }

    // Update model statistics
    model.image_count += images.length;

    res.json({
      success: true,
      results,
      message: `Successfully tested ${images.length} images`
    });
  } catch (error) {
    console.error('Error running test:', error);
    res.status(500).json({ error: 'Failed to run test', details: error.message });
  }
});

// Get test results
app.get('/api/test-results', (req, res) => {
  res.json(testResults);
});

// Get analytics data
app.get('/api/analytics', (req, res) => {
  const analytics = generateAnalytics();
  res.json(analytics);
});

// Docker helper functions
async function loadDockerImage(filePath, containerName) {
  try {
    // Extract tar file and build image
    const imageName = `${containerName}:latest`;
    const imageStream = fs.createReadStream(filePath);
    
    await docker.image.build(imageStream, {
      t: imageName
    });

    return imageName;
  } catch (error) {
    throw new Error(`Failed to load Docker image: ${error.message}`);
  }
}

async function startContainer(model) {
  try {
    const container = await docker.container.create({
      Image: model.image_name,
      name: model.container_name,
      ExposedPorts: {
        [`${model.port}/tcp`]: {}
      },
      HostConfig: {
        PortBindings: {
          [`${model.port}/tcp`]: [{ HostPort: model.port.toString() }]
        }
      }
    });

    await container.start();
    return container;
  } catch (error) {
    throw new Error(`Failed to start container: ${error.message}`);
  }
}

async function stopContainer(containerName) {
  try {
    const containers = await docker.container.list();
    const container = containers.find(c => c.data.Names.includes(`/${containerName}`));
    
    if (container) {
      await container.stop();
    }
  } catch (error) {
    throw new Error(`Failed to stop container: ${error.message}`);
  }
}

async function removeContainer(containerName) {
  try {
    const containers = await docker.container.list({ all: true });
    const container = containers.find(c => c.data.Names.includes(`/${containerName}`));
    
    if (container) {
      await container.remove({ force: true });
    }
  } catch (error) {
    console.error(`Failed to remove container: ${error.message}`);
  }
}

async function removeImage(imageName) {
  try {
    const image = docker.image.get(imageName);
    await image.remove({ force: true });
  } catch (error) {
    console.error(`Failed to remove image: ${error.message}`);
  }
}

async function runInference(model, imageFile) {
  try {
    const startTime = Date.now();
    
    // Mock inference call - replace with actual API call to running container
    const response = await fetch(`http://localhost:${model.port}${model.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: createFormData(imageFile)
    });

    const inferenceTime = Date.now() - startTime;
    const prediction = await response.json();

    return {
      id: uuidv4(),
      filename: imageFile.originalname,
      model: model.name,
      confidence: prediction.confidence || Math.random() * 100, // Mock confidence
      prediction: prediction.prediction || 'Unknown', // Mock prediction
      inference_time: `${inferenceTime}ms`,
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19)
    };
  } catch (error) {
    return {
      id: uuidv4(),
      filename: imageFile.originalname,
      model: model.name,
      confidence: 0,
      prediction: 'Error',
      inference_time: '0ms',
      status: 'failed',
      timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19),
      error: error.message
    };
  }
}

function createFormData(file) {
  const FormData = require('form-data');
  const form = new FormData();
  form.append('image', fs.createReadStream(file.path), file.originalname);
  return form;
}

async function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const sizeInBytes = stats.size;
    const sizeInGB = (sizeInBytes / (1024 * 1024 * 1024)).toFixed(1);
    return `${sizeInGB} GB`;
  } catch (error) {
    return 'Unknown';
  }
}

function generateAnalytics() {
  const totalTests = testResults.length;
  const avgAccuracy = testResults.length > 0 
    ? testResults.reduce((sum, r) => sum + r.confidence, 0) / testResults.length 
    : 0;
  
  const avgInference = testResults.length > 0
    ? testResults.reduce((sum, r) => sum + parseInt(r.inference_time), 0) / testResults.length
    : 0;

  const successRate = testResults.length > 0
    ? (testResults.filter(r => r.status === 'completed').length / testResults.length) * 100
    : 0;

  return {
    totalModels: models.length,
    activeModels: models.filter(m => m.status === 'running').length,
    totalTests,
    avgAccuracy: Math.round(avgAccuracy * 10) / 10,
    avgInference: `${Math.round(avgInference)}ms`,
    successRate: Math.round(successRate * 10) / 10,
    models: models.map(m => ({
      name: m.name,
      accuracy: m.accuracy,
      tests: testResults.filter(r => r.model === m.name).length,
      status: m.status
    }))
  };
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;