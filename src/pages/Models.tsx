import { useState } from "react";
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
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Models = () => {
  const { toast } = useToast();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const models = [
    {
      id: 1,
      name: "YOLOv8 Object Detection",
      description: "Real-time object detection model optimized for speed and accuracy",
      status: "running",
      accuracy: 94.2,
      inference_time: "45ms",
      created: "2024-01-10",
      image_count: 1247,
      container_size: "2.1 GB"
    },
    {
      id: 2,
      name: "ResNet50 Classification",
      description: "Image classification model for general purpose object recognition",
      status: "stopped",
      accuracy: 87.5,
      inference_time: "23ms",
      created: "2024-01-08",
      image_count: 892,
      container_size: "1.8 GB"
    },
    {
      id: 3,
      name: "MaskRCNN Segmentation",
      description: "Instance segmentation model for pixel-level object detection",
      status: "running",
      accuracy: 91.8,
      inference_time: "180ms",
      created: "2024-01-12",
      image_count: 456,
      container_size: "3.2 GB"
    },
    {
      id: 4,
      name: "EfficientNet Classification",
      description: "Lightweight classification model optimized for mobile deployment",
      status: "stopped",
      accuracy: 89.3,
      inference_time: "12ms",
      created: "2024-01-05",
      image_count: 623,
      container_size: "1.2 GB"
    }
  ];

  const handleUpload = () => {
    toast({
      title: "Model Upload Started",
      description: "Your Docker container is being processed and will be available shortly.",
    });
    setIsUploadOpen(false);
  };

  const toggleModelStatus = (modelId: number, currentStatus: string) => {
    const action = currentStatus === "running" ? "stopped" : "started";
    toast({
      title: `Model ${action}`,
      description: `Model has been ${action} successfully.`,
    });
  };

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
                <Input id="model-name" placeholder="e.g., YOLOv8 Detection Model" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Brief description of your model and its capabilities"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Docker Container</Label>
                <FileUpload
                  accept={{ 'application/x-tar': ['.tar'], 'application/gzip': ['.tar.gz'] }}
                  placeholder="Upload your Docker container (.tar or .tar.gz)"
                  onFilesChange={(files) => console.log('Uploaded files:', files)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="port">Container Port</Label>
                  <Input id="port" placeholder="8080" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endpoint">API Endpoint</Label>
                  <Input id="endpoint" placeholder="/predict" />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Deploy Model
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
                {model.description}
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
                      onClick={() => toggleModelStatus(model.id, model.status)}
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
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Models;