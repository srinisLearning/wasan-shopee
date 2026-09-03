"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Search,
  Copy,
  Check,
  Eye,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { IOrder, IAddress } from "@/interfaces";
import { getOrdersOfUser } from "@/services/orders";
import { getUserAddresses } from "@/services/addresses";
import { useUserStore } from "@/store/user-store";
import PageTitle from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  "order placed": {
    label: "Order Placed",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: Clock,
  },
  placed: {
    label: "Order Placed",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    icon: RefreshCw,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    icon: XCircle,
  },
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
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

const UserOrdersPage = () => {
  const { currentUser } = useUserStore();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [addresses, setAddresses] = useState<Record<string, IAddress>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.id) return;
      try {
        setLoading(true);

        const [ordersRes, addressesRes] = await Promise.all([
          getOrdersOfUser(currentUser.id),
          getUserAddresses(currentUser.id).catch(() => []),
        ]);

        if (ordersRes.success && ordersRes.data) {
          setOrders(ordersRes.data);
        } else {
          setOrders([]);
        }

        if (addressesRes && Array.isArray(addressesRes)) {
          const map: Record<string, IAddress> = {};
          addressesRes.forEach((addr) => {
            if (addr.id) map[addr.id] = addr;
          });
          setAddresses(map);
        }
      } catch (error: any) {
        console.error("Error loading orders:", error);
        toast.error(error.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.id]);

  const copyToClipboard = (text: string | number) => {
    const str = String(text ?? "");
    if (!str) return;
    navigator.clipboard.writeText(str);
    setCopiedId(str);
    toast.success("Order ID copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        selectedStatus === "all" ||
        (order.status || "order placed").toLowerCase() === selectedStatus.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesStatus;

      const matchesId = String(order.id ?? "")
        .toLowerCase()
        .includes(query);
      const matchesItem = order.items?.some((item) =>
        item.name?.toLowerCase().includes(query),
      );

      return matchesStatus && (matchesId || matchesItem);
    });
  }, [orders, selectedStatus, searchQuery]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 px-4 md:px-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <PageTitle title="My Orders" />
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Track, view receipts, and manage all your purchases.
          </p>
        </div>

        <Link href="/user/products">
          <Button variant="outline" className="rounded-xl gap-2 shadow-sm">
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {[
            { key: "all", label: "All Orders" },
            { key: "order placed", label: "Placed" },
            { key: "processing", label: "Processing" },
            { key: "shipped", label: "Shipped" },
            { key: "delivered", label: "Delivered" },
          ].map((status) => (
            <button
              key={status.key}
              onClick={() => setSelectedStatus(status.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedStatus === status.key
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by order ID or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-card border-border/60 text-sm focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your order history...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border-dashed border-border/80 p-8 shadow-none bg-card/50">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Package className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No orders yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
            You haven't placed any orders yet. Discover our latest collections and start shopping today!
          </p>
          <Link href="/user/products">
            <Button size="lg" className="rounded-xl px-6 gap-2 shadow-sm">
              <ShoppingBag className="w-4 h-4" /> Start Shopping
            </Button>
          </Link>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border-dashed border-border/80 p-6">
          <p className="text-muted-foreground font-medium">
            No orders match your filter &ldquo;{searchQuery || selectedStatus}&rdquo;
          </p>
          <Button
            variant="link"
            onClick={() => {
              setSelectedStatus("all");
              setSearchQuery("");
            }}
            className="mt-2 text-primary text-sm"
          >
            Clear all filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const address = order.address_id ? addresses[order.address_id] : null;
            const items = order.items || [];
            const itemCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

            return (
              <Card
                key={order.id}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:px-6 bg-muted/20 border-b border-border/40">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground font-medium">Order</span>
                      <span className="font-semibold text-foreground">
                        #{String(order.id ?? "").slice(0, 8).toUpperCase()}
                      </span>
                      <button
                        onClick={() => copyToClipboard(order.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
                        title="Copy full Order ID"
                      >
                        {copiedId === String(order.id) ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block">Total Amount</span>
                      <span className="text-lg font-bold text-primary">
                        ${order.total?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <CardContent className="p-5 sm:p-6 divide-y divide-border/40">
                  {items.map((item, idx) => (
                    <div
                      key={item.id ? `${item.id}-${idx}` : idx}
                      className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/50 flex items-center justify-center">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-muted-foreground/50" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {item.description || "Product details"}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>
                            Qty: <strong className="text-foreground">{item.quantity || 1}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Price: <strong className="text-foreground">${item.price?.toFixed(2)}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-sm sm:text-base text-foreground">
                          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Order Bottom Info & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:px-6 bg-muted/10 border-t border-border/40 text-xs text-muted-foreground">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-y-2 gap-x-6">
                    {address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span>
                          Ship to: <strong className="text-foreground">{address.name}</strong> ({address.city}, {address.state})
                        </span>
                      </div>
                    )}
                    {order.payment_id && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary shrink-0" />
                        <span>
                          Payment:{" "}
                          <span className="font-mono text-[11px] text-foreground">
                            {String(order.payment_id).length > 14
                              ? `${String(order.payment_id).slice(0, 14)}...`
                              : String(order.payment_id)}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="rounded-xl gap-1.5 text-xs h-9 px-4 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </Button>
                    <Link href="/user/products">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl gap-1 text-xs h-9 px-3 text-muted-foreground hover:text-foreground"
                      >
                        Buy Again
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

      {/* Detailed Order Receipt Modal */}
      <Dialog
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl p-6">
          {selectedOrder && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-start justify-between gap-4 pr-6">
                  <div>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                      Order Receipt
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-1">
                      Reference #{String(selectedOrder.id ?? "")} • Placed on {formatDate(selectedOrder.created_at)}
                    </DialogDescription>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </DialogHeader>

              {/* Status Timeline */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex flex-col items-center gap-1.5 text-primary">
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                    <span>Placed</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-primary mx-2 mt-[-16px]" />
                  <div className="flex flex-col items-center gap-1.5 text-primary">
                    <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </div>
                    <span>Processing</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-border mx-2 mt-[-16px]" />
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                    <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <span>Shipped</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-border mx-2 mt-[-16px]" />
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                    <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Items in this Order</h4>
                <div className="divide-y divide-border/40 border rounded-2xl overflow-hidden bg-card">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3.5 text-sm">
                      <div className="w-12 h-12 rounded-lg bg-muted shrink-0 overflow-hidden border border-border/50">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-5 h-5 m-auto text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate text-sm">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${item.price?.toFixed(2)} × {item.quantity || 1}
                        </p>
                      </div>
                      <span className="font-semibold text-sm">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery & Payment Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Delivery Info */}
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-xs space-y-1.5">
                  <span className="font-semibold text-foreground flex items-center gap-1.5 text-sm mb-2">
                    <MapPin className="w-4 h-4 text-primary" /> Delivery Address
                  </span>
                  {selectedOrder.address_id && addresses[selectedOrder.address_id] ? (
                    <>
                      <p className="font-semibold text-foreground">
                        {addresses[selectedOrder.address_id].name}
                      </p>
                      <p className="text-muted-foreground">
                        {addresses[selectedOrder.address_id].address_line_1}
                      </p>
                      {addresses[selectedOrder.address_id].address_line_2 && (
                        <p className="text-muted-foreground">
                          {addresses[selectedOrder.address_id].address_line_2}
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        {addresses[selectedOrder.address_id].city},{" "}
                        {addresses[selectedOrder.address_id].state}{" "}
                        {addresses[selectedOrder.address_id].zip_code}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground italic">Standard Shipping Address</p>
                  )}
                </div>

                {/* Payment Info */}
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 text-xs space-y-1.5">
                  <span className="font-semibold text-foreground flex items-center gap-1.5 text-sm mb-2">
                    <CreditCard className="w-4 h-4 text-primary" /> Payment Summary
                  </span>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="font-medium text-foreground">Credit / Debit (Stripe)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Paid
                    </span>
                  </div>
                  {selectedOrder.payment_id && (
                    <div className="flex justify-between items-center pt-1 border-t border-border/40 mt-1">
                      <span className="text-muted-foreground">Payment Ref:</span>
                      <span className="font-mono text-[11px] text-foreground truncate max-w-[140px]">
                        {selectedOrder.payment_id}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">
                    ${selectedOrder.subtotal?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-foreground">
                    {selectedOrder.shipping_fee === 0 || !selectedOrder.shipping_fee
                      ? "Free"
                      : `$${selectedOrder.shipping_fee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-foreground">
                    ${selectedOrder.tax?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between font-bold text-base text-foreground">
                  <span>Total Paid</span>
                  <span className="text-primary">${selectedOrder.total?.toFixed(2) || "0.00"}</span>
                </div>
              </div>

              {/* Dialog Footer */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl px-5"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    copyToClipboard(selectedOrder.id);
                  }}
                  className="rounded-xl px-5 gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Order ID
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserOrdersPage;
