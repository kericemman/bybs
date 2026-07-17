import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  fetchPayments,
  fetchPaymentStats,
  syncPayments,
} from "../../api/admin.api";
import { motion as Motion } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  RefreshCw,
  Filter,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  ChevronDown,
  Calendar,
  CreditCard as CardIcon,
  Smartphone,
  Banknote,
  Loader2,
  Eye,
  FileText,
  BarChart3,
} from "lucide-react";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [expandedPayment, setExpandedPayment] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: paymentsData }, { data: statsData }] =
        await Promise.all([
          fetchPayments(),
          fetchPaymentStats(),
        ]);
      setPayments(paymentsData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncPayments();
      await loadData();
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      setSyncing(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      success: {
        icon: <CheckCircle className="w-4 h-4" />,
        color: "bg-green-50 text-green-700 border border-green-200",
        label: "Success"
      },
      pending: {
        icon: <Clock className="w-4 h-4" />,
        color: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        label: "Pending"
      },
      failed: {
        icon: <XCircle className="w-4 h-4" />,
        color: "bg-red-50 text-red-700 border border-red-200",
        label: "Failed"
      },
      abandoned: {
        icon: <AlertCircle className="w-4 h-4" />,
        color: "bg-gray-50 text-gray-700 border border-gray-200",
        label: "Abandoned"
      }
    };

    const statusConfig = config[status] || config.pending;
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
        {statusConfig.icon}
        <span className="ml-1.5">{statusConfig.label}</span>
      </span>
    );
  };

  const getChannelIcon = (channel) => {
    const icons = {
      card: <CardIcon className="w-4 h-4" />,
      mobile_money: <Smartphone className="w-4 h-4" />,
      bank_transfer: <Banknote className="w-4 h-4" />,
    };
    return icons[channel] || <CreditCard className="w-4 h-4" />;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesDate = dateFilter === "all" || true; // Add date filtering logic as needed
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount / 100); // Assuming amount is in cents
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-4 sm:p-6 lg:p-8"
        >
          {/* HEADER */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-light text-gray-900">Payments</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Monitor and manage all payment transactions
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {syncing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2" />
                      <span>Sync Paystack</span>
                    </>
                  )}
                </button>

                <button className="hidden sm:flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200">
                  <Download className="w-5 h-5 mr-2" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* STATS CARDS */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Payments</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.totalPayments}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-[#00337C]" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>+12% from last month</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">
                        {formatCurrency(stats.totalRevenue)}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      <span className="text-green-600 font-medium">+8%</span> growth
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">
                        {stats.successRate}%
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      <span className="text-green-600 font-medium">{stats.successfulPayments}</span> successful
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Customers</p>
                      <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.uniqueCustomers}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      <span className="text-green-600 font-medium">+{stats.newCustomers}</span> new this month
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FILTERS */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by email, reference, or amount..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00337C]/20 focus:border-[#00337C] outline-none transition-all"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#00337C]/20 focus:border-[#00337C] outline-none appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#00337C]/20 focus:border-[#00337C] outline-none appearance-none"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  <span className="hidden lg:inline ml-2 text-gray-700">Analytics</span>
                </button>
              </div>
            </div>
          </div>

          {/* PAYMENTS TABLE */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#00337C] mx-auto" />
                <p className="mt-4 text-gray-500">Loading payments...</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-12 text-center">
                <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm ? "Try adjusting your search terms" : "No payment records available yet"}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Customer</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Amount</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Status</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Channel</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Date</th>
                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredPayments.map((payment) => (
                        <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{payment.email}</p>
                              <p className="text-sm text-gray-500 mt-1 font-mono">{payment.reference}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {payment.currency} • Fee: {formatCurrency(payment.fees || 0)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                {getChannelIcon(payment.channel)}
                              </div>
                              <span className="text-sm text-gray-600 capitalize">
                                {payment.channel?.replace('_', ' ')}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">
                              {formatDate(payment.paidAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setExpandedPayment(expandedPayment === payment._id ? null : payment._id)}
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-700"
                                title="More options"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden">
                  <div className="p-4 space-y-4">
                    {filteredPayments.map((payment) => (
                      <div key={payment._id} className="bg-gray-50/50 border border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-medium text-gray-900">{payment.email}</p>
                            <p className="text-sm text-gray-500 mt-1 font-mono">{payment.reference}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(payment.status)}
                            <button
                              onClick={() => setExpandedPayment(expandedPayment === payment._id ? null : payment._id)}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${expandedPayment === payment._id ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Amount</p>
                            <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="text-gray-900">{new Date(payment.paidAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                              {getChannelIcon(payment.channel)}
                            </div>
                            <span className="text-sm text-gray-600 capitalize">
                              {payment.channel?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {expandedPayment === payment._id && (
                          <Motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-gray-200 pt-4 mt-4 space-y-3"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">Transaction ID</p>
                                <p className="text-sm font-mono text-gray-700 truncate">{payment.transactionId}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Fees</p>
                                <p className="text-sm text-gray-700">{formatCurrency(payment.fees || 0)}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </button>
                              <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                                <FileText className="w-4 h-4 mr-2" />
                                Receipt
                              </button>
                            </div>
                          </Motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* PAGINATION */}
                {filteredPayments.length > 10 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {Math.min(10, filteredPayments.length)} of {filteredPayments.length} payments
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        Previous
                      </button>
                      <button className="px-4 py-2 bg-[#00337C] text-white rounded-lg hover:opacity-90 text-sm">
                        1
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        2
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* SUMMARY */}
          {!loading && filteredPayments.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium">{filteredPayments.length}</span> payments found
                {searchTerm && (
                  <span className="ml-2">matching "{searchTerm}"</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center text-[#00337C] hover:text-[#1E4B9E] transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  <span>Export CSV</span>
                </button>
                <button className="flex items-center text-gray-600 hover:text-gray-700 transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          )}
        </Motion.div>
      </div>
    </AdminLayout>
  );
};

export default Payments;
