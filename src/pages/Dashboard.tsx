import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Container, 
  ImageIcon, 
  Activity, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  TrendingUp
} from "lucide-react";

const Dashboard = () => {
  const recentModels = [
    { id: 1, name: "YOLOv8-Detection", status: "running", accuracy: 94.2, lastTest: "2 hours ago" },
    { id: 2, name: "ResNet-Classification", status: "stopped", accuracy: 87.5, lastTest: "1 day ago" },
    { id: 3, name: "MaskRCNN-Segmentation", status: "running", accuracy: 91.8, lastTest: "30 minutes ago" },
  ];

  const recentTests = [
    { id: 1, model: "YOLOv8-Detection", images: 24, accuracy: 95.1, timestamp: "2024-01-15 14:30" },
    { id: 2, model: "ResNet-Classification", images: 12, accuracy: 88.3, timestamp: "2024-01-15 13:45" },
    { id: 3, model: "MaskRCNN-Segmentation", images: 8, accuracy: 92.7, timestamp: "2024-01-15 12:15" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your computer vision models and testing results
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Container className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images Tested</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +124 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">
              avg per image
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Models */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Models</CardTitle>
            <CardDescription>
              Your recently deployed computer vision models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentModels.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {model.status === "running" ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">{model.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={model.status === "running" ? "default" : "secondary"}>
                      {model.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{model.accuracy}%</span>
                    <Button variant="ghost" size="sm">
                      {model.status === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tests</CardTitle>
            <CardDescription>
              Latest model testing sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{test.model}</div>
                    <div className="text-sm text-muted-foreground">
                      {test.images} images • {test.timestamp}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{test.accuracy}%</div>
                    <Progress value={test.accuracy} className="w-20 h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;