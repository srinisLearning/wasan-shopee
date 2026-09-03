"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  DollarSign,
  XCircle,
  Clock,
  Truck,
  CheckCircle2,
  Users,
  Layers,
  LayoutGrid,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Calendar,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { IOrder } from "@/interfaces";
import { getAllOrders } from "@/services/orders";
import { getUsersCount } from "@/services/users";
import { getProductsCount } from "@/services/products";
import { getCategoriesCount } from "@/services/categories";
import DashboardCard from "@/components/dashboard-card";
import PageTitle from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  "order placed": {
    label: "Order Placed",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Clock,
  },
  placed: {
    label: "Order Placed",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: RefreshCw,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: XCircle,
  },
};

const AdminDashboardPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [productsCount, setProductsCount] = useState<number>(0);
  const [categoriesCount, setCategoriesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Optimized: Fetch full order records for metrics/recent orders,
      // but only exact counts for users, products, and categories (head: true)
      const [ordersRes, usersCountRes, productsCountRes, categoriesCountRes] =
        await Promise.all([
          getAllOrders(),
          getUsersCount(),
          getProductsCount(),
          getCategoriesCount(),
        ]);

      if (ordersRes.success && ordersRes.data) {
        setOrders(ordersRes.data);
      } else {
        setOrders([]);
      }

      setUsersCount(usersCountRes.count || 0);
      setProductsCount(productsCountRes.count || 0);
      setCategoriesCount(categoriesCountRes.count || 0);
    } catch (error: any) {
      console.error("Error loading dashboard data:", error);
      toast.error(error.message || "Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Orders Report Calculations
  const ordersReport = useMemo(() => {
    const totalOrders = orders.length;

    // Total Amount: sum of all order totals (excluding cancelled)
    const totalAmount = orders
      .filter((o) => (o.status || "").toLowerCase() !== "cancelled")
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    // Cancelled Orders
    const cancelledOrders = orders.filter(
      (o) => (o.status || "").toLowerCase() === "cancelled"
    ).length;

    // Yet to Deliver: orders awaiting completion (not delivered and not cancelled)
    const yetToDeliver = orders.filter((o) => {
      const s = (o.status || "").toLowerCase();
      return s !== "delivered" && s !== "cancelled";
    }).length;

    return {
      totalOrders,
      totalAmount,
      cancelledOrders,
      yetToDeliver,
    };
  }, [orders]);

  // Shop Report Calculations (Optimized to use lightweight counts)
  const shopReport = useMemo(() => {
    return {
      totalUsers: usersCount,
      totalProducts: productsCount,
      totalCategories: categoriesCount,
    };
  }, [usersCount, productsCount, categoriesCount]);


  const recentOrders = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

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

  const getStatusBadge = (status?: string) => {
    const normalized = (status || "order placed").toLowerCase();
    const config =
      statusConfig[normalized] || {
        label: status || "Order Placed",
        color: "bg-muted text-muted-foreground border-border",
        icon: Clock,
      };
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Aggregating store statistics and orders report...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-9 animate-in fade-in duration-300">
      {/* Top Banner / Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Store Analytics & Operations
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Admin Control Center
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Real-time monitoring of customer purchases, revenue totals, catalog items, and pending fulfillment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              disabled={loading}
              className="rounded-xl gap-2 shadow-xs cursor-pointer bg-background/80 backdrop-blur-xs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/admin/orders">
              <Button size="sm" className="rounded-xl gap-2 shadow-xs font-semibold">
                <ShoppingBag className="w-4 h-4" />
                Manage Orders
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      </div>

      {/* 1. ORDERS REPORT SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Orders Report
            </h2>
            <p className="text-xs text-muted-foreground">
              Summary of customer purchases, total sales revenue, and delivery statuses.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Go to Orders ({orders.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Orders */}
          <DashboardCard
            title="Total Orders"
            value={ordersReport.totalOrders}
            icon={<ShoppingBag className="w-5 h-5" />}
            color="bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
            description="All orders placed by customers"
            href="/admin/orders"
          />

          {/* Total Amount */}
          <DashboardCard
            title="Total Amount"
            value={`$${ordersReport.totalAmount.toFixed(2)}`}
            icon={<DollarSign className="w-5 h-5" />}
            color="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
            description="Revenue from completed/active orders"
            href="/admin/orders"
          />

          {/* Cancelled Orders */}
          <DashboardCard
            title="Cancelled Orders"
            value={ordersReport.cancelledOrders}
            icon={<XCircle className="w-5 h-5" />}
            color="bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
            description="Voided or cancelled customer orders"
            href="/admin/orders"
          />

          {/* Yet to Deliver */}
          <DashboardCard
            title="Yet to Deliver"
            value={ordersReport.yetToDeliver}
            icon={<Truck className="w-5 h-5" />}
            color="bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
            description="Awaiting preparation or transit"
            href="/admin/orders"
          />
        </div>
      </div>

      {/* 2. SHOP REPORT SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Shop Report
            </h2>
            <p className="text-xs text-muted-foreground">
              Overview of registered customers, product listings, and store inventory categories.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-primary">
            <Link href="/admin/users" className="hover:underline flex items-center gap-0.5">
              Users ({shopReport.totalUsers})
            </Link>
            <span>•</span>
            <Link href="/admin/products" className="hover:underline flex items-center gap-0.5">
              Products ({shopReport.totalProducts})
            </Link>
            <span>•</span>
            <Link href="/admin/categories" className="hover:underline flex items-center gap-0.5">
              Categories ({shopReport.totalCategories})
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total Users */}
          <DashboardCard
            title="Total Users"
            value={shopReport.totalUsers}
            icon={<Users className="w-5 h-5" />}
            color="bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400"
            description="Registered user accounts in database"
            href="/admin/users"
          />

          {/* Total Products */}
          <DashboardCard
            title="Total Products"
            value={shopReport.totalProducts}
            icon={<Package className="w-5 h-5" />}
            color="bg-teal-100 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400"
            description="Active products listed in the store"
            href="/admin/products"
          />

          {/* Total Categories */}
          <DashboardCard
            title="Total Categories"
            value={shopReport.totalCategories}
            icon={<LayoutGrid className="w-5 h-5" />}
            color="bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
            description="Product classifications & collections"
            href="/admin/categories"
          />
        </div>
      </div>

      {/* 3. RECENT ORDERS & QUICK SHORTCUTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Recent Orders Preview (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Recent Orders
            </h3>
            {orders.length > 0 && (
              <Link
                href="/admin/orders"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                View all orders ({orders.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {recentOrders.length === 0 ? (
            <Card className="rounded-2xl border-dashed border-border/80 bg-card/60 p-8 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Package className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-foreground text-sm">No orders yet</h4>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                Customer purchases will automatically appear here once transactions are completed.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const itemsCount = (order.items || []).reduce(
                  (sum, item) => sum + (item.quantity || 1),
                  0
                );
                return (
                  <Card
                    key={order.id}
                    className="overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-primary/40 transition-all p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border/40 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-sm text-foreground">
                              #{String(order.id).slice(0, 10)}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(order.created_at)}
                            </span>
                            <span>•</span>
                            <span>
                              {itemsCount} {itemsCount === 1 ? "item" : "items"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                        <div className="sm:text-right">
                          <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                            Total
                          </p>
                          <p className="text-sm font-bold font-mono text-foreground">
                            ${Number(order.total || 0).toFixed(2)}
                          </p>
                        </div>
                        <Link href="/admin/orders">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl text-xs gap-1.5 h-8 px-3 hover:border-primary/40 hover:text-primary"
                          >
                            Manage
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Management Shortcuts (1 Col) */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground tracking-tight">
            Store Management
          </h3>

          <Card className="rounded-2xl border border-border/60 bg-card p-5 space-y-2.5 shadow-xs">
            <Link
              href="/admin/orders"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-primary/5 hover:border-primary/20 border border-border/40 text-xs font-semibold text-foreground transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <span>Orders Fulfillment</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-primary/5 hover:border-primary/20 border border-border/40 text-xs font-semibold text-foreground transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-teal-600" />
                <span>Catalog & Products</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-primary/5 hover:border-primary/20 border border-border/40 text-xs font-semibold text-foreground transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-4 h-4 text-indigo-600" />
                <span>Category Taxonomies</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-primary/5 hover:border-primary/20 border border-border/40 text-xs font-semibold text-foreground transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-purple-600" />
                <span>User Accounts</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-primary/5 hover:border-primary/20 border border-border/40 text-xs font-semibold text-foreground transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Security & Admin Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;