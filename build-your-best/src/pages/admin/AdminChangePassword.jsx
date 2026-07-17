import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { defaultAdminPath } from "../../utils/adminPermissions";

export default function AdminChangePassword() {
  const { admin, changePassword, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Use at least 8 characters for the new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The new password and confirmation do not match.");
      return;
    }

    try {
      setSaving(true);
      const updatedAdmin = await changePassword({
        currentPassword: admin?.mustChangePassword ? undefined : currentPassword,
        newPassword,
      });
      navigate(defaultAdminPath(updatedAdmin), { replace: true });
    } catch (changeError) {
      setError(changeError.response?.data?.message || "Unable to change password right now.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F8FC] px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-gray-100 bg-white shadow-xl">
        <div className="border-b border-gray-100 p-6 sm:p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00337C] text-white">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#00337C]">
            Account security
          </p>
          <h1 className="mt-2 text-3xl font-light text-[#10233F]">
            Create your new password
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {admin?.mustChangePassword
              ? "You are signing in with a temporary password. Please replace it before opening the admin dashboard."
              : "Update your password to keep your admin account secure."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
          {error && (
            <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!admin?.mustChangePassword && (
            <PasswordField
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              visible={showPassword}
              required
            />
          )}

          <PasswordField
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            visible={showPassword}
            required
            helper="Use at least 8 characters. A mix of letters, numbers, and symbols is best."
          />

          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            visible={showPassword}
            required
          />

          <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#00337C]"
            />
            Show password while typing
          </label>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00337C] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E4B9E] disabled:opacity-60"
            >
              <CheckCircle2 className="h-4 w-4" />
              {saving ? "Saving..." : "Save password"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-2 border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
          <ShieldCheck className="h-4 w-4" />
          BYBS admin access is protected
        </div>
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, visible, required = false, helper = "" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm outline-none transition-colors focus:border-[#00337C] focus:ring-2 focus:ring-[#00337C]/15"
        />
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </div>
      </div>
      {helper && <span className="mt-1 block text-xs text-gray-500">{helper}</span>}
    </label>
  );
}
