# Model Testing Platform - Setup Guide

This guide will help you set up the SCVU Model Testing Platform with Docker container management capabilities.

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git

## Installation Steps

### 1. Clone and Setup Backend

```bash
# Create server directory
mkdir server
cd server

# Initialize npm project
npm init -y

# Install dependencies
npm install express multer node-docker-api fs-extra cors uuid tar form-data node-fetch

# Install dev dependencies
npm install -D nodemon jest

# Copy the backend code from the artifacts above to server/index.js
# Copy the package.json configuration
```

### 2. Setup Frontend API Integration

```bash
# In your React project root
# Create the API service file
mkdir -p src/lib
# Copy the API service code to src/lib/api.ts

# Update your existing pages with the new versions from the artifacts above
```

### 3. Environment Configuration

Create a `.env` file in your project root:

```env
# Frontend
REACT_APP_API_URL=http://localhost:3001/api

# Backend
NODE_ENV=development
PORT=3001
DOCKER_SOCKET_PATH=/var/run/docker.sock
```

### 4. Docker Setup

```bash
# Copy the Docker files from artifacts to their respective locations:
# - docker-compose.yml (project root)
# - server/Dockerfile 
# - Dockerfile.frontend (project root)
# - nginx.conf (project root)
```

## Running the Application

### Development Mode

1. **Start Backend:**
```bash
cd server
npm run dev
```

2. **Start Frontend:**
```bash
# In project root
npm run dev
```

### Production Mode with Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## API Endpoints

### Models Management
- `GET /api/models` - Get all models
- `POST /api/models/deploy` - Deploy new model
- `POST /api/models/:id/toggle` - Start/stop model
- `DELETE /api/models/:id` - Delete model

### Testing
- `POST /api/test/:id` - Run test on model
- `GET /api/test-results` - Get test results

### Analytics
- `GET /api/analytics` - Get analytics data

## Docker Container Requirements

Your Docker containers should:

1. **Expose an API endpoint** (default: `/predict`)
2. **Accept multipart/form-data** with image files
3. **Return JSON response** with:
   ```json
   {
     "prediction": "object_name",
     "confidence": 95.7,
     "additional_data": "optional"
   }
   ```

### Example Docker Container Structure

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install your model dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy model files
COPY model/ ./model/
COPY app.py .

EXPOSE 8080

CMD ["python", "app.py"]
```

### Example Python Flask API (app.py)

```python
from flask import Flask, request, jsonify
import cv2
import numpy as np

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    
    # Load and process image
    image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    
    # Run your model inference here
    prediction = "example_object"  # Replace with actual model prediction
    confidence = 95.7  # Replace with actual confidence score
    
    return jsonify({
        'prediction': prediction,
        'confidence': confidence
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

## Features Overview

### ✅ Completed Features
- **Model Management**: Upload, deploy, start/stop Docker containers
- **Real-time Testing**: Upload images and get predictions
- **Analytics Dashboard**: Performance metrics and charts
- **Dynamic Data**: All hardcoded data replaced with API calls

### 🔄 Dynamic Components
- Model list and statistics
- Test results and history  
- Analytics charts and metrics
- Dashboard overview cards

## Troubleshooting

### Docker Issues
- Ensure Docker daemon is running
- Check Docker socket permissions: `sudo chmod 666 /var/run/docker.sock`
- Verify port availability (3000, 3001, 8080)

### API Connection Issues
- Check if backend is running on correct port
- Verify REACT_APP_API_URL environment variable
- Check CORS configuration

### Model Deployment Issues
- Ensure Docker container has correct API endpoint
- Verify container exposes the specified port
- Check container logs: `docker logs <container_name>`

## Security Considerations

⚠️ **Important**: This setup gives the backend access to the Docker socket, which has security implications. In production:

1. Use Docker-in-Docker (DinD) instead of mounting the socket
2. Implement proper authentication and authorization
3. Validate uploaded Docker containers
4. Use container resource limits
5. Implement network segmentation

## Next Steps

1. **Database Integration**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Authentication**: Add user management and JWT authentication  
3. **File Storage**: Use cloud storage (AWS S3, Google Cloud) for container files
4. **Monitoring**: Add logging, metrics, and health checks
5. **Security**: Implement proper container scanning and isolation

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review Docker and container logs
3. Verify all prerequisites are installed
4. Test API endpoints directly with curl/Postman
