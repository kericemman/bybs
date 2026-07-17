import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getDashboardData } from "../../api/admin.api";
import { 
  FileText, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Loader2 
} from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getDashboardData();
      setData(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#00337C] mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl mt-10 md:text-3xl font-light text-gray-900">
              Welcome back, <span className="font-medium text-[#00337C]">{data.admin.name}</span>
            </h1>
            <p className="text-gray-600 mt-1">{data.admin.email}</p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard 
          title="Total Articles" 
          value={data.stats.totalArticles}
          icon={<FileText className="w-5 h-5" />}
          color="from-[#00337C] to-[#1E4B9E]"
        />
        <StatCard 
          title="Published" 
          value={data.stats.publishedArticles}
          icon={<CheckCircle className="w-5 h-5" />}
          color="from-[#06D6A0] to-[#83F9C0]"
        />
        <StatCard 
          title="Drafts" 
          value={data.stats.draftArticles}
          icon={<Clock className="w-5 h-5" />}
          color="from-[#FFD166] to-[#FFE8A5]"
        />
        <StatCard 
          title="Revenue" 
          value={`USD ${Number(data.stats.totalRevenue || 0).toFixed(2)}`}
          icon={<DollarSign className="w-5 h-5" />}
          color="from-[#B76E79] to-[#D4A5A5]"
          trend={"+12.5%"}
        />
      </div>

      {/* Recent Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FileText className="w-5 h-5 text-[#00337C] mr-2" />
              Recent Articles
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {data.recentArticles.map((article) => (
              <div key={article._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {article.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Updated: {new Date(article.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-3 ${
                    article.status === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <a 
              href="/admin/articles" 
              className="text-sm text-[#00337C] hover:text-[#1E4B9E] font-medium transition-colors"
            >
              View all articles →
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <DollarSign className="w-5 h-5 text-[#00337C] mr-2" />
              Recent Payments
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {data.recentPayments.map((payment) => (
              <div key={payment._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {payment.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(payment.createdAt).toLocaleDateString()} • {payment.product}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#B76E79] ml-3">
                    USD {payment.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <a 
              href="/admin/payments" 
              className="text-sm text-[#00337C] hover:text-[#1E4B9E] font-medium transition-colors"
            >
              View all payments →
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-all duration-200 hover:shadow-md">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      {trend && (
        <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend}
        </span>
      )}
    </div>
    
    <div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

export default Dashboard;
