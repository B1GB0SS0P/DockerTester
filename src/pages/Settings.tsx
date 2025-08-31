import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Container, 
  Database, 
  Bell, 
  Shield,
  Server,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your VisionLab environment and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5" />
                <span>Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <Container className="h-4 w-4 mr-2" />
                Docker Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                Storage
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Server className="h-4 w-4 mr-2" />
                API Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Docker Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Container className="h-5 w-5" />
                <span>Docker Configuration</span>
              </CardTitle>
              <CardDescription>
                Manage Docker engine settings and container defaults
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="docker-host">Docker Host</Label>
                  <Input id="docker-host" defaultValue="unix:///var/run/docker.sock" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registry">Container Registry</Label>
                  <Input id="registry" placeholder="your-registry.com" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-cleanup containers</Label>
                    <p className="text-sm text-muted-foreground">Automatically remove stopped containers after 24 hours</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Resource monitoring</Label>
                    <p className="text-sm text-muted-foreground">Monitor CPU and memory usage of running containers</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Storage Settings</span>
              </CardTitle>
              <CardDescription>
                Configure storage limits and retention policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-storage">Max Storage per Model (GB)</Label>
                  <Input id="max-storage" type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retention">Test Result Retention (days)</Label>
                  <Input id="retention" type="number" defaultValue="30" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Usage</Label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Container Images</span>
                    <span>8.2 GB / 50 GB</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '16.4%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>API Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure API endpoints and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-url">API Base URL</Label>
                <Input id="api-url" defaultValue="http://localhost:8080/api" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex space-x-2">
                  <Input id="api-key" type="password" placeholder="••••••••••••••••" />
                  <Button variant="outline">Generate</Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rate limiting</Label>
                    <p className="text-sm text-muted-foreground">Limit API requests per minute</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Request logging</Label>
                    <p className="text-sm text-muted-foreground">Log all API requests for debugging</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Configure alerts and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Model deployment notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified when models are deployed or stopped</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Test completion alerts</Label>
                    <p className="text-sm text-muted-foreground">Alert when batch testing is completed</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Performance degradation warnings</Label>
                    <p className="text-sm text-muted-foreground">Alert when model accuracy drops significantly</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="email">Notification Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
                <div>
                  <h3 className="font-medium">Clear all test results</h3>
                  <p className="text-sm text-muted-foreground">
                    Remove all stored test results and analytics data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Clear Data
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
                <div>
                  <h3 className="font-medium">Reset all settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Reset all configuration to default values
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Reset Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;