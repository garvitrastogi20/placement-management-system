"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PageContainer from "@/components/ui/PageContainer";
import HeroBanner from "@/components/ui/HeroBanner";

export default function RecruiterSettingsPage() {
  const router = useRouter();

  const [settings, setSettings] = useState({
    newApplications: true,
    shortlistUpdates: true,
    emailNotifications: true,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem("recruiterSettings");

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    localStorage.setItem("recruiterSettings", JSON.stringify(settings));

    alert("Settings saved successfully");
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <HeroBanner
          title="Settings"
          subtitle="Manage your recruiter preferences and account settings."
        />

        {/* Notifications */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-xl font-semibold">Notifications</h2>

          <div className="space-y-5">
            <SettingRow
              title="New Applications"
              description="Get notified when a student applies to your job."
              enabled={settings.newApplications}
              onToggle={() => handleToggle("newApplications")}
            />

            <SettingRow
              title="Shortlist Updates"
              description="Receive updates when application statuses change."
              enabled={settings.shortlistUpdates}
              onToggle={() => handleToggle("shortlistUpdates")}
            />

            <SettingRow
              title="Email Notifications"
              description="Receive important recruitment updates by email."
              enabled={settings.emailNotifications}
              onToggle={() => handleToggle("emailNotifications")}
            />
          </div>
        </div>

        {/* Account */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-6 text-xl font-semibold">Account</h2>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => router.push("/recruiter/profile")}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              Manage Profile
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-500/10 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Save Settings
          </button>
        </div>
      </div>
    </PageContainer>
  );
}

function SettingRow({ title, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-label={`Toggle ${title}`}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-white" : "bg-gray-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full transition ${
            enabled ? "left-6 bg-black" : "left-1 bg-gray-400"
          }`}
        />
      </button>
    </div>
  );
}
