import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getOrders,
  markDelivered,
  downloadInvoice,
  deleteOrder,
  getOrderDetails,
} from "../../api/order.api";
import { 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Package,
  BookOpen,
  Eye,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Mail,
  CreditCard,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getOrders();
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data?.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleMarkDelivered = async (id) => {
    if (!window.confirm("Mark this order as delivered?")) return;
    try {
      await markDelivered(id);
      fetchOrders();
      if (selectedOrder?._id === id) {
        setSelectedOrder({ ...selectedOrder, delivered: true });
      }
    } catch (error) {
      console.error("Error marking order delivered:", error);
      alert("Failed to mark order as delivered. Please try again.");
    }
  };

  const handleDownloadInvoice = async (id) => {
    try {
      const response = await downloadInvoice(id);
      
      if (!response?.data) {
        throw new Error("No invoice data received");
      }

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to download invoice. Please try again.");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
    try {
      await deleteOrder(id);
      fetchOrders();
      if (selectedOrder?._id === id) {
        setViewModalOpen(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order. Please try again.");
    }
  };

  const handleViewOrder = async (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
    
    if (order._id && !order.details) {
      try {
        setDetailsLoading(true);
        const { data } = await getOrderDetails(order._id);
        setOrderDetails(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setDetailsLoading(false);
      }
    } else {
      setOrderDetails(order.details);
    }
  };

  // Calculate total revenue
  const totalRevenue = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  // Filter orders
  const filteredOrders = orders
    .filter((order) => {
      if (filter === "all") return true;
      if (filter === "paid") return order.status === "paid";
      if (filter === "ebook") return order.product?.type === "ebook";
      if (filter === "merch") return order.product?.type === "merch";
      return true;
    })
    .filter((order) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        order.name?.toLowerCase().includes(term) ||
        order.email?.toLowerCase().includes(term) ||
        order.product?.title?.toLowerCase().includes(term) ||
        order._id?.toLowerCase().includes(term) ||
        order.reference?.toLowerCase().includes(term)
      );
    });

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-light text-[#00337C] mb-2">
            Orders
          </h1>
          <p className="text-gray-600">
            Manage customer orders and fulfillments
          </p>
        </div>

        <div className="mt-4 sm:mt-0 p-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] rounded-lg text-white w-full sm:w-auto">
          <p className="text-sm opacity-90">Total Revenue</p>
          <p className="text-2xl font-light">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all bg-white"
        >
          <option value="all">All Orders</option>
          <option value="paid">Paid Only</option>
          <option value="ebook">Ebooks</option>
          <option value="merch">Merchandise</option>
        </select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer, email, product, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-600 font-medium mb-2">{error}</p>
              <button
                onClick={fetchOrders}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-12 h-12 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {!error && filteredOrders.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-light text-gray-700 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your filters or search term"
                  : "No orders have been placed yet"}
              </p>
            </div>
          )}

          {/* Orders Display - Responsive */}
          {!error && filteredOrders.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivered
                      </th>
                      <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.name || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.email || "N/A"}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {order.product?.type === "ebook" ? (
                              <BookOpen className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                            ) : (
                              <Package className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
                            )}
                            <span className="text-gray-900 line-clamp-1">
                              {order.product?.title || "N/A"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.product?.type === "ebook"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}>
                            {order.product?.type || "Unknown"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-medium text-[#B76E79]">
                            ${order.amount?.toFixed(2) || "0.00"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {order.status || "pending"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {order.product?.type === "merch" ? (
                            order.delivered ? (
                              <span className="inline-flex items-center text-green-600 text-sm">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                No
                              </span>
                            )
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="p-2 text-gray-600 hover:text-[#00337C] hover:bg-gray-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDownloadInvoice(order._id)}
                              className="p-2 text-gray-600 hover:text-[#00337C] hover:bg-gray-100 rounded-lg transition-colors"
                              title="Download Invoice"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            {order.product?.type === "merch" && !order.delivered && (
                              <button
                                onClick={() => handleMarkDelivered(order._id)}
                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                title="Mark as Delivered"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-gray-900">{order.name || "N/A"}</p>
                        <p className="text-sm text-gray-500">{order.email || "N/A"}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status || "pending"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500">Product:</span>
                        <p className="font-medium line-clamp-1">{order.product?.title || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Amount:</span>
                        <p className="font-medium text-[#B76E79]">${order.amount?.toFixed(2) || "0.00"}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      
                      <button
                        onClick={() => handleDownloadInvoice(order._id)}
                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Invoice
                      </button>

                      {order.product?.type === "merch" && !order.delivered && (
                        <button
                          onClick={() => handleMarkDelivered(order._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Deliver
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>

                    <button
                      onClick={() => toggleOrderExpand(order._id)}
                      className="w-full mt-3 flex items-center justify-center text-sm text-gray-500 hover:text-[#00337C]"
                    >
                      {expandedOrder === order._id ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Show details
                        </>
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedOrder === order._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-gray-100"
                        >
                          <div className="space-y-2 text-sm">
                            <p><span className="text-gray-500">Order ID:</span> {order._id}</p>
                            <p><span className="text-gray-500">Type:</span> {order.product?.type || "Unknown"}</p>
                            <p><span className="text-gray-500">Delivered:</span> {order.delivered ? "Yes" : "No"}</p>
                            {order.shippingAddress && (
                              <p><span className="text-gray-500">Shipping:</span> {order.shippingAddress}</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Showing {filteredOrders.length} of {orders.length} orders
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* View Order Modal */}
      <AnimatePresence>
        {viewModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-black/50" onClick={() => setViewModalOpen(false)}></div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full"
              >
                <div className="px-6 py-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] flex justify-between items-center">
                  <h3 className="text-xl font-light text-white flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Order Details
                  </h3>
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {detailsLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading order details...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Customer Info */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                          Customer Information
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-3" />
                            <span className="text-gray-900">{selectedOrder.name || "N/A"}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-400 mr-3" />
                            <span className="text-gray-900">{selectedOrder.email || "N/A"}</span>
                          </div>
                          {selectedOrder.shippingAddress && (
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                              <span className="text-gray-900">{selectedOrder.shippingAddress}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Info */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                          Order Information
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order ID:</span>
                            <span className="text-gray-900 font-mono text-sm">{selectedOrder._id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Reference:</span>
                            <span className="text-gray-900 font-mono text-sm">{selectedOrder.reference || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="text-gray-900">
                              {new Date(selectedOrder.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedOrder.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {selectedOrder.status || "pending"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                          Product Information
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start space-x-4">
                            {selectedOrder.product?.coverImage?.url ? (
                              <img
                                src={selectedOrder.product.coverImage.url}
                                alt={selectedOrder.product.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                {selectedOrder.product?.type === "ebook" ? (
                                  <BookOpen className="w-8 h-8 text-gray-400" />
                                ) : (
                                  <Package className="w-8 h-8 text-gray-400" />
                                )}
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{selectedOrder.product?.title || "N/A"}</p>
                              <div className="flex items-center mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  selectedOrder.product?.type === "ebook"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-purple-100 text-purple-700"
                                }`}>
                                  {selectedOrder.product?.type || "Unknown"}
                                </span>
                                <span className="ml-2 text-[#B76E79] font-medium">
                                  ${selectedOrder.amount?.toFixed(2) || "0.00"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Status (for merch) */}
                      {selectedOrder.product?.type === "merch" && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                            Shipping Status
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Delivery Status:</span>
                              {selectedOrder.delivered ? (
                                <span className="inline-flex items-center text-green-600">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Delivered
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-red-600">
                                  <AlertCircle className="w-4 h-4 mr-1" />
                                  Not Delivered
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                  <button
                    onClick={() => handleDownloadInvoice(selectedOrder._id)}
                    className="px-4 py-2 bg-[#00337C] text-white rounded-lg hover:bg-[#1E4B9E] transition-colors flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </button>
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminOrders;