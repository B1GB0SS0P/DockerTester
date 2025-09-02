import { useState, useEffect } from "react";
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
  TrendingUp,
  Loader2
} from "lucide-react";
import { apiService, type Model, type TestResult, type Analytics } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<Model[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [modelsData, resultsData, analyticsData] = await Promise.all([
        apiService.getModels(),
        apiService.getTestResults(),
        apiService.getAnalytics()
      ]);
      
      setModels(modelsData);
      setTestResults(resultsData);
      setAnalytics(analyticsData);
    } catch (error) {
      toast({
        title: "Error Loading Dashboard",
        description: error instanceof Error ? error.message : "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Get recent models (last 3)
  const recentModels = models
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    .slice(0, 3);

  // Get recent tests (last 3)
  const recentTests = testResults
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

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
            <div className="text-2xl font-bold">{analytics?.activeModels || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.totalModels || 0} total models
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images Tested</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalTests || 0}</div>
            <p className="text-xs text-muted-foreground">
              all time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.avgAccuracy || 0}%</div>
            <p className="text-xs text-muted-foreground">
              across all models
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Inference</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.avgInference || '0ms'}</div>
            <p className="text-xs text-muted-foreground">
              per image
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
            {recentModels.length === 0 ? (
              <div className="text-center py-8">
                <Container className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No models deployed yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentModels.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {model.status === "running" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleModelStatus(model)}
                      >
                        {model.status === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            {recentTests.length === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tests run yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{test.model}</div>
                      <div className="text-sm text-muted-foreground">
                        {test.filename} • {test.timestamp.split(' ')[1]}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{test.confidence.toFixed(1)}%</div>
                      <Progress value={test.confidence} className="w-20 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;