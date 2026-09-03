"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import DashboardCard from "./_components/dashboard-card";
import { useUserStore } from "@/store/user-store";
import { getOrdersOfUser } from "@/services/orders";
import { IOrder } from "@/interfaces";
import Spinner from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingBag,
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

const statusConfig: Record<
  string,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  }
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
    color:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: RefreshCw,
  },
  shipped: {
    label: "Shipped",
    color:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    icon: Package,
  },
  delivered: {
    label: "Delivered",
    color:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: XCircle,
  },
};

const UserDashboardPage = () => {
  const { currentUser } = useUserStore();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await getOrdersOfUser(currentUser.id);
        if (res.success && res.data) {
          setOrders(res.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser?.id]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;

    const totalSpent = orders
      .filter((o) => (o.status || "").toLowerCase() !== "cancelled")
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const totalPurchased = orders
      .filter((o) => (o.status || "").toLowerCase() !== "cancelled")
      .reduce((sum, o) => {
        const items = o.items || [];
        return (
          sum +
          items.reduce(
            (itemSum, item) => itemSum + (Number(item.quantity) || 1),
            0,
          )
        );
      }, 0);

    const cancelledOrders = orders.filter(
      (o) => (o.status || "").toLowerCase() === "cancelled",
    ).length;

    const deliveredOrders = orders.filter(
      (o) => (o.status || "").toLowerCase() === "delivered",
    ).length;

    const processingOrders = orders.filter((o) => {
      const s = (o.status || "").toLowerCase();
      return (
        s === "processing" ||
        s === "order placed" ||
        s === "placed" ||
        s === "shipped"
      );
    }).length;

    return {
      totalOrders,
      totalSpent,
      totalPurchased,
      cancelledOrders,
      deliveredOrders,
      processingOrders,
    };
  }, [orders]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 4);
  }, [orders]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status?: string) => {
    const normalized = (status || "order placed").toLowerCase();
    const config = statusConfig[normalized] || {
      label: status || "Order Placed",
      color: "bg-muted text-muted-foreground border-border",
      icon: Clock,
    };
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Page Title & User Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            User Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back,{" "}
            <span className="font-semibold text-foreground">
              {currentUser?.name || "Shopper"}
            </span>
            ! Here is a summary of your activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/user/products">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-2 shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Products
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

      {/* Dashboard cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Total Orders */}
        <DashboardCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="📦"
          color="bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
          description="Total orders placed on your account"
          href="/user/orders"
        />

        {/* 2. Total Amount Spent */}
        <DashboardCard
          title="Total Amount Spent"
          value={`₹${stats.totalSpent.toFixed(2)}`}
          icon="🛍️"
          color="bg-green-100 text-green-600 dark:bg-emerald-950/50 dark:text-emerald-400"
          description="Lifetime money spent on completed orders"
          href="/user/orders"
        />

        {/* 3. Total Items Purchased */}
        <DashboardCard
          title="Total Items Purchased"
          value={stats.totalPurchased}
          icon="📦"
          color="bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400"
          description="Cumulative quantity of items bought"
          href="/user/orders"
        />

        {/* 4. Cancelled Orders */}
        <DashboardCard
          title="Cancelled Orders"
          value={stats.cancelledOrders}
          icon="❌"
          color="bg-red-100 text-red-600 dark:bg-rose-950/50 dark:text-rose-400"
          description="Orders cancelled or voided"
          href="/user/orders"
        />

        {/* 5. Delivered Orders */}
        <DashboardCard
          title="Delivered Orders"
          value={stats.deliveredOrders}
          icon="✅"
          color="bg-green-100 text-green-600 dark:bg-emerald-950/50 dark:text-emerald-400"
          description="Orders successfully delivered to you"
          href="/user/orders"
        />

        {/* 6. Processing Orders */}
        <DashboardCard
          title="Processing Orders"
          value={stats.processingOrders}
          icon="🔄"
          color="bg-yellow-100 text-yellow-600 dark:bg-amber-950/50 dark:text-amber-400"
          description="Active orders currently in progress"
          href="/user/orders"
        />
      </div>

      {/* Recent Orders Preview */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground tracking-tight">
            Recent Orders
          </h2>
          {orders.length > 0 && (
            <Link
              href="/user/orders"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View all ({orders.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-border/80 bg-card/60 p-8 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground text-sm">No orders yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
              You haven&apos;t placed any orders yet. Discover trending products
              and start shopping today!
            </p>
            <Link href="/user/products">
              <Button size="sm" className="rounded-xl gap-2 font-semibold">
                <ShoppingBag className="w-3.5 h-3.5" /> Start Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentOrders.map((order) => {
              const itemsCount = (order.items || []).reduce(
                (sum, item) => sum + (item.quantity || 1),
                0,
              );
              return (
                <Card
                  key={order.id}
                  className="rounded-2xl border border-border/60 bg-card hover:border-primary/40 transition-all p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-sm text-foreground">
                      #{String(order.id).slice(0, 10)}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {itemsCount} {itemsCount === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                        Total
                      </span>
                      <span className="font-bold text-sm font-mono text-foreground">
                        ₹{Number(order.total || 0).toFixed(2)}
                      </span>
                    </div>

                    <Link href="/user/orders">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl text-xs gap-1 h-8 text-primary hover:text-primary hover:bg-primary/10"
                      >
                        Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
