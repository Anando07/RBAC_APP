import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Navigate } from "react-router";
import useAuth from "@/auth/store";
import type User from "@/models/User";
import type Role from "@/models/Role";
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
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllRoles,
  normalizeUser,
  uploadUserImage,
  type UserMutation,
} from "@/services/UserManagementService";

const ITEMS_PER_PAGE = 5;

interface UserFormData {
  name: string;
  email: string;
  provider: string;
  enabled: boolean;
  password: string;
  confirmPassword: string;
  image: string;
  roleId: string;
}

const EMPTY_FORM: UserFormData = {
  name: "",
  email: "",
  provider: "LOCAL",
  enabled: true,
  password: "",
  confirmPassword: "",
  image: "",
  roleId: "",
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    const responseData = error.response?.data;
    return responseData?.message || responseData?.error || fallback;
  }
  return fallback;
};

function UserManagementContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);

      setRoles((currentRoles) => {
        if (currentRoles.length > 0) return currentRoles;
        return Array.from(
          new Map(
            data
              .flatMap((item) => item.roles ?? [])
              .filter((role) => role?.id && role?.name)
              .map((role) => [role.id, role])
          ).values()
        );
      });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to fetch users"));
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getAllRoles();
      setRoles(data);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to fetch roles"));
    }
  };

  useEffect(() => {
    void fetchUsers();
    void fetchRoles();
  }, []);

  const handleOpenForm = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name || "",
        email: user.email,
        provider: user.provider || "LOCAL",
        enabled: user.enabled ?? user.enable ?? true,
        password: "",
        confirmPassword: "",
        image: user.image || "",
        roleId: user.roles?.[0]?.id ? String(user.roles[0].id) : "",
      });
    } else {
      setEditingUser(null);
      setFormData(EMPTY_FORM);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
    setFormData(EMPTY_FORM);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    try {
      const imageUrl = await uploadUserImage(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Image upload failed"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    if (!editingUser && !formData.password) {
      toast.error("Password is required");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const selectedRole = roles.find((r) => String(r.id) === String(formData.roleId));

    const payload: UserMutation = {
      name: formData.name,
      email: formData.email,
      provider: formData.provider,
      enabled: formData.enabled,
      image: formData.image,
      roles: selectedRole ? [{ id: String(selectedRole.id), name: selectedRole.name }] : [],
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      setSubmitting(true);

      if (editingUser) {
        const updated = await updateUser(editingUser.id, payload);
        const mergedUser = normalizeUser({
          ...editingUser,
          ...updated,
          name: formData.name,
          email: formData.email,
          image: formData.image,
          provider: formData.provider,
          roles: selectedRole
            ? [{ id: String(selectedRole.id), name: selectedRole.name }]
            : editingUser.roles,
          enabled: formData.enabled,
        });

        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? mergedUser : u))
        );
        toast.success("User updated successfully");
      } else {
        const created = await createUser(payload);
        setUsers((prev) => [created, ...prev]);
        toast.success("User created successfully");
      }

      handleCloseForm();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to save user"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const currentStatus = user.enabled ?? user.enable ?? true;

    try {
      setActionLoadingId(String(user.id));
      const updated = await updateUser(String(user.id), { enabled: !currentStatus });

      setUsers((prev) =>
        prev.map((u) => (u.id === String(user.id) ? updated : u))
      );

      toast.success(
        `User account set to ${updated.enabled ? "Active" : "Inactive"}`
      );
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to update status"));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        setActionLoadingId(id);
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success("User deleted successfully");
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Failed to delete user"));
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.provider?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Directory</h1>
          <p className="text-muted-foreground text-sm">
            Manage system users, dynamic roles, and account access states.
          </p>
        </div>
        <Button onClick={() => handleOpenForm()} className="gap-2 rounded-xl">
          <Plus className="w-4 h-4" /> Add New User
        </Button>
      </div>

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
                  ? "Modify account metadata and dynamic user permissions."
                  : "Provide mandatory parameters to onboard a user."}
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
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium">Profile Image</label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={formData.image} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {formData.name ? formData.name.slice(0, 2).toUpperCase() : "US"}
                    </AvatarFallback>
                  </Avatar>

                  <label className="flex items-center gap-2 text-sm px-3 py-2 border border-input rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="w-4 h-4" />
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={submitting}
                      className="hidden"
                    />
                  </label>

                  {formData.image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      disabled={submitting}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  placeholder="e.g. Anand Biswas"
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
                <label className="text-sm font-medium">
                  Password{" "}
                  {editingUser && (
                    <span className="text-xs text-muted-foreground font-normal">
                      (leave blank to keep current)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="rounded-xl pr-10"
                    required={!editingUser}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="rounded-xl pr-10"
                    required={!editingUser || formData.password.length > 0}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                    title={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
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
                <label className="text-sm font-medium">Role</label>
                <select
                  value={formData.roleId}
                  onChange={(e) =>
                    setFormData({ ...formData, roleId: e.target.value })
                  }
                  disabled={submitting || roles.length === 0}
                  className="w-full h-10 px-3 rounded-xl bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">
                    {roles.length === 0 ? "Loading roles..." : "Select User Role"}
                  </option>
                  {roles.map((role) => (
                    <option key={String(role.id)} value={String(role.id)}>
                      {(role.name || "ROLE_USER").replace(/^ROLE_/, "")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
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
                  <th className="p-3 font-medium">Role</th>
                  <th className="p-3 font-medium">Provider</th>
                  <th className="p-3 font-medium">Status</th>
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
                    const isUserEnabled = user.enabled ?? user.enable ?? true;

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
                          <Badge variant="secondary" className="rounded-lg text-xs font-medium">
                            {user.roles?.[0]?.name?.replace(/^ROLE_/, "") || "GUEST"}
                          </Badge>
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
                            ) : isUserEnabled ? (
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

function UserManagement() {
  const user = useAuth((state) => state.user);

  const allowed = ["ADMIN", "ADMINISTRATOR", "USER_MANAGER"];
  const canManageUsers = !!user?.roles?.some((role) => {
    const name = (role?.name || "").toString().toUpperCase().replace(/^ROLE_/, "");
    return allowed.includes(name);
  });

  return canManageUsers ? <UserManagementContent /> : <Navigate to="/dashboard" replace />;
}

export default UserManagement;