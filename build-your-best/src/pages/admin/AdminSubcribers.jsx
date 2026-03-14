import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../utils/axios";
import { 
  Users, 
  Mail, 
  Send, 
  Calendar, 
  Download, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  X,
  Eye,
  EyeOff,
  Loader,
  Copy,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [expandedEmail, setExpandedEmail] = useState(null);
  const [campaignSuccess, setCampaignSuccess] = useState(false);

  // Email templates
  const emailTemplates = {
    welcome: {
      subject: "Welcome to the BYBS Community!",
      message: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #00337C;">Welcome to Build Your Best Self! 🎉</h2>
          <p>We're so excited to have you in our community.</p>
          <p>Get ready for exclusive content, early access to cohorts, and special offers.</p>
          <p>Stay tuned for updates!</p>
          <p>— The BYBS Team</p>
        </div>
      `
    },
    newsletter: {
      subject: "BYBS Monthly Newsletter",
      message: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #00337C;">Your Monthly Growth Digest</h2>
          <p>Here's what's happening this month at Build Your Best Self:</p>
          <ul>
            <li>New cohort announcements</li>
            <li>Upcoming events and workshops</li>
            <li>Featured articles and resources</li>
          </ul>
          <p>— The BYBS Team</p>
        </div>
      `
    },
    announcement: {
      subject: "Exciting News from BYBS!",
      message: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #00337C;">Big Announcement! 🚀</h2>
          <p>We're thrilled to share some exciting news with you...</p>
          <p>— The BYBS Team</p>
        </div>
      `
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/subscribers/admin");
      setSubscribers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading subscribers:", error);
      setError(error.response?.data?.message || "Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!subject.trim() || !message.trim()) {
      alert("Please enter both subject and message");
      return;
    }

    // Confirm before sending
    if (!window.confirm(`Send email to ${selectedSubscribers.length || subscribers.length} subscribers?`)) {
      return;
    }

    setSending(true);
    setCampaignSuccess(false);

    try {
      await api.post("/subscribers/admin/send", {
        subject,
        message,
        recipients: selectedSubscribers.length ? selectedSubscribers : subscribers.map(s => s.email)
      });
      
      setCampaignSuccess(true);
      setTimeout(() => setCampaignSuccess(false), 3000);
      
      // Clear form
      setSubject("");
      setMessage("");
      setSelectedSubscribers([]);
      setSelectAll(false);
      
    } catch (error) {
      console.error("Error sending email:", error);
      alert(error.response?.data?.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteSubscriber = async (id, email) => {
    if (!window.confirm(`Remove ${email} from subscribers?`)) return;
    
    try {
      await api.delete(`/subscribers/admin/${id}`);
      setSubscribers(subscribers.filter(s => s._id !== id));
      setSelectedSubscribers(selectedSubscribers.filter(s => s !== email));
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      alert("Failed to delete subscriber");
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(s => s.email));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectSubscriber = (email) => {
    if (selectedSubscribers.includes(email)) {
      setSelectedSubscribers(selectedSubscribers.filter(e => e !== email));
      setSelectAll(false);
    } else {
      setSelectedSubscribers([...selectedSubscribers, email]);
    }
  };

  const handleApplyTemplate = (template) => {
    setSubject(emailTemplates[template].subject);
    setMessage(emailTemplates[template].message);
  };

  const handleExportCSV = () => {
    const headers = ["Email", "Subscribed Date"];
    const csvData = subscribers.map(s => [
      s.email,
      new Date(s.createdAt).toLocaleDateString()
    ]);
    
    const csv = [headers, ...csvData]
      .map(row => row.join(","))
      .join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-light text-[#00337C] mb-2 flex items-center">
              <Users className="w-6 h-6 mr-3" />
              Subscribers
            </h1>
            <p className="text-gray-600">
              Manage your email list and send campaigns
            </p>
          </div>

          {subscribers.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Subscribers</p>
                <p className="text-3xl font-light text-[#00337C]">{subscribers.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-light text-[#00337C]">
                  {subscribers.filter(s => 
                    new Date(s.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Selected</p>
                <p className="text-3xl font-light text-[#00337C]">{selectedSubscribers.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {campaignSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center"
            >
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-700">
                Email campaign sent successfully!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Campaign Form */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-[#F5F9FF] to-[#FFF0F0] border-b border-gray-100">
            <h2 className="text-lg font-medium text-[#00337C] flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Send Email Campaign
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Use Template
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(emailTemplates).map((template) => (
                  <button
                    key={template}
                    onClick={() => handleApplyTemplate(template)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm capitalize"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                placeholder="Enter email subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Message (HTML allowed)
                </label>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-sm text-gray-500 hover:text-[#00337C] transition-colors flex items-center"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-1" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </>
                  )}
                </button>
              </div>
              <textarea
                placeholder="Write your email content..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all font-mono text-sm"
                rows="6"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                <div 
                  className="prose max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: message || "<p>Your email preview will appear here...</p>" }}
                />
              </div>
            )}

            {/* Recipient Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>{selectedSubscribers.length || subscribers.length}</strong> recipient(s) selected
              </p>
            </div>

            {/* Send Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSendEmail}
                disabled={sending || !subject.trim() || !message.trim()}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </>
                )}
              </button>
              <span className="text-sm text-gray-500">
                {sending ? "Sending may take a moment..." : "Click to send campaign"}
              </span>
            </div>
          </div>
        </div>

        {/* Subscribers List */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-medium text-[#00337C]">
                Subscriber List
              </h2>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {error ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadSubscribers}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-light text-gray-700 mb-2">
                No subscribers yet
              </h3>
              <p className="text-gray-500">
                Subscribers will appear here when people sign up.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-[#00337C] border-gray-300 rounded focus:ring-[#00337C]"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSubscribers.map((subscriber) => (
                    <motion.tr
                      key={subscriber._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.includes(subscriber.email)}
                          onChange={() => handleSelectSubscriber(subscriber.email)}
                          className="w-4 h-4 text-[#00337C] border-gray-300 rounded focus:ring-[#00337C]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setExpandedEmail(expandedEmail === subscriber._id ? null : subscriber._id);
                          }}
                          className="p-2 text-gray-500 hover:text-[#00337C] rounded-lg hover:bg-gray-100 transition-colors"
                          title="View details"
                        >
                          {expandedEmail === subscriber._id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(subscriber.email);
                            alert("Email copied to clipboard!");
                          }}
                          className="p-2 text-gray-500 hover:text-[#00337C] rounded-lg hover:bg-gray-100 transition-colors"
                          title="Copy email"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubscriber(subscriber._id, subscriber.email)}
                          className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Delete subscriber"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {subscribers.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Showing {filteredSubscribers.length} of {subscribers.length} subscribers
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSubscribers;