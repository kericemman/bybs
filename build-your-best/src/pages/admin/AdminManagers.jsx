import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  createAdminManager,
  deleteAdminManager,
  getAdminManagers,
  updateAdminManager,
} from "../../api/adminManager.api";
import { MANAGER_PERMISSIONS } from "../../utils/adminPermissions";
import { Plus, Save, ShieldCheck, Trash2, UserCog } from "lucide-react";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  active: true,
  permissions: MANAGER_PERMISSIONS.map((permission) => permission.value),
};

export default function AdminManagers() {
  const [managers, setManagers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadManagers = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getAdminManagers();
      setManagers(data || []);
    } catch (loadError) {
      setError(loadError.response?.data?.message || "Failed to load admin managers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManagers();
  }, []);

  const togglePermission = (permission) => {
    setForm((current) => {
      const hasPermission = current.permissions.includes(permission);
      return {
        ...current,
        permissions: hasPermission
          ? current.permissions.filter((item) => item !== permission)
          : [...current.permissions, permission],
      };
    });
  };

  const startEdit = (manager) => {
    setEditingId(manager._id);
    setForm({
      name: manager.name || "",
      email: manager.email || "",
      password: "",
      active: manager.active !== false,
      permissions: manager.permissions?.length
        ? manager.permissions
        : MANAGER_PERMISSIONS.map((permission) => permission.value),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId("");
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        const { data } = await updateAdminManager(editingId, payload);
        setManagers((current) => current.map((manager) => (manager._id === data._id ? data : manager)));
      } else {
        const { data } = await createAdminManager(form);
        setManagers((current) => [data, ...current]);
      }

      resetForm();
    } catch (saveError) {
      setError(saveError.response?.data?.message || "Failed to save admin manager.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (manager) => {
    if (!window.confirm(`Remove ${manager.email} as an admin manager?`)) return;

    try {
      await deleteAdminManager(manager._id);
      setManagers((current) => current.filter((item) => item._id !== manager._id));
      if (editingId === manager._id) resetForm();
    } catch (deleteError) {
      alert(deleteError.response?.data?.message || "Failed to delete admin manager.");
    }
  };

  return (
    <AdminLayout>
      <div className="mt-10 space-y-6">
        <div>
          <h1 className="text-3xl font-light text-[#00337C]">Admin Managers</h1>
          <p className="mt-1 text-gray-600">
            Add managers who can screen applications and manage articles without full admin access.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F9FF] text-[#00337C]">
              <UserCog className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#10233F]">
                {editingId ? "Edit manager" : "Add manager"}
              </h2>
              <p className="text-sm text-gray-500">Managers only receive the permissions selected below.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
              required
            />
            <Input
              label={editingId ? "New password" : "Password"}
              type="password"
              value={form.password}
              onChange={(value) => setForm({ ...form, password: value })}
              required={!editingId}
              helper={editingId ? "Leave blank to keep the current password." : ""}
            />
            <label className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm({ ...form, active: event.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#00337C]"
              />
              Active account
            </label>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {MANAGER_PERMISSIONS.map((permission) => (
              <label
                key={permission.value}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={form.permissions.includes(permission.value)}
                  onChange={() => togglePermission(permission.value)}
                  className="h-4 w-4 rounded border-gray-300 text-[#00337C]"
                />
                {permission.label}
              </label>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#00337C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1E4B9E] disabled:opacity-60"
            >
              {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {saving ? "Saving..." : editingId ? "Update manager" : "Create manager"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-lg font-semibold text-[#10233F]">Current managers</h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-500">Loading managers...</div>
          ) : managers.length === 0 ? (
            <div className="py-16 text-center">
              <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-gray-500">No admin managers added yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {managers.map((manager) => (
                <div key={manager._id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1fr_1fr_auto] lg:items-center">
                  <div>
                    <p className="font-semibold text-[#10233F]">{manager.name || "Unnamed manager"}</p>
                    <p className="mt-1 text-sm text-gray-500">{manager.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(manager.permissions || []).map((permission) => (
                      <span key={permission} className="rounded-full bg-[#F5F9FF] px-3 py-1 text-xs text-[#00337C]">
                        {permission}
                      </span>
                    ))}
                    <span className={`rounded-full px-3 py-1 text-xs ${manager.active === false ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {manager.active === false ? "Inactive" : "Active"}
                    </span>
                  </div>
                  <div className="flex gap-2 lg:justify-end">
                    <button
                      onClick={() => startEdit(manager)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(manager)}
                      className="rounded-lg border border-red-100 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function Input({ label, value, onChange, type = "text", required = false, helper = "" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
      />
      {helper && <span className="mt-1 block text-xs text-gray-500">{helper}</span>}
    </label>
  );
}
