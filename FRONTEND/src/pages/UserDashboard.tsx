import { useEffect, useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { StoreCard } from "@/components/StoreCard";
import { Search, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface Store {
  _id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  totalRatings: number;
  ownerId?: string;
}

const toNumber = (v: unknown, fallback = 0): number =>
  typeof v === "number" && !Number.isNaN(v)
    ? v
    : Number(v ?? fallback) || fallback;

const parseStores = (raw: any): Store[] => {
  // Accept multiple backend shapes, always return array
  const list = raw?.stores ?? raw?.data?.stores ?? raw?.data ?? raw ?? [];
  if (!Array.isArray(list)) return [];

  // Normalize types to be safe
  return list
    .map((s) => ({
      _id: String(s?._id ?? s?.id ?? crypto.randomUUID()),
      name: String(s?.name ?? ""),
      email: String(s?.email ?? ""),
      address: String(s?.address ?? ""),
      averageRating: toNumber(s?.averageRating, 0),
      totalRatings: Math.max(0, Math.trunc(toNumber(s?.totalRatings, 0))),
      ownerId: s?.ownerId ? String(s.ownerId) : undefined,
    }))
    .filter((s) => s.name && s.address);
};

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
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
    const fetchStores = async () => {
      try {
        const res = await api.get("/user/stores");
        // Defensive parsing so state is never undefined
        const parsed = parseStores(res?.data);
        setStores(parsed);
      } catch (err) {
        console.error("Error fetching stores", err);
        setStores([]); // never undefined
        toast({
          title: "Failed to load stores",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    };
    fetchStores();
  }, [toast]);

  const filteredStores = useMemo(() => {
    const list = Array.isArray(stores) ? stores : [];
    const q = (searchTerm || "").toLowerCase();
    if (!q) return list;
    return list.filter(
      (store) =>
        store.name.toLowerCase().includes(q) ||
        store.address.toLowerCase().includes(q)
    );
  }, [stores, searchTerm]);

  const handleRateStore = async (storeId: string, rating: number) => {
    const prev = userRatings[storeId];
    const hadPrev = prev !== undefined;

    try {
      await api.post("/user/rate", { storeId, rating });

      setUserRatings((r) => ({ ...r, [storeId]: rating }));

      // Optimistic UI update on the same tick
      setStores((prevStores) => {
        const safe = Array.isArray(prevStores) ? prevStores : [];
        return safe.map((store) => {
          if (store._id !== storeId) return store;

          const oldTotal = store.totalRatings;
          const oldAvg = store.averageRating;

          if (hadPrev) {
            const newAvg = Number(
              (
                (oldAvg * oldTotal - prev + rating) /
                Math.max(1, oldTotal)
              ).toFixed(1)
            );
            return { ...store, averageRating: newAvg };
          } else {
            const newTotal = oldTotal + 1;
            const newAvg = Number(
              ((oldAvg * oldTotal + rating) / newTotal).toFixed(1)
            );
            return { ...store, totalRatings: newTotal, averageRating: newAvg };
          }
        });
      });

      toast({
        title: "Rating submitted",
        description: "Thanks for the review!",
      });
    } catch (err) {
      console.error("Failed to rate store", err);
      toast({
        title: "Could not submit rating",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const userRatedCount = Object.keys(userRatings).length;
  const userAvgGiven = useMemo(() => {
    const vals = Object.values(userRatings);
    if (!vals.length) return "0.0";
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return avg.toFixed(1);
  }, [userRatings]);

  const hasStores = Array.isArray(filteredStores) && filteredStores.length > 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground">
              Discover and rate amazing stores in your area
            </p>
          </div>
          <div>
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
            <Button onClick={logout} variant="outline" className="ml-4">
              Logout
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Stores
            </CardTitle>
            <CardDescription>
              Search for stores by name or address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by store name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Available Stores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Array.isArray(stores) ? stores.length : 0}
              </div>
              <p className="text-xs text-muted-foreground">Stores to explore</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Your Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userRatedCount}</div>
              <p className="text-xs text-muted-foreground">
                Stores you've rated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userAvgGiven}</div>
              <p className="text-xs text-muted-foreground">
                Your avg rating given
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Store Listings */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Stores</h2>
          {!hasStores ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No stores found matching your search.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <StoreCard
                  key={store._id}
                  store={store}
                  userRating={userRatings[store._id] ?? null}
                  onRateStore={(rating) => handleRateStore(store._id, rating)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
