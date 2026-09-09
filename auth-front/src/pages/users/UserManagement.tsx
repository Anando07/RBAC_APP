import { useState, useEffect, useMemo } from "react";
import type User from "@/models/User";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  X,
  UserPlus,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/UserManagementService";

const ITEMS_PER_PAGE = 5;

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    provider: "LOCAL",
    enabled: true,
  });

  // Fetch Users from API on component mount
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch user directory"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset or initialize form
  const handleOpenForm = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || "",
        email: user.email,
        provider: user.provider || "LOCAL",
        enabled: user.enabled,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        provider: "LOCAL",
        enabled: true,
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  // Create or Update Action via API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    try {
      setSubmitting(true);
      if (editingUser) {
        // Update user endpoint
        const updated = await updateUser(editingUser.id, formData);
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? updated : u))
        );
        toast.success("User updated successfully");
      } else {
        // Create user endpoint
        const created = await createUser(formData);
        setUsers((prev) => [created, ...prev]);
        toast.success("User added successfully");
      }
      handleCloseForm();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to save user details"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Active/Inactive Status via API
  const handleToggleStatus = async (user: User) => {
    try {
      setActionLoadingId(user.id);
      const updated = await updateUser(user.id, {
        ...user,
        enabled: !user.enabled,
      });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
      toast.success(
        `User status set to ${updated.enabled ? "Active" : "Inactive"}`
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update user status"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Action via API
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        setActionLoadingId(id);
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success("User deleted successfully");
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete user account"
        );
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  // Search & Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.provider?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Directory</h1>
          <p className="text-muted-foreground text-sm">
            Manage user accounts, update profile settings, and toggle access states.
          </p>
        </div>
        <Button onClick={() => handleOpenForm()} className="gap-2 rounded-xl">
          <Plus className="w-4 h-4" /> Add New User
        </Button>
      </div>

      {/* Add / Edit Form Card */}
      {isFormOpen && (
        <Card className="border-border shadow-md rounded-2xl bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                {editingUser ? "Edit User Account" : "Create New User Account"}
              </CardTitle>
              <CardDescription>
                {editingUser
                  ? "Update profile parameters and status."
                  : "Fill in details to register a new user."}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseForm}
              className="rounded-full"
              disabled={submitting}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  placeholder="e.g. Ananda Biswas"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="rounded-xl"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="rounded-xl"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Provider</label>
                <select
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData({ ...formData, provider: e.target.value })
                  }
                  disabled={submitting}
                  className="w-full h-10 px-3 rounded-xl bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="LOCAL">LOCAL</option>
                  <option value="GOOGLE">GOOGLE</option>
                  <option value="GITHUB">GITHUB</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Account Status</label>
                <div className="flex items-center gap-4 h-10">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.enabled === true}
                      onChange={() =>
                        setFormData({ ...formData, enabled: true })
                      }
                      disabled={submitting}
                      className="accent-primary"
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.enabled === false}
                      onChange={() =>
                        setFormData({ ...formData, enabled: false })
                      }
                      disabled={submitting}
                      className="accent-primary"
                    />
                    Inactive
                  </label>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                  className="rounded-xl"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl gap-2" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingUser ? "Save Changes" : "Create Account"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Main Table Card */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader className="pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Filter by name, email or provider..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 rounded-xl"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Showing {paginatedUsers.length} of {filteredUsers.length} records
          </p>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground bg-muted/30">
                  <th className="p-3 font-medium">User Profile</th>
                  <th className="p-3 font-medium">Provider</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Created Date</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span>Loading directory records...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => {
                    const isActioning = actionLoadingId === user.id;
                    return (
                      <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.image} />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {user.name
                                  ? user.name.slice(0, 2).toUpperCase()
                                  : "US"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-foreground">
                                {user.name || "N/A"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="rounded-lg text-xs">
                            {user.provider || "LOCAL"}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleStatus(user)}
                            disabled={isActioning}
                            className="flex items-center gap-1.5 cursor-pointer text-xs font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
                            title="Click to toggle status"
                          >
                            {isActioning ? (
                              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            ) : user.enabled ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span className="text-green-600 font-semibold">Active</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-destructive" />
                                <span className="text-destructive font-semibold">Inactive</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="p-3 text-muted-foreground text-xs">
                          {user.createdAt || "N/A"}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg"
                              onClick={() => handleOpenForm(user)}
                              disabled={isActioning}
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(user.id)}
                              disabled={isActioning}
                              title="Delete User"
                            >
                              {isActioning ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No matching users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
            <span className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                disabled={currentPage >= totalPages || loading}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserManagement;