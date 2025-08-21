import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Users, Store, Star, Plus, Search, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  role: UserRole;
}

interface StoreType {
  _id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  averageRating: number;
  totalRatings: number;
}

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [ratingsCount, setRatingsCount] = useState<number>(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);

  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user" as UserRole,
  });

  const [newStoreData, setNewStoreData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  // Fetch all data on mount
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, storesRes, ratingsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/stores"),
        api.get("/admin/ratings"),
      ]);

      setUsers(usersRes.data);
      setStores(storesRes.data);
      setRatingsCount(ratingsRes.data.count);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  // Add User
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(newUserData);

      await api.post("/admin/add-user", newUserData);
      toast({
        title: "User Added",
        description: `${newUserData.name} has been added successfully.`,
      });
      setNewUserData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
      });
      fetchAdminData();
      setIsAddUserOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add user.",
        variant: "destructive",
      });
    }
  };

  // Add Store
  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/add-store", newStoreData);
      toast({
        title: "Store Added",
        description: `${newStoreData.name} has been added successfully.`,
      });
      setNewStoreData({ name: "", email: "", address: "", ownerId: "" });
      fetchAdminData();
      setIsAddStoreOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add store.",
        variant: "destructive",
      });
    }
  };

  // Filters
  const filteredUsers = (users ?? []).filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredStores = (stores ?? []).filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const storeOwners = users.filter((u) => u.role === "owner");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage users, stores, and view statistics
            </p>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {users.filter((u) => u.role === "user").length} customers,{" "}
                {users.filter((u) => u.role === "owner").length} store owners
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Stores
              </CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stores.length}</div>
              <p className="text-xs text-muted-foreground">Registered stores</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Ratings
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ratingsCount}</div>
              <p className="text-xs text-muted-foreground">
                Submitted by users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {/* Add User */}
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={newUserData.name}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={newUserData.password}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea
                    value={newUserData.address}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select
                    value={newUserData.role}
                    onValueChange={(value: UserRole) =>
                      setNewUserData((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Normal User</SelectItem>
                      <SelectItem value="owner">Store Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Add User
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Add Store */}
          <Dialog open={isAddStoreOpen} onOpenChange={setIsAddStoreOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus className="h-4 w-4 mr-2" /> Add Store
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Store</DialogTitle>
                <DialogDescription>Register a new store</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddStore} className="space-y-4">
                <div>
                  <Label>Store Name</Label>
                  <Input
                    value={newStoreData.name}
                    onChange={(e) =>
                      setNewStoreData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newStoreData.email}
                    onChange={(e) =>
                      setNewStoreData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea
                    value={newStoreData.address}
                    onChange={(e) =>
                      setNewStoreData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Store Owner</Label>
                  <Select
                    value={newStoreData.ownerId}
                    onValueChange={(value) =>
                      setNewStoreData((prev) => ({ ...prev, ownerId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select store owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {storeOwners.map((owner) => (
                        <SelectItem key={owner._id} value={owner._id}>
                          {owner.name} ({owner.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Add Store
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users or stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="owner">Store Owners</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage all platform users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Address</th>
                    <th className="text-left p-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-muted/50">
                      <td className="p-2">{user.name}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2 max-w-xs truncate">{user.address}</td>
                      <td className="p-2 capitalize">
                        {user.role.replace("_", " ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Stores Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stores</CardTitle>
            <CardDescription>Manage all registered stores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Address</th>
                    <th className="text-left p-2">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStores.map((store) => (
                    <tr key={store._id} className="border-b hover:bg-muted/50">
                      <td className="p-2">{store.name}</td>
                      <td className="p-2">{store.email}</td>
                      <td className="p-2 max-w-xs truncate">{store.address}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          {store.averageRating.toFixed(1)} ({store.totalRatings}
                          )
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
