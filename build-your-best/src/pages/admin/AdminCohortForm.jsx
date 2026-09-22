import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../utils/axios";

const AdminCohortForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "upcoming",
  });

  const [gallery, setGallery] = useState([]);

  // Load existing cohort if editing
  useEffect(() => {
    if (isEdit) {
      const fetchCohort = async () => {
        const { data } = await api.get(`/admin/cohorts`);
        const cohort = data.find((c) => c._id === id);

        if (cohort) {
          setForm({
            title: cohort.title,
            description: cohort.description,
            startDate: cohort.startDate?.slice(0, 10),
            endDate: cohort.endDate?.slice(0, 10),
            status: cohort.status,
          });
        }
      };

      fetchCohort();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    for (let file of gallery) {
      formData.append("gallery", file);
    }

    if (isEdit) {
      await api.put(`/admin/cohorts/${id}`, formData);
    } else {
      await api.post("/admin/cohorts", formData);
    }

    navigate("/admin/cohorts");
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Cohort" : "Create Cohort"}</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Cohort Title"
            className="w-full border p-2"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 h-32"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="border p-2"
            />

            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="border p-2"
            />
          </div>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>

          <div>
            <label className="block mb-2 font-medium">Gallery Images</label>

            <input
              type="file"
              multiple
              onChange={(e) => setGallery(e.target.files)}
              className="border p-2 w-full"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/cohorts")}
              className="border px-4 py-2"
            >
              Cancel
            </button>

            <button className="bg-black text-white px-4 py-2">
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminCohortForm;
