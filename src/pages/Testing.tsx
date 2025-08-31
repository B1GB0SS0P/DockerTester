import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { Progress } from "@/components/ui/progress";
import { 
  ImageIcon, 
  Play, 
  Download, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Testing = () => {
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState("");
  const [testImages, setTestImages] = useState<File[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const availableModels = [
    { id: "yolo8", name: "YOLOv8 Object Detection", status: "running" },
    { id: "resnet", name: "ResNet50 Classification", status: "stopped" },
    { id: "maskrcnn", name: "MaskRCNN Segmentation", status: "running" },
    { id: "efficientnet", name: "EfficientNet Classification", status: "stopped" },
  ];

  const testResults = [
    {
      id: 1,
      filename: "dog_running.jpg",
      model: "YOLOv8 Object Detection",
      confidence: 95.7,
      prediction: "Dog, Person",
      inference_time: "42ms",
      status: "completed",
      timestamp: "2024-01-15 14:30:22"
    },
    {
      id: 2,
      filename: "cat_sitting.jpg",
      model: "ResNet50 Classification",
      confidence: 88.3,
      prediction: "Cat",
      inference_time: "23ms",
      status: "completed",
      timestamp: "2024-01-15 14:28:15"
    },
    {
      id: 3,
      filename: "street_scene.jpg",
      model: "YOLOv8 Object Detection",
      confidence: 92.1,
      prediction: "Car, Traffic Light, Building",
      inference_time: "48ms",
      status: "completed",
      timestamp: "2024-01-15 14:25:33"
    },
    {
      id: 4,
      filename: "birds_flying.jpg",
      model: "MaskRCNN Segmentation",
      confidence: 89.5,
      prediction: "Bird (3 instances)",
      inference_time: "165ms",
      status: "processing",
      timestamp: "2024-01-15 14:32:01"
    }
  ];

  const runTest = () => {
    if (!selectedModel || testImages.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a model and upload test images.",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    
    // Simulate test processing
    setTimeout(() => {
      setIsRunning(false);
      toast({
        title: "Test Completed",
        description: `Successfully tested ${testImages.length} images with ${selectedModel}.`,
      });
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Model Testing</h1>
        <p className="text-muted-foreground">
          Upload images to test your computer vision models and analyze results
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Test Configuration */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>
                Configure your model testing parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Model</label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a model to test" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.name} disabled={model.status === "stopped"}>
                        <div className="flex items-center space-x-2">
                          <span>{model.name}</span>
                          <Badge variant={model.status === "running" ? "default" : "secondary"} className="ml-2">
                            {model.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Test Images</label>
                <FileUpload
                  accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'] }}
                  multiple={true}
                  onFilesChange={setTestImages}
                  placeholder="Upload images for testing"
                />
              </div>

              <Button 
                onClick={runTest} 
                disabled={isRunning || !selectedModel || testImages.length === 0}
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Test
                  </>
                )}
              </Button>

              {isRunning && (
                <div className="space-y-2">
                  <Progress value={65} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    Processing image 3 of 5...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Test Results</CardTitle>
                  <CardDescription>
                    Recent model testing results and predictions
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{result.filename}</div>
                          <div className="text-sm text-muted-foreground">{result.model}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {result.status === "completed" ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : result.status === "processing" ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                        <Badge variant={result.status === "completed" ? "default" : "secondary"}>
                          {result.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Prediction</div>
                        <div className="font-medium">{result.prediction}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Confidence</div>
                        <div className="font-medium flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          {result.confidence}%
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Inference Time</div>
                        <div className="font-medium flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {result.inference_time}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Actions</div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-muted-foreground">
                      Tested at {result.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Testing;