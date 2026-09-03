"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Fingerprint,
  Phone,
  Calendar,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  MapPin,
  Package,
  LayoutDashboard,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { updateUserPassword } from "@/services/users";
import PageTitle from "@/components/ui/page-title";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";

const UserProfilePage = () => {
  const { currentUser } = useUserStore();
  const [copied, setCopied] = useState<boolean>(false);

  // Update password states
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [updatingPassword, setUpdatingPassword] = useState<boolean>(false);

  const copyUserId = () => {
    if (!currentUser?.id) return;
    navigator.clipboard.writeText(currentUser.id);
    setCopied(true);
    toast.success("User ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both new password and confirm password.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (currentPassword && currentPassword === newPassword) {
      toast.error("New password must be different from current password.");
      return;
    }

    try {
      setUpdatingPassword(true);
      await updateUserPassword(
        newPassword,
        currentPassword || undefined,
        currentUser?.email
      );

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header - Flex Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <PageTitle title="My Profile" />
          <p className="text-sm text-muted-foreground mt-1">
            Personal identity, credentials, security, and registered account details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/user/dashboard">
            <Button variant="outline" size="sm" className="rounded-xl gap-2 shadow-xs">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/user/orders">
            <Button size="sm" className="rounded-xl gap-2 shadow-xs">
              <Package className="w-4 h-4" />
              My Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* User Hero Banner - Flex Layout */}
      <Card className="rounded-3xl border border-border/60 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 shadow-xs overflow-hidden relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-3xl shadow-md shrink-0">
              {initial}
            </div>

            {/* Basic Info */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground truncate">
                  {currentUser.name || "User"}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {currentUser.isActive ? "Active Account" : "Inactive"}
                </span>
                <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/user/addresses">
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs bg-background/80">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                Shipping Addresses
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      </Card>

      {/* Primary Credentials Grid - Grid & Flex Layout for Name, Email, and User ID */}
      <div>
        <h2 className="text-lg font-bold text-foreground tracking-tight mb-4">
          Account Identification
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Name Card */}
          <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs hover:border-primary/40 transition-all">
            <CardContent className="p-0 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xl font-bold text-foreground break-words">
                  {currentUser.name || "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">Registered customer name</p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Email Card */}
          <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs hover:border-primary/40 transition-all">
            <CardContent className="p-0 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xl font-bold text-foreground break-all">
                  {currentUser.email}
                </p>
                <p className="text-xs text-muted-foreground">Primary login & notifications</p>
              </div>
            </CardContent>
          </Card>

          {/* 3. User ID Card */}
          <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs hover:border-primary/40 transition-all">
            <CardContent className="p-0 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  User ID
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Fingerprint className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-muted/50 border border-border/50">
                  <span className="font-mono text-xs text-foreground truncate font-semibold">
                    {currentUser.id}
                  </span>
                  <button
                    type="button"
                    onClick={copyUserId}
                    title="Copy User ID"
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Unique identifier in database</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Update Password Section - Flex & Grid Layout */}
      <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs">
        <CardHeader className="p-0 pb-4 mb-5 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Update Password
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Ensure your account is protected with a secure, strong password.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-2xl">
            {/* Current Password Field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="current-password"
                className="text-xs font-semibold text-foreground"
              >
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="h-10 pr-10 rounded-xl bg-muted/30 border-border/60 text-sm focus:bg-background"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-0.5"
                  title={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password & Confirm Password - Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="new-password"
                  className="text-xs font-semibold text-foreground"
                >
                  New Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="h-10 pr-10 rounded-xl bg-muted/30 border-border/60 text-sm focus:bg-background"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-0.5"
                    title={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirm-password"
                  className="text-xs font-semibold text-foreground"
                >
                  Confirm New Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="h-10 pr-10 rounded-xl bg-muted/30 border-border/60 text-sm focus:bg-background"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-0.5"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Hint */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use a minimum of 6 characters with a combination of letters, numbers, and special symbols for maximum security.
            </p>

            {/* Action Button */}
            <div className="pt-1 flex items-center gap-3">
              <Button
                type="submit"
                disabled={updatingPassword || !newPassword || !confirmPassword}
                className="rounded-xl px-5 h-10 gap-2 font-semibold shadow-xs"
              >
                {updatingPassword ? (
                  <>
                    <Spinner size="sm" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </Button>

              {(newPassword || confirmPassword || currentPassword) && !updatingPassword && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="rounded-xl text-xs text-muted-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Additional Profile Metadata - Grid Layout */}
      <Card className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs">
        <CardHeader className="p-0 pb-4 mb-4 border-b border-border/40">
          <CardTitle className="text-base font-bold text-foreground">
            Account Details & Security
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Phone Number */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted/60 border border-border/40 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Mobile Phone
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {currentUser.mobile || "Not provided"}
                </p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted/60 border border-border/40 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Member Since
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {formatDate(currentUser.created_at)}
                </p>
              </div>
            </div>

            {/* Account Role */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted/60 border border-border/40 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Access Role
                </p>
                <p className="text-sm font-semibold text-foreground capitalize">
                  {currentUser.role || "User"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
