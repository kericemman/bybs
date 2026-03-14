import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Calendar, 
  Clock, 
  ChevronRight,
  X,
  Upload,
  Image as ImageIcon
} from "lucide-react";

const AdminCohorts = () => {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "upcoming",
    startDate: "",
    endDate: "",
    capacity: "",
    price: "",
    coverImage: null,
    features: [],
    facilitators: []
  });
  const [featureInput, setFeatureInput] = useState("");
  const [facilitatorInput, setFacilitatorInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fetchCohorts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/cohorts");
      setCohorts(data);
    } catch (error) {
      console.error("Error fetching cohorts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCohorts();
  }, []);

  const openCreateModal = () => {
    setEditingCohort(null);
    setFormData({
      title: "",
      description: "",
      status: "upcoming",
      startDate: "",
      endDate: "",
      capacity: "",
      price: "",
      coverImage: null,
      features: [],
      facilitators: []
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cohort) => {
    setEditingCohort(cohort);
    setFormData({
      title: cohort.title || "",
      description: cohort.description || "",
      status: cohort.status || "upcoming",
      startDate: cohort.startDate ? cohort.startDate.split('T')[0] : "",
      endDate: cohort.endDate ? cohort.endDate.split('T')[0] : "",
      capacity: cohort.capacity || "",
      price: cohort.price || "",
      coverImage: cohort.coverImage || null,
      features: cohort.features || [],
      facilitators: cohort.facilitators || []
    });
    setImagePreview(cohort.coverImage?.url || null);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addFacilitator = () => {
    if (facilitatorInput.trim()) {
      setFormData(prev => ({
        ...prev,
        facilitators: [...prev.facilitators, facilitatorInput.trim()]
      }));
      setFacilitatorInput("");
    }
  };

  const removeFacilitator = (index) => {
    setFormData(prev => ({
      ...prev,
      facilitators: prev.facilitators.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'features' || key === 'facilitators') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'coverImage' && formData[key] instanceof File) {
          formDataToSend.append('coverImage', formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingCohort) {
        await api.put(`/admin/cohorts/${editingCohort._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post("/admin/cohorts", formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setIsModalOpen(false);
      fetchCohorts();
    } catch (error) {
      console.error("Error saving cohort:", error);
    }
  };

  const deleteCohort = async (id) => {
    if (!confirm("Are you sure you want to delete this cohort? This action cannot be undone.")) return;
    try {
      await api.delete(`/admin/cohorts/${id}`);
      fetchCohorts();
    } catch (error) {
      console.error("Error deleting cohort:", error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'ongoing': return 'bg-blue-100 text-blue-700';
      case 'upcoming': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-light text-[#00337C] mb-2">Cohorts</h1>
          <p className="text-gray-600">Manage your fellowship cohorts and programs</p>
        </div>
        <button
          onClick={openCreateModal}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-[#00337C] text-white rounded-lg hover:bg-[#1E4B9E] transition-all duration-300"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Cohort
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Cohorts', value: cohorts.length, icon: <Users className="w-5 h-5" />, color: 'from-[#00337C] to-[#1E4B9E]' },
          { label: 'Active Cohorts', value: cohorts.filter(c => c.status === 'ongoing').length, icon: <Clock className="w-5 h-5" />, color: 'from-[#06D6A0] to-[#83F9C0]' },
          { label: 'Upcoming', value: cohorts.filter(c => c.status === 'upcoming').length, icon: <Calendar className="w-5 h-5" />, color: 'from-[#FFD166] to-[#FFE8A5]' },
          { label: 'Completed', value: cohorts.filter(c => c.status === 'completed').length, icon: <Users className="w-5 h-5" />, color: 'from-[#B76E79] to-[#D4A5A5]' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-light text-[#00337C]">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cohorts List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-[#00337C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cohorts...</p>
        </div>
      ) : cohorts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-light text-gray-700 mb-2">No cohorts yet</h3>
          <p className="text-gray-500 mb-6">Create your first cohort to start managing fellowship programs.</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-6 py-3 bg-[#00337C] text-white rounded-lg hover:bg-[#1E4B9E] transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Cohort
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cohorts.map((cohort) => (
            <motion.div
              key={cohort._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h2 className="text-xl font-light text-[#00337C] mr-4">{cohort.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cohort.status)}`}>
                      {cohort.status}
                    </span>
                  </div>
                  
                  {cohort.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 max-w-2xl">
                      {cohort.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    {cohort.startDate && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(cohort.startDate).toLocaleDateString()}
                      </div>
                    )}
                    {cohort.capacity && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {cohort.capacity} spots
                      </div>
                    )}
                    {cohort.price && (
                      <div className="flex items-center font-medium text-[#B76E79]">
                        ${cohort.price}
                      </div>
                    )}
                  </div>

                  {cohort.features && cohort.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {cohort.features.slice(0, 3).map((feature, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {feature}
                        </span>
                      ))}
                      {cohort.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{cohort.features.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  <button
                    onClick={() => openEditModal(cohort)}
                    className="p-2 text-gray-600 hover:text-[#00337C] hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit cohort"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteCohort(cohort._id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Delete cohort"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <a
                    href={`/admin/cohorts/${cohort._id}`}
                    className="p-2 text-gray-600 hover:text-[#00337C] hover:bg-gray-100 rounded-lg transition-colors"
                    title="View details"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cohort Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full"
              >
                <div className="px-6 py-4 bg-gradient-to-r from-[#00337C] to-[#1E4B9E] flex justify-between items-center">
                  <h3 className="text-xl font-light text-white">
                    {editingCohort ? 'Edit Cohort' : 'Create New Cohort'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cohort Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                        placeholder="e.g., Women in Leadership Cohort"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                        placeholder="Brief description of the cohort..."
                      />
                    </div>

                    {/* Cover Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="coverImage"
                          />
                          <label
                            htmlFor="coverImage"
                            className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#00337C] transition-colors cursor-pointer"
                          >
                            <Upload className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="text-gray-600">Choose image</span>
                          </label>
                        </div>
                        {imagePreview && (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null);
                                setFormData(prev => ({ ...prev, coverImage: null }));
                              }}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dates & Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capacity
                        </label>
                        <input
                          type="number"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                          placeholder="e.g., 30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Features */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Features
                      </label>
                      <div className="flex space-x-2 mb-3">
                        <input
                          type="text"
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                          placeholder="Add a feature..."
                        />
                        <button
                          type="button"
                          onClick={addFeature}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {feature}
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="ml-2 text-gray-500 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Facilitators */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facilitators
                      </label>
                      <div className="flex space-x-2 mb-3">
                        <input
                          type="text"
                          value={facilitatorInput}
                          onChange={(e) => setFacilitatorInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacilitator())}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/20 outline-none transition-all"
                          placeholder="Add a facilitator..."
                        />
                        <button
                          type="button"
                          onClick={addFacilitator}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.facilitators.map((facilitator, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {facilitator}
                            <button
                              type="button"
                              onClick={() => removeFacilitator(index)}
                              className="ml-2 text-blue-500 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#00337C] text-white rounded-lg hover:bg-[#1E4B9E] transition-colors"
                    >
                      {editingCohort ? 'Update Cohort' : 'Create Cohort'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminCohorts;