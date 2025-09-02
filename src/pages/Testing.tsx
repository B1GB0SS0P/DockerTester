import { useState, useEffect } from "react";
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
  Target,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, type Model, type TestResult } from "@/lib/api";

const Testing = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [testImages, setTestImages] = useState<File[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [modelsData, resultsData] = await Promise.all([
        apiService.getModels(),
        apiService.getTestResults()
      ]);
      setModels(modelsData);
      setTestResults(resultsData);
    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: error instanceof Error ? error.message : "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runTest = async () => {
    if (!selectedModel || testImages.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a model and upload test images.",
        variant: "destructive"
      });
      return;
    }

    if (selectedModel.status !== 'running') {
      toast({
        title: "Model Not Running",
        description: "Please start the selected model before running tests.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsRunning(true);
      
      const response = await apiService.runTest(selectedModel.id, testImages);
      
      toast({
        title: "Test Completed",
        description: response.message,
      });

      // Add new results to the list
      setTestResults(prev => [...response.results, ...prev]);
      
      // Clear test images
      setTestImages([]);
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Failed to run test",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const exportResults = () => {
    const csv = [
      'Filename,Model,Prediction,Confidence,Inference Time,Status,Timestamp',
      ...testResults.map(result => 
        `"${result.filename}","${result.model}","${result.prediction}",${result.confidence},"${result.inference_time}","${result.status}","${result.timestamp}"`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const runningModels = models.filter(model => model.status === 'running');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading testing interface...</span>
        </div>
      </div>
    );
  }

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
                {runningModels.length === 0 ? (
                  <div className="p-4 border rounded-lg text-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No running models available. Please start a model from the Models page.
                    </p>
                  </div>
                ) : (
                  <Select 
                    value={selectedModel?.id || ""} 
                    onValueChange={(value) => {
                      const model = models.find(m => m.id === value);
                      setSelectedModel(model || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a model to test" />
                    </SelectTrigger>
                    <SelectContent>
                      {runningModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center space-x-2">
                            <span>{model.name}</span>
                            <Badge variant="default" className="ml-2">
                              running
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Test Images</label>
                <FileUpload
                  accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'] }}
                  multiple={true}
                  onFilesChange={setTestImages}
                  placeholder="Upload images for testing"
                />
                {testImages.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {testImages.length} image{testImages.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              <Button 
                onClick={runTest} 
                disabled={isRunning || !selectedModel || testImages.length === 0 || runningModels.length === 0}
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
                    Processing images...
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportResults}
                  disabled={testResults.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Test Results</h3>
                  <p className="text-muted-foreground">
                    Run your first test to see results here
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
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
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : result.status === "processing" ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <Badge variant={
                            result.status === "completed" ? "default" : 
                            result.status === "processing" ? "secondary" : 
                            "destructive"
                          }>
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
                            {result.confidence.toFixed(1)}%
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

                      {result.error && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                          Error: {result.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Testing;