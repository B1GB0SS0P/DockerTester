import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, Clock, Target, Activity, Loader2 } from "lucide-react";
import { apiService, type Analytics, type TestResult, type Model } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AnalyticsPage = () => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7days");

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const [analyticsData, resultsData, modelsData] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getTestResults(),
        apiService.getModels()
      ]);
      
      setAnalytics(analyticsData);
      setTestResults(resultsData);
      setModels(modelsData);
    } catch (error) {
      toast({
        title: "Error Loading Analytics",
        description: error instanceof Error ? error.message : "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock time series data based on test results
  const generateAccuracyData = () => {
    const days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayResults = testResults.filter(result => {
        const resultDate = new Date(result.timestamp);
        return resultDate.toDateString() === date.toDateString();
      });

      const modelAccuracies: { [key: string]: number[] } = {};
      dayResults.forEach(result => {
        if (!modelAccuracies[result.model]) {
          modelAccuracies[result.model] = [];
        }
        modelAccuracies[result.model].push(result.confidence);
      });

      const dayData: any = {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };

      Object.entries(modelAccuracies).forEach(([modelName, accuracies]) => {
        const avg = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
        dayData[modelName.toLowerCase().replace(/\s+/g, '_')] = Math.round(avg * 10) / 10;
      });

      days.push(dayData);
    }
    
    return days;
  };

  // Generate inference time data
  const generateInferenceData = () => {
    const modelStats: { [key: string]: { times: number[], tests: number } } = {};
    
    testResults.forEach(result => {
      const time = parseInt(result.inference_time.replace('ms', ''));
      if (!modelStats[result.model]) {
        modelStats[result.model] = { times: [], tests: 0 };
      }
      modelStats[result.model].times.push(time);
      modelStats[result.model].tests++;
    });

    return Object.entries(modelStats).map(([model, stats]) => ({
      model: model.replace(/\s+/g, '\n'),
      time: Math.round(stats.times.reduce((sum, t) => sum + t, 0) / stats.times.length),
      tests: stats.tests
    }));
  };

  // Generate usage distribution data
  const generateUsageData = () => {
    const modelCounts: { [key: string]: number } = {};
    
    testResults.forEach(result => {
      modelCounts[result.model] = (modelCounts[result.model] || 0) + 1;
    });

    const total = Object.values(modelCounts).reduce((sum, count) => sum + count, 0);
    const colors = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];
    
    return Object.entries(modelCounts).map(([name, count], index) => ({
      name,
      value: Math.round((count / total) * 100),
      color: colors[index % colors.length]
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading analytics...</span>
        </div>
      </div>
    );
  }

  const accuracyData = generateAccuracyData();
  const inferenceData = generateInferenceData();
  const usageData = generateUsageData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive performance metrics and insights for your models
          </p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24hours">Last 24 Hours</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.avgAccuracy || 0}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.successRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Accuracy Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Model Accuracy Trends</CardTitle>
            <CardDescription>
              Accuracy performance over time for all models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {accuracyData.length > 0 ? (
                <AreaChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  {Object.keys(accuracyData[0])
                    .filter(key => key !== 'date')
                    .map((key, index) => {
                      const colors = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))'];
                      return (
                        <Area
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={colors[index % colors.length]}
                          fill={colors[index % colors.length]}
                          fillOpacity={0.6}
                        />
                      );
                    })}
                </AreaChart>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No test data available
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inference Times */}
        <Card>
          <CardHeader>
            <CardTitle>Inference Performance</CardTitle>
            <CardDescription>
              Average inference time by model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {inferenceData.length > 0 ? (
                <BarChart data={inferenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="model" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="time" fill="hsl(var(--primary))" />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No test data available
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Model Usage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Distribution</CardTitle>
            <CardDescription>
              Test distribution across models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              {usageData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={usageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {usageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No usage data available
                </div>
              )}
            </ResponsiveContainer>
            {usageData.length > 0 && (
              <div className="mt-4 space-y-2">
                {usageData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Model Performance Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Model Performance Summary</CardTitle>
            <CardDescription>
              Detailed metrics for each deployed model
            </CardDescription>
          </CardHeader>
          <CardContent>
            {models.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No models deployed yet
              </div>
            ) : (
              <div className="space-y-4">
                {models.map((model, index) => {
                  const modelTests = testResults.filter(r => r.model === model.name);
                  const avgAccuracy = modelTests.length > 0 
                    ? modelTests.reduce((sum, r) => sum + r.confidence, 0) / modelTests.length 
                    : 0;
                  const avgInference = modelTests.length > 0
                    ? modelTests.reduce((sum, r) => sum + parseInt(r.inference_time), 0) / modelTests.length
                    : 0;
                  const successRate = modelTests.length > 0
                    ? (modelTests.filter(r => r.status === 'completed').length / modelTests.length) * 100
                    : 0;

                  return (
                    <div key={model.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{model.name}</h3>
                        <Badge variant={model.status === 'running' ? 'default' : 'secondary'}>
                          {model.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Accuracy</div>
                          <div className="font-bold text-lg">{avgAccuracy.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Avg Inference</div>
                          <div className="font-bold text-lg">{avgInference.toFixed(0)}ms</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Total Tests</div>
                          <div className="font-bold text-lg">{modelTests.length.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Success Rate</div>
                          <div className="font-bold text-lg">{successRate.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;