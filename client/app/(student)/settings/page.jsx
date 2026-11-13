"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function StudentSettingsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await api.get("/auth/profile");
        const user = response.data.user || response.data;

        if (active) {
          setProfile({
            name: user.name || "",
            email: user.email || "",
          });
        }
      } catch (error) {
        if (active) {
          toast.error(
            error.response?.data?.message || "Unable to load your profile.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();

    if (!profile.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      await api.put("/auth/profile", {
        name: profile.name.trim(),
      });

      localStorage.setItem("name", profile.name.trim());

      toast.success("Account details updated.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to update account details.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Your new password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("The new passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Password changed successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Password change failed. Verify the backend route.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    router.replace("/login");
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#0c0b0a] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10";

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <div className="rounded-2xl border border-white/10 bg-[#11100f] p-10 text-center text-gray-400">
          Loading account settings...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-amber-400">
          STUDENT PORTAL / SETTINGS
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Settings
        </h1>

        <p className="mt-2 text-gray-400">
          Manage your account details, password, and session.
        </p>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-white/10 bg-[#11100f] p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Account information
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Update your basic student account details.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-300">
                Full name
              </label>

              <input
                className={inputClass}
                value={profile.name}
                onChange={(event) =>
                  setProfile((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">
                Email address
              </label>

              <input
                className={`${inputClass} cursor-not-allowed opacity-70`}
                type="email"
                value={profile.email}
                readOnly
                disabled
              />

              <p className="mt-2 text-xs text-gray-500">
                Contact your administrator if your email needs to be changed.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#11100f] p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Change password
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Choose a strong password with at least 8 characters.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-300">
                Current password
              </label>

              <input
                className={inputClass}
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">
                New password
              </label>

              <input
                className={inputClass}
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">
                Confirm new password
              </label>

              <input
                className={inputClass}
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update password"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-white">Sign out</h2>

          <p className="mt-2 text-sm text-gray-400">
            Sign out of your current session on this browser.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 rounded-xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
          >
            Log out
          </button>
        </section>
      </div>
    </div>
  );
}
