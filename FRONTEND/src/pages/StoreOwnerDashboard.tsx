import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { Star, Users, TrendingUp } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const StoreOwnerDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [ownedStore, setOwnedStore] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    try {
      await api.patch("/auth/update-password", {
        currentPassword,
        newPassword,
      });
      toast({ title: "Success", description: "Password updated successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch stores owned by this user
        const storeRes = await api.get("/owner/stores");
        const storesData = storeRes.data;

        if (storesData.length === 0) {
          setOwnedStore(null);
          setRatings([]);
          setAvgRating(0);
          setLoading(false);
          return;
        }

        const store = storesData[0]; // Assuming one store per owner
        setOwnedStore(store);

        // 2. Fetch ratings for that store
        const ratingRes = await api.get(`/owner/ratings/${store._id}`);
        setRatings(ratingRes.data.ratings);
        setAvgRating(ratingRes.data.avgRating);
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  if (!ownedStore) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              Store Owner Dashboard
            </h1>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No store found for your account. Please contact an
                administrator.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground">Managing {ownedStore.name}</p>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">Update Password</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Password</DialogTitle>
              <DialogDescription>
                Change your account password
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Update Password
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Store Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              {ownedStore.name}
            </CardTitle>
            <CardDescription>{ownedStore.address}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Overall Rating
                </p>
                <StarRating rating={avgRating} size="lg" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{ratings.length}</p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reviews
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ratings.length}</div>
              <p className="text-xs text-muted-foreground">Customer reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rating Distribution
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratings.filter(
                    (r) => r.rating === rating
                  ).length;
                  const percentage =
                    ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-xs w-3">{rating}</span>
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <div className="flex-1 h-2 bg-muted rounded">
                        <div
                          className="h-full bg-warning rounded"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>
              See what customers are saying about your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ratings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No reviews yet. Encourage customers to leave ratings!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {ratings.map((ratingData) => (
                  <div
                    key={ratingData._id}
                    className="border-b pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">
                          {ratingData.user?.name || "Anonymous User"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {ratingData.user?.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <StarRating rating={ratingData.rating} size="sm" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(ratingData.createdAt).toLocaleDateString()}
                        </p>
                      </div>
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

export default StoreOwnerDashboard;
