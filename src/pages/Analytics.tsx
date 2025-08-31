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
import { TrendingUp, Clock, Target, Activity } from "lucide-react";

const Analytics = () => {
  const accuracyData = [
    { date: "Jan 1", yolo: 92.5, resnet: 85.2, maskrcnn: 89.1 },
    { date: "Jan 3", yolo: 93.1, resnet: 86.8, maskrcnn: 90.3 },
    { date: "Jan 5", yolo: 94.2, resnet: 87.5, maskrcnn: 91.8 },
    { date: "Jan 7", yolo: 93.8, resnet: 88.1, maskrcnn: 92.1 },
    { date: "Jan 9", yolo: 95.1, resnet: 89.3, maskrcnn: 93.2 },
    { date: "Jan 11", yolo: 94.7, resnet: 88.9, maskrcnn: 92.8 },
    { date: "Jan 13", yolo: 95.5, resnet: 90.1, maskrcnn: 94.1 },
  ];

  const inferenceData = [
    { model: "YOLOv8", time: 45, tests: 1247 },
    { model: "ResNet50", time: 23, tests: 892 },
    { model: "MaskRCNN", time: 180, tests: 456 },
    { model: "EfficientNet", time: 12, tests: 623 },
  ];

  const usageData = [
    { name: "YOLOv8", value: 45, color: "hsl(var(--primary))" },
    { name: "ResNet50", value: 28, color: "hsl(var(--success))" },
    { name: "MaskRCNN", value: 15, color: "hsl(var(--warning))" },
    { name: "EfficientNet", value: 12, color: "hsl(var(--destructive))" },
  ];

  const modelMetrics = [
    {
      model: "YOLOv8 Object Detection",
      accuracy: 95.5,
      avgInference: "45ms",
      totalTests: 1247,
      successRate: 98.2,
      trend: "+2.3%"
    },
    {
      model: "ResNet50 Classification",
      accuracy: 90.1,
      avgInference: "23ms",
      totalTests: 892,
      successRate: 96.8,
      trend: "+1.8%"
    },
    {
      model: "MaskRCNN Segmentation",
      accuracy: 94.1,
      avgInference: "180ms",
      totalTests: 456,
      successRate: 94.5,
      trend: "+3.1%"
    },
    {
      model: "EfficientNet Classification",
      accuracy: 89.3,
      avgInference: "12ms",
      totalTests: 623,
      successRate: 97.1,
      trend: "+0.9%"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive performance metrics and insights for your models
          </p>
        </div>
        
        <Select defaultValue="7days">
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
            <div className="text-2xl font-bold">92.8%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.1% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Inference</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65ms</div>
            <p className="text-xs text-muted-foreground">
              -8ms from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,218</div>
            <p className="text-xs text-muted-foreground">
              +247 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.7%</div>
            <p className="text-xs text-muted-foreground">
              +0.3% from last week
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
              <AreaChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="yolo" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                <Area type="monotone" dataKey="resnet" stackId="2" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.6} />
                <Area type="monotone" dataKey="maskrcnn" stackId="3" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.6} />
              </AreaChart>
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
              <BarChart data={inferenceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="time" fill="hsl(var(--primary))" />
              </BarChart>
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
            </ResponsiveContainer>
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
            <div className="space-y-4">
              {modelMetrics.map((model, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{model.model}</h3>
                    <Badge variant="outline" className="text-success">
                      {model.trend}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Accuracy</div>
                      <div className="font-bold text-lg">{model.accuracy}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Avg Inference</div>
                      <div className="font-bold text-lg">{model.avgInference}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total Tests</div>
                      <div className="font-bold text-lg">{model.totalTests.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Success Rate</div>
                      <div className="font-bold text-lg">{model.successRate}%</div>
                    </div>
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

export default Analytics;