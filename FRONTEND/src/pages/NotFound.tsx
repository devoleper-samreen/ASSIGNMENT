import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Star className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">RateifyHub</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h2 className="text-6xl font-bold text-primary">404</h2>
              <h3 className="text-2xl font-semibold text-foreground">
                Page Not Found
              </h3>
              <p className="text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
