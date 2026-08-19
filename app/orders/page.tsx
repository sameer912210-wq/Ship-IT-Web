"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Calendar, MapPin, Package, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (res.status === 401) {
        setError("Unauthorized");
        setOrders([]);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }
      setOrders(data.orders || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchOrders();
      } else {
        setLoading(false);
        setError("Unauthorized");
      }
    }
  }, [user, authLoading]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(orders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOrder = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} order(s)?`)) return;

    try {
      setIsDeleting(true);
      setDeleteSuccess(null);
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderIds: selectedIds }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete orders");
      }
      setDeleteSuccess(data.message || "Orders deleted successfully.");
      setSelectedIds([]);
      // Reload orders
      await fetchOrders();
      // Clear success message after 4 seconds
      setTimeout(() => setDeleteSuccess(null), 4000);
    } catch (err: any) {
      alert(err.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || (loading && orders.length === 0)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 mt-4 font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (error === "Unauthorized" || !user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">View Your Orders</h1>
          <p className="text-gray-600 mb-6">Please sign in to view and manage your order history.</p>
          <Button asChild className="w-full bg-black text-white hover:bg-orange-600 transition-colors">
            <Link href="/login?redirect=/orders">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Your Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track your order history</p>
        </div>
        <Button asChild variant="ghost" className="text-orange-600 hover:text-orange-700 font-semibold self-start md:self-center">
          <Link href="/" className="flex items-center gap-1.5">
            Continue shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {deleteSuccess && (
        <div className="mb-6 p-4 text-sm text-green-800 bg-green-50 border border-green-200 rounded-2xl animate-fade-in flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
          {deleteSuccess}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">You haven&apos;t placed any orders yet. Start shopping to fill your order list!</p>
          <Button asChild className="bg-black text-white hover:bg-orange-600">
            <Link href="/">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedIds.length === orders.length && orders.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 accent-orange-600 cursor-pointer"
                aria-label="Select all orders"
              />
              <label htmlFor="select-all" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
                Select All ({orders.length} orders)
              </label>
            </div>
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-1.5 font-semibold animate-in zoom-in duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected ({selectedIds.length})
              </Button>
            )}
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders.map((order) => {
              const isSelected = selectedIds.includes(order.id);
              const orderDate = new Date(order.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <div
                  key={order.id}
                  className={`bg-white border transition-all duration-200 rounded-2xl overflow-hidden shadow-sm flex ${
                    isSelected ? "border-orange-500 ring-1 ring-orange-500/20 bg-orange-50/[0.02]" : "border-gray-200"
                  }`}
                >
                  {/* Checkbox section */}
                  <div className="flex items-center justify-center px-4 bg-gray-50/50 border-r border-gray-100">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 accent-orange-600 cursor-pointer"
                      aria-label={`Select order ${order.id}`}
                    />
                  </div>

                  {/* Details section */}
                  <div className="flex-grow p-6">
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-4 gap-2">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Order ID: #{order.id.slice(0, 8)}</span>
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span>{orderDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-500">
                          Total: <span className="text-lg font-bold text-black">${order.total.toFixed(2)}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Products */}
                      <div className="md:col-span-2 space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-orange-500" /> Items List
                        </h4>
                        <div className="space-y-2">
                          {order.items && Array.isArray(order.items) ? (
                            order.items.map((item, idx) => (
                              <div key={item.id || idx} className="flex justify-between items-center text-sm border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                                <div>
                                  <span className="font-semibold text-gray-900">{item.name}</span>
                                  <span className="text-xs text-gray-500 ml-2">Qty: {item.quantity}</span>
                                </div>
                                <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No items listed</p>
                          )}
                        </div>
                      </div>

                      {/* Delivery address */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-orange-500" /> Delivery Address
                        </h4>
                        <div className="text-sm bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-1 text-gray-700">
                          <p className="font-semibold text-gray-900">{order.name}</p>
                          <p>{order.address}</p>
                          <p>{order.city}, {order.postalCode}</p>
                          <p className="text-xs text-gray-500 font-medium pt-1">{order.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
