import Navigation from "./Navigation";
import { Button } from "@/components/ui/button";
import { Brain, User } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-primary to-primary-glow rounded-lg">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">VisionLab</h1>
            </div>
          </div>
          
          <Navigation />
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;