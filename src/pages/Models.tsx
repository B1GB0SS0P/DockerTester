import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Container, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Trash2,
  Download,
  Upload,
  Activity,
  Clock,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, type Model } from "@/lib/api";

const Models = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<Model[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [formData, setFormData] = useState({
    modelName: '',
    description: '',
    port: '',
    endpoint: '/predict'
  });
  const [dockerFiles, setDockerFiles] = useState<File[]>([]);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getModels();
      setModels(data);
    } catch (error) {
      toast({
        title: "Error Loading Models",
        description: error instanceof Error ? error.message : "Failed to load models",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = async () => {
    if (!formData.modelName.trim() || dockerFiles.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a model name and upload a Docker container file",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsDeploying(true);
      
      const deployFormData = new FormData();
      deployFormData.append('modelName', formData.modelName);
      deployFormData.append('description', formData.description);
      deployFormData.append('port', formData.port || '8080');
      deployFormData.append('endpoint', formData.endpoint);
      deployFormData.append('dockerContainer', dockerFiles[0]);

      const response = await apiService.deployModel(deployFormData);
      
      toast({
        title: "Model Deployed",
        description: response.message,
      });

      // Reset form and close dialog
      setFormData({ modelName: '', description: '', port: '', endpoint: '/predict' });
      setDockerFiles([]);
      setIsUploadOpen(false);
      
      // Reload models
      loadModels();
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Failed to deploy model",
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const toggleModelStatus = async (model: Model) => {
    try {
      const response = await apiService.toggleModel(model.id);
      toast({
        title: `Model ${response.model.status === 'running' ? 'Started' : 'Stopped'}`,
        description: response.message,
      });
      
      // Update local state
      setModels(prev => prev.map(m => 
        m.id === model.id ? { ...m, status: response.model.status } : m
      ));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to toggle model status",
        variant: "destructive"
      });
    }
  };

  const deleteModel = async (model: Model) => {
    if (!confirm(`Are you sure you want to delete ${model.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await apiService.deleteModel(model.id);
      toast({
        title: "Model Deleted",
        description: response.message,
      });
      
      // Remove from local state
      setModels(prev => prev.filter(m => m.id !== model.id));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete model",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading models...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Model Management</h1>
          <p className="text-muted-foreground">
            Deploy and manage your computer vision Docker containers
          </p>
        </div>
        
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Deploy Model
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Deploy New Model</DialogTitle>
              <DialogDescription>
                Upload a Docker container containing your computer vision model
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="model-name">Model Name</Label>
                <Input 
                  id="model-name" 
                  placeholder="e.g., YOLOv8 Detection Model"
                  value={formData.modelName}
                  onChange={(e) => setFormData(prev => ({ ...prev, modelName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Docker Container</Label>
                <FileUpload
                  accept={{ 'application/x-tar': ['.tar'], 'application/gzip': ['.tar.gz'] }}
                  placeholder="Upload your Docker container (.tar or .tar.gz)"
                  onFilesChange={setDockerFiles}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="port">Container Port</Label>
                  <Input 
                    id="port" 
                    placeholder="8080"
                    value={formData.port}
                    onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endpoint">API Endpoint</Label>
                  <Input 
                    id="endpoint" 
                    placeholder="/predict"
                    value={formData.endpoint}
                    onChange={(e) => setFormData(prev => ({ ...prev, endpoint: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDeploy} disabled={isDeploying}>
                  {isDeploying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Deploy Model
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {models.length === 0 ? (
        <div className="text-center py-12">
          <Container className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Models Deployed</h3>
          <p className="text-muted-foreground mb-4">
            Get started by deploying your first computer vision model
          </p>
          <Button onClick={() => setIsUploadOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Deploy Your First Model
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <Card key={model.id} className="relative group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Container className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <Badge 
                        variant={model.status === "running" ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {model.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-3">
                  {model.description || 'No description provided'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Accuracy</div>
                      <div className="font-medium">{model.accuracy}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Inference</div>
                      <div className="font-medium">{model.inference_time}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Images Tested</div>
                      <div className="font-medium">{model.image_count.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Size</div>
                      <div className="font-medium">{model.container_size}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleModelStatus(model)}
                      >
                        {model.status === "running" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteModel(model)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Models;