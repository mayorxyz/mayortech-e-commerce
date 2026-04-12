import { useState, useEffect } from "react";
import { useAllOrderTracking, ORDER_STEPS, type OrderStatus, type TrackedOrder } from "@/hooks/useOrderTracking";
import { Search, ChevronDown, ChevronUp, Package } from "lucide-react";

export default function AdminPurchasedOrders() {
  const { orders, loading, updateStatus } = useAllOrderTracking();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const inputClass =
    "w-full bg-surface2 border border-border rounded-[10px] text-foreground font-body text-sm py-[11px] px-3.5 outline-none focus:border-primary placeholder:text-muted";

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "confirmed": return "bg-blue-500/15 text-blue-400 border-blue-500/20";
      case "processing": return "bg-amber-500/15 text-amber-400 border-amber-500/20";
      case "packaging": return "bg-purple-500/15 text-purple-400 border-purple-500/20";
      case "out_for_delivery": return "bg-orange-500/15 text-orange-400 border-orange-500/20";
      case "delivered": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
      default: return "bg-muted/15 text-muted border-border";
    }
  };

  const getStepIndex = (status: OrderStatus) => ORDER_STEPS.findIndex((s) => s.key === status);

  return (
    <section className="bg-surface border border-border rounded-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-primary" />
        <h2 className="font-heading font-bold text-base">Purchased Orders ({orders.length})</h2>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            className={`${inputClass} pl-9`}
            placeholder="Search by name, phone, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className={`${inputClass} sm:w-48`}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status ({orders.length})</option>
          {ORDER_STEPS.map((step) => (
            <option key={step.key} value={step.key}>
              {step.label} ({statusCounts[step.key] || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      {loading ? (
        <p className="text-muted text-sm">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-muted text-sm">
          {orders.length === 0 ? "No purchased orders yet." : "No orders match your search."}
        </p>
      ) : (
        <div className="grid gap-3">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const currentStep = getStepIndex(order.orderStatus);
            const items = Array.isArray(order.items) ? order.items : [];

            return (
              <div key={order.id} className="bg-surface2 border border-border rounded-lg overflow-hidden">
                {/* Order Header - clickable */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full p-4 flex items-center gap-3 text-left cursor-pointer hover:bg-surface2/80 transition-colors"
                >
                  {/* First item image */}
                  {items[0]?.image && (
                    <img
                      src={items[0].image}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading font-semibold text-sm truncate">{order.customerName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(order.orderStatus)}`}>
                        {ORDER_STEPS[currentStep]?.label || order.orderStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted">{order.customerPhone}</span>
                      <span className="text-xs text-muted">·</span>
                      <span className="text-xs text-muted">{order.orderId?.slice(0, 8)}</span>
                      {items.length > 0 && (
                        <>
                          <span className="text-xs text-muted">·</span>
                          <span className="text-xs text-muted">{items.length} item{items.length > 1 ? "s" : ""}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted flex-shrink-0" />}
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-border p-4 space-y-4">
                    {/* Order Items */}
                    {items.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Items</h4>
                        <div className="space-y-2">
                          {items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-surface rounded-lg p-2.5 border border-border">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-10 h-10 rounded-md object-cover border border-border"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.productName}</p>
                                <p className="text-xs text-muted">Qty: {item.quantity} · {item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Customer Info */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Customer</h4>
                      <div className="bg-surface rounded-lg p-3 border border-border text-sm space-y-1">
                        <p><span className="text-muted">Name:</span> {order.customerName}</p>
                        <p><span className="text-muted">Phone:</span> {order.customerPhone}</p>
                        {order.customerAddress && <p><span className="text-muted">Address:</span> {order.customerAddress}</p>}
                        {order.totalAmount ? <p><span className="text-muted">Total:</span> ₦{order.totalAmount.toLocaleString()}</p> : null}
                        <p><span className="text-muted">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted mb-3 uppercase tracking-wide">Order Progress</h4>
                      <div className="flex items-center gap-1">
                        {ORDER_STEPS.map((step, i) => (
                          <div key={step.key} className="flex-1 flex flex-col items-center gap-1.5">
                            <div
                              className={`w-full h-1.5 rounded-full transition-all ${
                                i <= currentStep ? "bg-primary" : "bg-border"
                              }`}
                            />
                            <span className={`text-[9px] text-center leading-tight ${
                              i <= currentStep ? "text-primary font-semibold" : "text-muted"
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Update Buttons */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Update Status</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {ORDER_STEPS.map((step, i) => (
                          <button
                            key={step.key}
                            onClick={() => updateStatus(order.id, step.key)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer transition-all border ${
                              i <= currentStep
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-surface border-border text-muted hover:border-primary/50"
                            } ${i === currentStep ? "ring-2 ring-primary/30" : ""}`}
                          >
                            {step.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
