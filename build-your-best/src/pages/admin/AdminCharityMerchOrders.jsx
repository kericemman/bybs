import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../utils/axios";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Search,
  Eye,
  Trash2,
  Filter,
  Download,
  X,
  User,
  MessageCircle
} from "lucide-react";

const AdminCharityMerchOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    fulfilled: 0
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/charity-merch/admin");
      setOrders(data);
      
      // Calculate stats
      const newCount = data.filter(o => o.status === "new").length;
      const contactedCount = data.filter(o => o.status === "contacted").length;
      const fulfilledCount = data.filter(o => o.status === "fulfilled").length;
      
      setStats({
        total: data.length,
        new: newCount,
        contacted: contactedCount,
        fulfilled: fulfilledCount
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/charity-merch/admin/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this request? This action cannot be undone.")) return;
    try {
      await api.delete(`/charity-merch/admin/${id}`);
      fetchOrders();
      if (selectedOrder?._id === id) {
        setViewModalOpen(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order");
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'new':
        return { label: 'New', color: 'bg-blue-100 text-blue-700', icon: <Clock className="w-3 h-3 mr-1" /> };
      case 'contacted':
        return { label: 'Contacted', color: 'bg-yellow-100 text-yellow-700', icon: <MessageCircle className="w-3 h-3 mr-1" /> };
      case 'fulfilled':
        return { label: 'Fulfilled', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3 mr-1" /> };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700', icon: null };
    }
  };

  const getPackageBadge = (packageType) => {
    switch(packageType) {
      case 'single':
      case 'basic':
        return { label: 'Single Pack', color: 'bg-purple-100 text-purple-700' };
      case 'normal':
        return { label: 'Normal Pack', color: 'bg-indigo-100 text-indigo-700' };
      case 'premium':
        return { label: 'Premium Pack', color: 'bg-orange-100 text-orange-700' };
      case 'bundle':
        return { label: 'Bundle Pack', color: 'bg-pink-100 text-pink-700' };
      default:
        return { label: packageType, color: 'bg-gray-100 text-gray-700' };
    }
  };

  const filteredOrders = orders
    .filter(order => {
      if (statusFilter === "all") return true;
      return order.status === statusFilter;
    })
    .filter(order => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        order.name?.toLowerCase().includes(term) ||
        order.email?.toLowerCase().includes(term) ||
        order.country?.toLowerCase().includes(term) ||
        order.phone?.toLowerCase().includes(term) ||
        order.packageType?.toLowerCase().includes(term)
      );
    });

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Country", "Phone", "Package", "Status", "Message", "Date"];
    const csvData = orders.map(order => [
      order.name,
      order.email,
      order.country,
      order.phone || "",
      order.packageType,
      order.status,
      order.message || "",
      new Date(order.createdAt).toLocaleDateString()
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `charity-merch-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mt-10 font-light text-[#00337C] mb-2 flex items-center">
         
          Charity Merch Requests
        </h1>
        <p className="text-gray-600">
          Manage support requests from the charity merch campaign.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Requests', value: stats.total, icon: <Package className="w-5 h-5" />, color: 'from-[#00337C] to-[#1E4B9E]' },
          { label: 'New', value: stats.new, icon: <Clock className="w-5 h-5" />, color: 'from-blue-500 to-blue-600' },
          { label: 'Contacted', value: stats.contacted, icon: <MessageCircle className="w-5 h-5" />, color: 'from-yellow-500 to-yellow-600' },
          { label: 'Fulfilled', value: stats.fulfilled, icon: <CheckCircle className="w-5 h-5" />, color: 'from-green-500 to-green-600' }
        ].map((stat, index) => (
          <Motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-light text-[#00337C]">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
            </div>
          </Motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40 px-4 py-2 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all bg-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="fulfilled">Fulfilled</option>
          </select>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading requests...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-light text-gray-700 mb-2">No requests found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your filters or search term"
                : "No charity merch requests have been submitted yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order, index) => {
                  const statusBadge = getStatusBadge(order.status);
                  const packageBadge = getPackageBadge(order.packageType);
                  
                  return (
                    <Motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.name}</p>
                          <p className="text-xs text-gray-500">{order.country}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {order.email}
                          </p>
                          {order.phone && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <Phone className="w-3 h-3 mr-1 text-gray-400" />
                              {order.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${packageBadge.color}`}>
                          {packageBadge.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-offset-1 cursor-pointer ${statusBadge.color}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="fulfilled">Fulfilled</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="p-2 text-gray-500 hover:text-[#00337C] rounded-lg hover:bg-gray-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteOrder(order._id)}
                            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </Motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} requests
            </p>
          </div>
        )}
      </div>

      {/* View Order Modal */}
      <AnimatePresence>
        {viewModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black/50" onClick={() => setViewModalOpen(false)}></div>
              
              <Motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
              >
                <div className="px-6 py-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] flex justify-between items-center">
                  <h3 className="text-xl font-light text-white flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Request Details
                  </h3>
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                        Customer Information
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-900">{selectedOrder.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-900">{selectedOrder.email}</span>
                        </div>
                        {selectedOrder.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-400 mr-3" />
                            <span className="text-gray-900">{selectedOrder.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-900">{selectedOrder.country}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                        Order Information
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Package:</span>
                          <span className="font-medium text-[#00337C] capitalize">{selectedOrder.packageType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedOrder.status).color}`}>
                            {getStatusBadge(selectedOrder.status).label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {selectedOrder.message && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                        Message / Notes
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{selectedOrder.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        window.location.href = `mailto:${selectedOrder.email}`;
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Customer
                    </button>
                    <button
                      onClick={() => deleteOrder(selectedOrder._id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 inline mr-2" />
                      Delete Request
                    </button>
                  </div>
                </div>
              </Motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminCharityMerchOrders;
