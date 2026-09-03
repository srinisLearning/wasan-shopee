"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Package,
  Search,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  RefreshCw,
  SlidersHorizontal,
  Edit,
  Check,
  Calendar,
  User,
  ShoppingBag,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { IOrder, IUser, IAddress } from "@/interfaces";
import { getAllOrders, updateOrderById } from "@/services/orders";
import { getAllUsers } from "@/services/users";
import { getAllAddresses } from "@/services/addresses";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

const selectableStatuses = [
  {
    key: "processing",
    label: "Processing",
    desc: "Order is currently being prepared and packed",
    icon: RefreshCw,
    color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  },
  {
    key: "shipped",
    label: "Shipped",
    desc: "Order has been dispatched for delivery",
    icon: Truck,
    color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
  },
  {
    key: "delivered",
    label: "Delivered",
    desc: "Package was safely delivered to the customer",
    icon: CheckCircle2,
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    desc: "Order has been voided or cancelled",
    icon: XCircle,
    color: "text-rose-600 bg-rose-500/10 border-rose-500/20",
  },
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, IUser>>({});
  const [addressesMap, setAddressesMap] = useState<Record<string, IAddress>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");

  // Status Update Modal State
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      const [ordersRes, usersRes, addressesRes] = await Promise.all([
        getAllOrders(),
        getAllUsers(),
        getAllAddresses(),
      ]);

      if (ordersRes.success && ordersRes.data) {
        setOrders(ordersRes.data);
      } else {
        setOrders([]);
      }

      if (usersRes.success && usersRes.data) {
        const uMap: Record<string, IUser> = {};
        usersRes.data.forEach((u) => {
          if (u.id) uMap[u.id] = u;
        });
        setUsersMap(uMap);
      }

      if (Array.isArray(addressesRes)) {
        const aMap: Record<string, IAddress> = {};
        addressesRes.forEach((a) => {
          if (a.id) aMap[a.id] = a;
        });
        setAddressesMap(aMap);
      }
    } catch (error: any) {
      console.error("Failed to load admin orders:", error);
      toast.error(error.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const getCustomerName = (order: IOrder) => {
    if (order.user_id && usersMap[order.user_id]?.name) {
      return usersMap[order.user_id].name;
    }
    if (order.address_id && addressesMap[order.address_id]?.name) {
      return addressesMap[order.address_id].name;
    }
    return "Customer";
  };

  const getCustomerEmail = (order: IOrder) => {
    if (order.user_id && usersMap[order.user_id]?.email) {
      return usersMap[order.user_id].email;
    }
    return "";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
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
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const openStatusModal = (order: IOrder) => {
    setSelectedOrder(order);
    setNewStatus((order.status || "processing").toLowerCase());
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      setIsUpdating(true);
      const res = await updateOrderById(selectedOrder.id, {
        status: newStatus,
      });

      if (!res.success) {
        throw new Error(res.message || "Failed to update order status.");
      }

      // Update in local state
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
      );

      toast.success(`Order #${selectedOrder.id} status updated to "${newStatus}"!`);
      setSelectedOrder(null);
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast.error(error.message || "Failed to update order status.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderStatus = (order.status || "order placed").toLowerCase();
      const matchesStatus =
        selectedStatusFilter === "all" || orderStatus === selectedStatusFilter.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesStatus;

      const matchesId = String(order.id ?? "").toLowerCase().includes(query);
      const customerName = getCustomerName(order).toLowerCase();
      const customerEmail = getCustomerEmail(order).toLowerCase();
      const matchesCustomer = customerName.includes(query) || customerEmail.includes(query);
      const matchesItem = order.items?.some((item) =>
        item.name?.toLowerCase().includes(query)
      );

      return matchesStatus && (matchesId || matchesCustomer || matchesItem);
    });
  }, [orders, selectedStatusFilter, searchQuery, usersMap, addressesMap]);

  // Statistics counters
  const stats = useMemo(() => {
    return {
      total: orders.length,
      processing: orders.filter((o) => (o.status || "").toLowerCase() === "processing").length,
      shipped: orders.filter((o) => (o.status || "").toLowerCase() === "shipped").length,
      delivered: orders.filter((o) => (o.status || "").toLowerCase() === "delivered").length,
      cancelled: orders.filter((o) => (o.status || "").toLowerCase() === "cancelled").length,
    };
  }, [orders]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <PageTitle title="Customer Orders" />
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all customer orders, monitor real-time shipping fulfillment, and update statuses.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrdersData}
          disabled={loading}
          className="rounded-xl gap-2 shadow-xs cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Orders
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { key: "all", label: "All Orders", count: stats.total },
            { key: "processing", label: "Processing", count: stats.processing },
            { key: "shipped", label: "Shipped", count: stats.shipped },
            { key: "delivered", label: "Delivered", count: stats.delivered },
            { key: "cancelled", label: "Cancelled", count: stats.cancelled },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStatusFilter(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedStatusFilter === tab.key
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedStatusFilter === tab.key
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
            placeholder="Search by order ID, product, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-card border-border/60 text-sm focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {/* Orders Table Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading customer orders...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <Card className="rounded-3xl border-dashed border-border/80 bg-card/60 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-foreground text-lg">No orders placed yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Customers haven&apos;t placed any orders yet. When orders are submitted, they will appear in this table.
          </p>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-border/80 bg-card/60 p-10 text-center">
          <p className="text-muted-foreground font-medium text-sm">
            No orders match your filter criteria &ldquo;{searchQuery || selectedStatusFilter}&rdquo;
          </p>
          <Button
            variant="link"
            onClick={() => {
              setSelectedStatusFilter("all");
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
                <TableHead className="w-[80px] font-bold text-xs uppercase tracking-wider text-muted-foreground pl-4">
                  Product
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground min-w-[180px]">
                  Product Name
                </TableHead>
                <TableHead className="w-[90px] font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Quantity
                </TableHead>
                <TableHead className="w-[110px] font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Price (₹)
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground min-w-[160px]">
                  Customer Name
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground min-w-[140px]">
                  Order Date
                </TableHead>
                <TableHead className="w-[130px] font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Order Status
                </TableHead>
                <TableHead className="w-[120px] font-bold text-xs uppercase tracking-wider text-muted-foreground text-right pr-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOrders.map((order) => {
                const items =
                  order.items && order.items.length > 0
                    ? order.items
                    : [
                        {
                          id: "default",
                          name: "Standard Item",
                          quantity: 1,
                          price: order.total || 0,
                          images: [],
                          category_id: 0,
                          description: "",
                          created_at: "",
                          updated_at: "",
                        },
                      ];

                return (
                  <TableRow
                    key={order.id}
                    className="hover:bg-muted/30 transition-colors border-b border-border/40"
                  >
                    {/* 1. Product Image (Small Size) */}
                    <TableCell className="pl-4 py-3 align-middle">
                      <div className="flex flex-col gap-2">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 rounded-lg bg-muted/60 border border-border/60 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs"
                          >
                            {item.images?.[0] ? (
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    {/* 2. Product Name */}
                    <TableCell className="py-3 align-middle">
                      <div className="flex flex-col gap-2">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="h-12 flex flex-col justify-center"
                          >
                            <span className="font-semibold text-foreground text-sm line-clamp-2">
                              {item.name}
                            </span>
                            <span className="text-[11px] font-mono text-muted-foreground">
                              Ref #{String(order.id).slice(0, 8)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    {/* 3. Quantity */}
                    <TableCell className="py-3 align-middle">
                      <div className="flex flex-col gap-2">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="h-12 flex items-center"
                          >
                            <span className="text-sm font-semibold text-foreground px-2.5 py-1 rounded-md bg-muted/50 border border-border/40">
                              {item.quantity || 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    {/* 4. Price */}
                    <TableCell className="py-3 align-middle">
                      <div className="flex flex-col gap-2">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="h-12 flex items-center"
                          >
                            <span className="text-sm font-mono font-semibold text-foreground">
                              ₹{Number(item.price || 0).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {items.length > 1 && (
                          <div className="pt-1 text-xs text-muted-foreground border-t border-border/30">
                            Total:{" "}
                            <span className="font-bold text-foreground font-mono">
                              ₹{Number(order.total || 0).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* 5. Customer Name */}
                    <TableCell className="py-3 align-middle">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="font-bold text-sm text-foreground">
                            {getCustomerName(order)}
                          </span>
                        </div>
                        {getCustomerEmail(order) && (
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {getCustomerEmail(order)}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* 6. Order Date */}
                    <TableCell className="py-3 align-middle">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                    </TableCell>

                    {/* 7. Order Status */}
                    <TableCell className="py-3 align-middle">
                      {getStatusBadge(order.status)}
                    </TableCell>

                    {/* 8. Action Button */}
                    <TableCell className="py-3 align-middle text-right pr-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openStatusModal(order)}
                        className="rounded-xl text-xs gap-1.5 h-8 px-3 font-semibold hover:border-primary/40 hover:text-primary cursor-pointer shadow-2xs"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Update Status
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Modal for Updating Order Status */}
      <Dialog
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              Update Order Status
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              {selectedOrder && (
                <>
                  Order Reference #{String(selectedOrder.id)} • Customer:{" "}
                  <span className="font-semibold text-foreground">
                    {getCustomerName(selectedOrder)}
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 py-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
                <span className="text-muted-foreground">Current Status:</span>
                <div>{getStatusBadge(selectedOrder.status)}</div>
              </div>

              {/* Status Selection Cards */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Select New Status:
                </label>

                <div className="grid grid-cols-1 gap-2.5">
                  {selectableStatuses.map((status) => {
                    const Icon = status.icon;
                    const isSelected = newStatus === status.key;

                    return (
                      <div
                        key={status.key}
                        onClick={() => setNewStatus(status.key)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary/10 border-primary shadow-2xs"
                            : "bg-card hover:bg-muted/50 border-border/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${status.color}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              {status.label}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {status.desc}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-end gap-2 pt-2 border-t border-border/40">
            <Button
              variant="outline"
              onClick={() => setSelectedOrder(null)}
              disabled={isUpdating}
              className="rounded-xl px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={isUpdating || newStatus === selectedOrder?.status?.toLowerCase()}
              className="rounded-xl px-5 gap-2 font-semibold cursor-pointer shadow-xs"
            >
              {isUpdating ? (
                <>
                  <Spinner size="sm" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Status</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrdersPage;
