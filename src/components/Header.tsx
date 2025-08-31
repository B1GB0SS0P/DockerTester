import Navigation from "./Navigation";
import { Brain } from "lucide-react";

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
              <h1 className="text-xl font-bold">SCVU Model Testing</h1>
            </div>
          </div>
          
          <Navigation />
        </div>
      </div>
    </header>
  );
};

export default Header;