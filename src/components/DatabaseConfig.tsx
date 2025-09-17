import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Database, Key, Globe, AlertCircle, CheckCircle } from "lucide-react";
import { databaseService } from "@/services/DatabaseService";
import { mlModelService } from "@/services/MLModelService";
import { useToast } from "@/hooks/use-toast";

export default function DatabaseConfig() {
  const [dbConfig, setDbConfig] = useState({
    apiKey: '',
    databaseUrl: '',
    projectId: '',
  });
  
  const [mlConfig, setMlConfig] = useState({
    modelApiUrl: '',
    apiKey: '',
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const isDatabaseConfigured = databaseService.isConfigured();
  const isMLConfigured = mlModelService.isConfigured();

  const handleDatabaseConnect = async () => {
    if (!dbConfig.apiKey || !dbConfig.databaseUrl) {
      toast({
        title: "Missing Configuration",
        description: "Please provide API key and database URL",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      databaseService.initialize(dbConfig);
      
      // Test connection
      await databaseService.fetchSensorData();
      
      toast({
        title: "Database Connected",
        description: "Successfully connected to your cloud database",
      });

      // Clear sensitive data from state
      setDbConfig({ apiKey: '', databaseUrl: '', projectId: '' });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to database. Please check your credentials.",
        variant: "destructive",
      });
    }
    setIsConnecting(false);
  };

  const handleMLConnect = () => {
    if (!mlConfig.modelApiUrl) {
      toast({
        title: "Missing Configuration",
        description: "Please provide ML model API URL",
        variant: "destructive",
      });
      return;
    }

    mlModelService.initialize(mlConfig);
    
    toast({
      title: "ML Model Connected",
      description: "Successfully connected to ML model service",
    });

    // Clear sensitive data from state
    setMlConfig({ modelApiUrl: '', apiKey: '' });
  };

  return (
    <div className="space-y-6">
      {/* Database Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cloud Database Configuration
            {isDatabaseConfigured && (
              <Badge variant="secondary" className="ml-auto">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isDatabaseConfigured ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="db-api-key">API Key</Label>
                <Input
                  id="db-api-key"
                  type="password"
                  placeholder="Your database API key"
                  value={dbConfig.apiKey}
                  onChange={(e) => setDbConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="db-url">Database URL</Label>
                <Input
                  id="db-url"
                  placeholder="https://your-database-api.com"
                  value={dbConfig.databaseUrl}
                  onChange={(e) => setDbConfig(prev => ({ ...prev, databaseUrl: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-id">Project ID (Optional)</Label>
                <Input
                  id="project-id"
                  placeholder="your-project-id"
                  value={dbConfig.projectId}
                  onChange={(e) => setDbConfig(prev => ({ ...prev, projectId: e.target.value }))}
                />
              </div>
              
              <Button 
                onClick={handleDatabaseConnect} 
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? 'Connecting...' : 'Connect Database'}
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-2" />
              <p className="text-muted-foreground">Database is connected and ready to receive sensor data</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ML Model Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            ML Model Configuration
            {isMLConfigured && (
              <Badge variant="secondary" className="ml-auto">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isMLConfigured ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="ml-url">ML Model API URL</Label>
                <Input
                  id="ml-url"
                  placeholder="https://your-ml-model-api.com"
                  value={mlConfig.modelApiUrl}
                  onChange={(e) => setMlConfig(prev => ({ ...prev, modelApiUrl: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ml-api-key">API Key (Optional)</Label>
                <Input
                  id="ml-api-key"
                  type="password"
                  placeholder="ML model API key"
                  value={mlConfig.apiKey}
                  onChange={(e) => setMlConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>
              
              <Button 
                onClick={handleMLConnect}
                className="w-full"
              >
                Connect ML Model
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-2" />
              <p className="text-muted-foreground">ML model is connected and ready for predictions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• API keys are stored securely in your browser's local storage</p>
            <p>• Keys are not transmitted to any third-party services</p>
            <p>• You can disconnect and reconfigure at any time</p>
            <p>• Expected sensor data: Rainfall_mm, Rainfall_3Day, Rainfall_7Day, Temperature_C, Soil_Strain, Pore_Water_Pressure_kPa</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}