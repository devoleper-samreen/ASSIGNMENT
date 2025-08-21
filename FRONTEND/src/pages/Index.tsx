import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, Users, Store, TrendingUp, ArrowRight } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect authenticated users to appropriate dashboard
      const dashboardRoutes = {
        admin: "/admin-dashboard",
        user: "/dashboard",
        store_owner: "/store-owner",
      };
      navigate(dashboardRoutes[user.role] || "/login");
    }
  }, [user, navigate]);

  if (user) {
    return null; // Prevent flash of content while redirecting
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Star className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">RateifyHub</h1>
          </div>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The ultimate platform for discovering, rating, and managing stores.
            Connect customers with businesses and build trust through authentic
            reviews.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need to Rate and Discover
            </h2>
            <p className="text-muted-foreground text-lg">
              Powerful features for customers, store owners, and administrators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>For Customers</CardTitle>
                <CardDescription>
                  Discover and rate stores in your area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span className="text-sm">
                    Search stores by name and location
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span className="text-sm">
                    Submit and modify ratings (1-5 stars)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span className="text-sm">View overall store ratings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span className="text-sm">
                    Manage your profile and password
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Store className="h-12 w-12 text-secondary mx-auto mb-4" />
                <CardTitle>For Store Owners</CardTitle>
                <CardDescription>
                  Manage your store's reputation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-secondary rounded-full" />
                  <span className="text-sm">
                    View your store's average rating
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-secondary rounded-full" />
                  <span className="text-sm">See all customer reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-secondary rounded-full" />
                  <span className="text-sm">Track rating trends over time</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-secondary rounded-full" />
                  <span className="text-sm">Manage account settings</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <TrendingUp className="h-12 w-12 text-warning mx-auto mb-4" />
                <CardTitle>For Administrators</CardTitle>
                <CardDescription>Complete platform management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-warning rounded-full" />
                  <span className="text-sm">
                    Add and manage users and stores
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-warning rounded-full" />
                  <span className="text-sm">View comprehensive analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-warning rounded-full" />
                  <span className="text-sm">Filter and search all data</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-warning rounded-full" />
                  <span className="text-sm">
                    Manage user roles and permissions
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of users who trust RateifyHub for authentic store
            reviews and ratings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">
              RateifyHub
            </span>
          </div>
          <p className="text-muted-foreground">
            Connecting customers and businesses through authentic ratings and
            reviews.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
