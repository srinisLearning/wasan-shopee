"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Users,
  ShieldCheck,
  User,
  Search,
  RefreshCw,
  Calendar,
  Phone,
  Mail,
  Check,
  AlertCircle,
  Shield,
  UserCheck,
  UserX,
  SlidersHorizontal,
} from "lucide-react";
import { IUser } from "@/interfaces";
import { getAllUsers, updateUserById } from "@/services/users";
import { useUserStore } from "@/store/user-store";
import PageTitle from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AdminUsersPage = () => {
  const { currentUser } = useUserStore();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Search and Filtering
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Confirmation dialog for self-demotion or critical role changes
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    user: IUser | null;
    targetRole?: "user" | "admin";
    targetStatus?: boolean;
    type: "role" | "status";
  }>({
    isOpen: false,
    user: null,
    type: "role",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error.message || "Failed to load users list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  // Handle Role Change
  const handleRoleChange = async (user: IUser, newRole: "user" | "admin") => {
    if (user.role === newRole) return;

    // Safety check: Prevent accidental self-demotion without explicit confirmation
    if (currentUser?.id === user.id && newRole === "user") {
      setConfirmModal({
        isOpen: true,
        user,
        targetRole: newRole,
        type: "role",
      });
      return;
    }

    await executeRoleUpdate(user.id, newRole);
  };

  const executeRoleUpdate = async (userId: string, newRole: "user" | "admin") => {
    try {
      setUpdatingUserId(userId);
      const res = await updateUserById(userId, { role: newRole });

      if (!res.success) {
        throw new Error(res.message || "Failed to update user role.");
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      toast.success(`User role updated to "${newRole}" successfully!`);
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast.error(error.message || "Failed to update user role.");
    } finally {
      setUpdatingUserId(null);
      setConfirmModal({ isOpen: false, user: null, type: "role" });
    }
  };

  // Handle Toggle Activation/Deactivation
  const handleToggleStatus = async (user: IUser) => {
    // Safety check: Admin cannot deactivate their own account
    if (currentUser?.id === user.id) {
      toast.error("You cannot deactivate your own active admin account.");
      return;
    }

    const targetStatus = !user.isActive;

    // If deactivating another admin, ask for confirmation
    if (user.role === "admin" && !targetStatus) {
      setConfirmModal({
        isOpen: true,
        user,
        targetStatus,
        type: "status",
      });
      return;
    }

    await executeStatusToggle(user.id, targetStatus);
  };

  const executeStatusToggle = async (userId: string, targetStatus: boolean) => {
    try {
      setUpdatingUserId(userId);
      const res = await updateUserById(userId, { isActive: targetStatus });

      if (!res.success) {
        throw new Error(res.message || "Failed to update account status.");
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: targetStatus } : u))
      );

      toast.success(
        `Account ${targetStatus ? "activated" : "deactivated"} successfully!`
      );
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Failed to update account status.");
    } finally {
      setUpdatingUserId(null);
      setConfirmModal({ isOpen: false, user: null, type: "status" });
    }
  };

  // Metrics Counters
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      inactive: users.filter((u) => !u.isActive).length,
      admins: users.filter((u) => u.role === "admin").length,
      regularUsers: users.filter((u) => u.role === "user").length,
    };
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filter criteria
      let matchesFilter = true;
      if (selectedFilter === "active") matchesFilter = user.isActive === true;
      if (selectedFilter === "inactive") matchesFilter = user.isActive === false;
      if (selectedFilter === "admin") matchesFilter = user.role === "admin";
      if (selectedFilter === "user") matchesFilter = user.role === "user";

      if (!matchesFilter) return false;

      // Search query
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      const nameMatch = user.name?.toLowerCase().includes(query);
      const emailMatch = user.email?.toLowerCase().includes(query);
      const idMatch = user.id?.toLowerCase().includes(query);
      const phoneMatch = user.mobile?.toLowerCase().includes(query);

      return Boolean(nameMatch || emailMatch || idMatch || phoneMatch);
    });
  }, [users, selectedFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <PageTitle title="User Accounts" />
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {users.length} {users.length === 1 ? "User" : "Users"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer accounts, assign administrative privileges, and control platform access.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
          disabled={loading}
          className="rounded-xl gap-2 shadow-xs cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Users
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { key: "all", label: "All Users", count: stats.total },
            { key: "active", label: "Active", count: stats.active },
            { key: "inactive", label: "Deactivated", count: stats.inactive },
            { key: "admin", label: "Admins", count: stats.admins },
            { key: "user", label: "Customers", count: stats.regularUsers },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedFilter(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedFilter === tab.key
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedFilter === tab.key
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by name, email, or user ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-card border-border/60 text-sm focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading user accounts...
          </p>
        </div>
      ) : users.length === 0 ? (
        <Card className="rounded-3xl border-dashed border-border/80 bg-card/60 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-foreground text-lg">No users found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Registered accounts will automatically show up here.
          </p>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-border/80 bg-card/60 p-10 text-center">
          <p className="text-muted-foreground font-medium text-sm">
            No users match your filter criteria &ldquo;{searchQuery || selectedFilter}&rdquo;
          </p>
          <Button
            variant="link"
            onClick={() => {
              setSelectedFilter("all");
              setSearchQuery("");
            }}
            className="mt-2 text-primary text-sm cursor-pointer"
          >
            Clear all filters
          </Button>
        </Card>
      ) : (
        <Card className="rounded-2xl border border-border/60 bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/60">
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground pl-4 min-w-[200px]">
                  User
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground min-w-[190px]">
                  Email Address
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground min-w-[130px]">
                  Phone
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground min-w-[140px]">
                  Role
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground min-w-[160px]">
                  Status & Activation
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground min-w-[120px] text-right pr-4">
                  Joined Date
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.map((user) => {
                const isSelf = currentUser?.id === user.id;
                const isUpdating = updatingUserId === user.id;
                const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

                return (
                  <TableRow
                    key={user.id}
                    className="hover:bg-muted/30 transition-colors border-b border-border/40"
                  >
                    {/* 1. User (Avatar + Name + ID) */}
                    <TableCell className="pl-4 py-3 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0">
                          {initial}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground truncate max-w-[180px]">
                              {user.name || "Unnamed User"}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-primary text-primary-foreground">
                                You
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-[11px] text-muted-foreground truncate max-w-[160px]">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Email Address */}
                    <TableCell className="py-3 align-middle">
                      <div className="flex items-center gap-1.5 text-sm text-foreground">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[200px]">{user.email}</span>
                      </div>
                    </TableCell>

                    {/* 3. Phone */}
                    <TableCell className="py-3 align-middle">
                      <span className="text-xs text-foreground font-medium">
                        {user.mobile || "—"}
                      </span>
                    </TableCell>

                    {/* 4. Role (Provision for changing roles) */}
                    <TableCell className="py-3 align-middle">
                      <div className="w-32">
                        <Select
                          value={user.role}
                          onValueChange={(val) =>
                            handleRoleChange(user, val as "user" | "admin")
                          }
                          disabled={isUpdating}
                        >
                          <SelectTrigger className="h-8 text-xs font-semibold rounded-xl border-border/60 bg-muted/40 cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="user" className="text-xs cursor-pointer">
                              <div className="flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-blue-600" />
                                <span>User</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="admin" className="text-xs cursor-pointer">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                <span>Admin</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>

                    {/* 5. Status & Toggle Button Activation/Deactivation */}
                    <TableCell className="py-3 align-middle">
                      <div className="flex items-center gap-3">
                        {/* Custom Toggle Switch */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={user.isActive}
                          onClick={() => handleToggleStatus(user)}
                          disabled={isUpdating || isSelf}
                          title={
                            isSelf
                              ? "Cannot deactivate your own account"
                              : user.isActive
                              ? "Click to deactivate user"
                              : "Click to activate user"
                          }
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40 shadow-2xs",
                            user.isActive ? "bg-emerald-500" : "bg-muted-foreground/30"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out",
                              user.isActive ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>

                        {/* Status Badge */}
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                            user.isActive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          )}
                        >
                          {user.isActive ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3" />
                              Deactivated
                            </>
                          )}
                        </span>
                      </div>
                    </TableCell>

                    {/* 6. Joined Date */}
                    <TableCell className="py-3 align-middle text-right pr-4">
                      <span className="text-xs text-muted-foreground font-medium">
                        {formatDate(user.created_at)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Confirmation Dialog for Role Demotion or Deactivation */}
      <Dialog
        open={confirmModal.isOpen}
        onOpenChange={(open) => !open && setConfirmModal({ isOpen: false, user: null, type: "role" })}
      >
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-lg font-bold">
              {confirmModal.type === "role"
                ? "Confirm Role Modification"
                : "Confirm Account Deactivation"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              {confirmModal.type === "role" ? (
                <>
                  You are attempting to change the role of{" "}
                  <span className="font-semibold text-foreground">
                    {confirmModal.user?.name}
                  </span>{" "}
                  to <span className="font-semibold text-foreground uppercase">{confirmModal.targetRole}</span>.
                  {confirmModal.user?.id === currentUser?.id && (
                    <span className="block mt-1 text-destructive font-semibold">
                      Warning: Demoting your own logged-in account will immediately revoke your administrative privileges!
                    </span>
                  )}
                </>
              ) : (
                <>
                  Are you sure you want to deactivate administrative account{" "}
                  <span className="font-semibold text-foreground">
                    {confirmModal.user?.name}
                  </span>
                  ? This will revoke their platform access until re-activated.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-3 border-t border-border/40">
            <Button
              variant="outline"
              onClick={() => setConfirmModal({ isOpen: false, user: null, type: "role" })}
              className="rounded-xl px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant={confirmModal.type === "role" ? "default" : "destructive"}
              onClick={() => {
                if (confirmModal.type === "role" && confirmModal.user && confirmModal.targetRole) {
                  executeRoleUpdate(confirmModal.user.id, confirmModal.targetRole);
                } else if (confirmModal.type === "status" && confirmModal.user && confirmModal.targetStatus !== undefined) {
                  executeStatusToggle(confirmModal.user.id, confirmModal.targetStatus);
                }
              }}
              className="rounded-xl px-5 font-semibold cursor-pointer shadow-xs"
            >
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;
