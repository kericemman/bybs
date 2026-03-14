import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../utils/axios";
import {
  Users,
  Search,
  Filter,
  Calendar,
  Mail,
  User,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Hash,
  ChevronRight,
  MoreVertical,
  ArrowUpDown,
  MailOpen,
  Trash2
} from "lucide-react";

const AdminWaitlist = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cohortFilter, setCohortFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
 

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/waitlist");
      setEntries(data);
      setFilteredEntries(data);
    } catch (error) {
      console.error("Error fetching waitlist entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    let results = [...entries];

    // Apply search filter
    if (searchTerm) {
      results = results.filter(entry =>
        entry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply cohort filter
    if (cohortFilter !== "all") {
      results = results.filter(entry => entry.cohort?._id === cohortFilter);
    }

    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        default:
          return 0;
      }
    });

    setFilteredEntries(results);
  }, [searchTerm, cohortFilter, sortBy, entries]);

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Cohort", "Date Joined", "Notes"];
    const csvContent = [
      headers.join(","),
      ...filteredEntries.map(entry => [
        `"${entry.name || ""}"`,
        `"${entry.email || ""}"`,
        `"${entry.phone || ""}"`,
        `"${entry.cohort?.title || "General"}"`,
        `"${new Date(entry.createdAt).toLocaleDateString()}"`,
        `"${entry.notes || ""}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-entries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const sendWelcomeEmail = async (email) => {
    if (!confirm("Send welcome email to this contact?")) return;
    
    try {
      // You would implement your email sending logic here
      console.log("Sending welcome email to:", email);
      alert("Welcome email sent!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };

  const deleteEntry = async (id) => {
    if (!confirm("Are you sure you want to delete this waitlist entry?")) return;
    
    try {
      await api.delete(`/admin/waitlist/${id}`);
      fetchEntries();
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getUniqueCohorts = () => {
    const cohorts = entries
      .map(entry => entry.cohort)
      .filter(cohort => cohort)
      .filter((cohort, index, self) =>
        index === self.findIndex(c => c._id === cohort._id)
      );
    return cohorts;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light text-[#00337C]">Waitlist Management</h1>
            <p className="text-gray-600 mt-1">Manage interested participants and their information</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Waitlist</p>
                <p className="text-3xl font-light text-gray-900 mt-2">{entries.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New Today</p>
                <p className="text-3xl font-light text-gray-900 mt-2">
                  {entries.filter(e => {
                    const entryDate = new Date(e.createdAt);
                    const today = new Date();
                    return entryDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-3xl font-light text-gray-900 mt-2">
                  {entries.filter(e => {
                    const entryDate = new Date(e.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return entryDate > weekAgo;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">By Cohort</p>
                <p className="text-3xl font-light text-gray-900 mt-2">
                  {getUniqueCohorts().length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Hash className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={cohortFilter}
                  onChange={(e) => setCohortFilter(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none appearance-none min-w-[150px]"
                >
                  <option value="all">All Cohorts</option>
                  {getUniqueCohorts().map(cohort => (
                    <option key={cohort._id} value={cohort._id}>
                      {cohort.title}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none appearance-none min-w-[150px]"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                </select>
                <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Waitlist Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEntries(filteredEntries.map(e => e._id));
                          } else {
                            setSelectedEntries([]);
                          }
                        }}
                        className="mr-3 rounded border-gray-300 text-[#00337C] focus:ring-[#00337C]"
                      />
                      Contact
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Cohort</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Date Joined</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <div className="text-gray-500">
                        {searchTerm || cohortFilter !== "all" 
                          ? "No waitlist entries found matching your filters." 
                          : "No waitlist entries yet. New entries will appear here."}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
                    <tr 
                      key={entry._id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedEntries.includes(entry._id) ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedEntries.includes(entry._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEntries([...selectedEntries, entry._id]);
                              } else {
                                setSelectedEntries(selectedEntries.filter(id => id !== entry._id));
                              }
                            }}
                            className="mr-3 rounded border-gray-300 text-[#00337C] focus:ring-[#00337C]"
                          />
                          <div>
                            <div className="font-medium text-gray-900 flex items-center">
                              <User className="w-4 h-4 text-gray-400 mr-2" />
                              {entry.name || "Anonymous"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Mail className="w-3 h-3 mr-2" />
                              {entry.email}
                            </div>
                            {entry.phone && (
                              <div className="text-sm text-gray-500 mt-1">
                                📱 {entry.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-700">
                          {entry.cohort?.title || "General Interest"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-700">{formatDate(entry.createdAt)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          <Clock className="w-3 h-3 mr-1" />
                          Waiting
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => sendWelcomeEmail(entry.email)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Send Welcome Email"
                          >
                            <MailOpen className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => setSelectedEntry(selectedEntry === entry._id ? null : entry._id)}
                            className="p-2 text-gray-600 hover:text-[#00337C] hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => deleteEntry(entry._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bulk Actions */}
          {selectedEntries.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-blue-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#00337C]">
                  {selectedEntries.length} selected
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      selectedEntries.forEach(id => {
                        const entry = entries.find(e => e._id === id);
                        if (entry) sendWelcomeEmail(entry.email);
                      });
                    }}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <MailOpen className="w-4 h-4 mr-2" />
                    Send Email to Selected
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${selectedEntries.length} selected entries?`)) {
                        selectedEntries.forEach(id => deleteEntry(id));
                        setSelectedEntries([]);
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredEntries.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredEntries.length} of {entries.length} entries
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    Previous
                  </button>
                  <span className="px-3 py-1 bg-[#00337C] text-white rounded-lg">1</span>
                  <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-[#F5F9FF] to-[#FFF0F0] p-6 rounded-xl border border-[#00337C]/20">
          <h3 className="text-lg font-medium text-[#00337C] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={exportToCSV}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-[#00337C]/30 hover:shadow transition-all"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Export All Data</div>
                  <div className="text-sm text-gray-500">Download as CSV</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                // Implement bulk email functionality
                alert("Open email composer for all waitlist entries");
              }}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-[#00337C]/30 hover:shadow transition-all"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mr-3">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Email All</div>
                  <div className="text-sm text-gray-500">Send announcement</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => {
                // Implement cohort invitation functionality
                alert("Invite waitlist to specific cohort");
              }}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-[#00337C]/30 hover:shadow transition-all"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Invite to Cohort</div>
                  <div className="text-sm text-gray-500">Convert to participants</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {selectedEntry && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setSelectedEntry(null)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminWaitlist;