"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaCamera,
  FaCheck,
  FaLock,
  FaPen,
  FaUserTie,
  FaBuilding,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
} from "react-icons/fa";

import PageContainer from "@/components/ui/PageContainer";
import HeroBanner from "@/components/ui/HeroBanner";

import {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
} from "@/services/authService";

export default function RecruiterProfile() {
  const fileInputRef = useRef(null);

  // ======================================================
  // Profile State
  // ======================================================

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "recruiter",

    profileImage: "",

    designation: "",
    department: "",
    recruiterId: "",
    phone: "",

    companyName: "",
    companyLogo: "",
    companyType: "",
    industry: "",
    companyWebsite: "",
    companyDescription: "",
    companySize: "",
    foundedYear: "",

    officeAddress: "",
    city: "",
    state: "",
    country: "India",

    linkedin: "",
    companyLinkedin: "",

    bio: "",
    recruitmentExperience: "",

    hiringRoles: [],
    preferredSkills: [],
    employmentTypes: [],
    workModes: [],
    preferredLocations: [],

    minimumCgpa: "",
    graduationBatches: [],

    verified: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileImage, setProfileImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // ======================================================
  // Password State
  // ======================================================

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changingPassword, setChangingPassword] = useState(false);

  // ======================================================
  // Load Profile
  // ======================================================

  const loadProfile = useCallback(async () => {
    try {
      const data = await getProfile();

      setProfile({
        name: data.name || "",
        email: data.email || "",
        role: data.role || "recruiter",

        profileImage: data.profileImage || "",

        designation: data.designation || "",
        department: data.department || "",
        recruiterId: data.recruiterId || "",
        phone: data.phone || "",

        companyName: data.companyName || "",
        companyLogo: data.companyLogo || "",
        companyType: data.companyType || "",
        industry: data.industry || "",
        companyWebsite: data.companyWebsite || "",
        companyDescription: data.companyDescription || "",
        companySize: data.companySize || "",
        foundedYear: data.foundedYear ?? "",

        officeAddress: data.officeAddress || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "India",

        linkedin: data.linkedin || "",
        companyLinkedin: data.companyLinkedin || "",

        bio: data.bio || "",
        recruitmentExperience: data.recruitmentExperience ?? "",

        hiringRoles: data.hiringRoles || [],
        preferredSkills: data.preferredSkills || [],
        employmentTypes: data.employmentTypes || [],
        workModes: data.workModes || [],
        preferredLocations: data.preferredLocations || [],

        minimumCgpa: data.minimumCgpa ?? "",
        graduationBatches: data.graduationBatches || [],

        verified: data.verified || false,
      });

      if (data.profileImage) {
        setProfileImage(data.profileImage);
        localStorage.setItem("recruiterProfileImage", data.profileImage);
        window.dispatchEvent(new Event("profileUpdated"));
      }
    } catch (error) {
      console.error("Failed to load recruiter profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ======================================================
  // Generic Input Handler
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // Array Field Handler
  // ======================================================

  const handleArrayChange = (field, value) => {
    const array = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setProfile((prev) => ({
      ...prev,
      [field]: array,
    }));
  };

  // ======================================================
  // Profile Image
  // ======================================================

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPEG, PNG, WebP, or GIF image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      const data = await uploadProfileImage(file);
      const imageUrl = data?.profileImage;

      if (!imageUrl) {
        throw new Error("No image URL returned from server.");
      }

      setProfileImage(imageUrl);

      setProfile((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));

      localStorage.setItem("recruiterProfileImage", imageUrl);
      window.dispatchEvent(new Event("profileUpdated"));
    } catch (error) {
      console.error("Profile image upload error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload profile image.",
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  // ======================================================
  // Save Profile
  // ======================================================

  const handleSaveProfile = async () => {
    if (!profile.name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const data = await updateProfile({
        ...profile,
        name: profile.name.trim(),
      });

      const updatedUser = data.user || data;

      setProfile((prev) => ({
        ...prev,
        ...updatedUser,
      }));

      if (updatedUser.name) {
        localStorage.setItem("name", updatedUser.name);
      }

      setEditMode(false);

      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Update profile error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // Password Change
  // ======================================================

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (!passwordData.currentPassword) {
      alert("Enter your current password.");
      return;
    }

    if (!passwordData.newPassword) {
      alert("Enter a new password.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      alert("Password changed successfully.");
    } catch (error) {
      console.error("Change password error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to change password.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // ======================================================
  // Initials
  // ======================================================

  const getInitials = () => {
    if (!profile.name) return "R";

    return profile.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // ======================================================
  // Loading
  // ======================================================

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-sm text-gray-400">
            Loading recruiter profile...
          </div>
        </div>
      </PageContainer>
    );
  }

  // ======================================================
  // Page
  // ======================================================

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* ==================================================
            Header
        ================================================== */}

        <HeroBanner
          title="Recruiter Profile"
          subtitle="Manage your professional identity, company information and hiring preferences."
        />

        {/* ==================================================
            Profile Hero
        ================================================== */}

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                {/* Profile Image */}

                <div className="relative">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white/10 bg-gradient-to-br from-purple-500/30 to-blue-500/20 shadow-xl">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Recruiter profile"
                        width={128}
                        height={128}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {getInitials()}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#090807] bg-white text-black shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                    title={uploadingImage ? "Uploading..." : "Change profile photo"}
                  >
                    <FaCamera size={14} />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Identity */}

                <div className="text-center sm:text-left">
                  <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
                    <h1 className="text-3xl font-bold tracking-tight">
                      {profile.name || "Recruiter"}
                    </h1>

                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                      <FaCheck size={11} />
                    </span>
                  </div>

                  <p className="text-gray-400">{profile.email}</p>

                  {profile.designation && (
                    <p className="mt-1 text-sm text-gray-500">
                      {profile.designation}
                    </p>
                  )}

                  {profile.companyName && (
                    <p className="mt-1 text-sm text-gray-500">
                      {profile.companyName}
                    </p>
                  )}

                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300">
                    <FaUserTie />
                    Recruiter
                  </div>
                </div>
              </div>

              {/* Edit Button */}

              <button
                type="button"
                onClick={() => setEditMode(!editMode)}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
              >
                <FaPen size={12} />

                {editMode ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================
            Personal / Professional Information
        ================================================== */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
          <SectionHeader
            icon={<FaUserTie />}
            title="Professional Information"
            subtitle="Your recruiter identity and professional details."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <InputField
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!editMode}
            />

            <InputField
              label="Email Address"
              name="email"
              value={profile.email}
              disabled
            />

            <InputField
              label="Recruiter ID"
              name="recruiterId"
              value={profile.recruiterId}
              onChange={handleChange}
              disabled={!editMode}
            />

            <InputField
              label="Designation"
              name="designation"
              value={profile.designation}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="e.g. HR Manager"
            />

            <InputField
              label="Department"
              name="department"
              value={profile.department}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="e.g. Human Resources"
            />

            <InputField
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="Phone number"
            />
          </div>
        </div>

        {/* ==================================================
            Company Information
        ================================================== */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
          <SectionHeader
            icon={<FaBuilding />}
            title="Company Information"
            subtitle="Tell candidates about the organization you represent."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <InputField
              label="Company Name"
              name="companyName"
              value={profile.companyName}
              onChange={handleChange}
              disabled={!editMode}
            />

            <InputField
              label="Company Type"
              name="companyType"
              value={profile.companyType}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="e.g. Private, Startup"
            />

            <InputField
              label="Industry"
              name="industry"
              value={profile.industry}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="e.g. Information Technology"
            />

            <InputField
              label="Company Size"
              name="companySize"
              value={profile.companySize}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="e.g. 500-1000"
            />

            <InputField
              label="Founded Year"
              name="foundedYear"
              type="number"
              value={profile.foundedYear}
              onChange={handleChange}
              disabled={!editMode}
            />

            <InputField
              label="Company Website"
              name="companyWebsite"
              value={profile.companyWebsite}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="https://..."
            />

            <div className="md:col-span-2 lg:col-span-3">
              <label className="mb-2 block text-sm text-gray-400">
                Company Description
              </label>

              <textarea
                name="companyDescription"
                value={profile.companyDescription}
                onChange={handleChange}
                disabled={!editMode}
                rows={4}
                placeholder="Describe your company..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* ==================================================
            Office Information
        ================================================== */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
          <SectionHeader
            icon={<FaMapMarkerAlt />}
            title="Office & Location"
            subtitle="Add the location and office information candidates may need."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2 lg:col-span-3">
              <label className="mb-2 block text-sm text-gray-400">
                Office Address
              </label>

              <textarea
                name="officeAddress"
                value={profile.officeAddress}
                onChange={handleChange}
                disabled={!editMode}
                rows={3}
                placeholder="Office address"
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <InputField
              label="City"
              name="city"
              value={profile.city}
              onChange={handleChange}
              disabled={!editMode}
            />

            <InputField
              label="State"
              name="state"
              value={profile.state}
              onChange={handleChange}
              disabled={!editMode}
            />

            <InputField
              label="Country"
              name="country"
              value={profile.country}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
        </div>

        {/* ==================================================
            Social Links
        ================================================== */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
          <SectionHeader
            icon={<FaBriefcase />}
            title="Professional Links"
            subtitle="Add your professional and company social profiles."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <InputField
              label="LinkedIn Profile"
              name="linkedin"
              value={profile.linkedin}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="https://linkedin.com/in/..."
            />

            <InputField
              label="Company LinkedIn"
              name="companyLinkedin"
              value={profile.companyLinkedin}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="https://linkedin.com/company/..."
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-400">
                Recruiter Bio
              </label>

              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                disabled={!editMode}
                rows={4}
                placeholder="Write a short professional bio..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <InputField
              label="Recruitment Experience (Years)"
              name="recruitmentExperience"
              type="number"
              value={profile.recruitmentExperience}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
        </div>

        {/* ==================================================
            Hiring Preferences
        ================================================== */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
          <SectionHeader
            icon={<FaBriefcase />}
            title="Hiring Preferences"
            subtitle="Define the kind of candidates and roles you usually recruit for."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <ArrayField
              label="Hiring Roles"
              value={profile.hiringRoles}
              onChange={(value) => handleArrayChange("hiringRoles", value)}
              disabled={!editMode}
              placeholder="Software Engineer, Frontend Developer"
            />

            <ArrayField
              label="Preferred Skills"
              value={profile.preferredSkills}
              onChange={(value) => handleArrayChange("preferredSkills", value)}
              disabled={!editMode}
              placeholder="JavaScript, React, Node.js"
            />

            <ArrayField
              label="Employment Types"
              value={profile.employmentTypes}
              onChange={(value) => handleArrayChange("employmentTypes", value)}
              disabled={!editMode}
              placeholder="Full Time, Internship"
            />

            <ArrayField
              label="Work Modes"
              value={profile.workModes}
              onChange={(value) => handleArrayChange("workModes", value)}
              disabled={!editMode}
              placeholder="Remote, Hybrid, On-site"
            />

            <ArrayField
              label="Preferred Locations"
              value={profile.preferredLocations}
              onChange={(value) =>
                handleArrayChange("preferredLocations", value)
              }
              disabled={!editMode}
              placeholder="Chandigarh, Delhi, Bangalore"
            />

            <ArrayField
              label="Graduation Batches"
              value={profile.graduationBatches}
              onChange={(value) =>
                handleArrayChange("graduationBatches", value)
              }
              disabled={!editMode}
              placeholder="2026, 2027"
            />

            <InputField
              label="Minimum CGPA"
              name="minimumCgpa"
              type="number"
              step="0.01"
              value={profile.minimumCgpa}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="e.g. 7"
            />
          </div>

          <p className="mt-5 text-xs text-gray-600">
            For multiple values, separate each item with a comma.
          </p>
        </div>

        {/* ==================================================
            Save Changes
        ================================================== */}

        {editMode && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="rounded-xl bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* ==================================================
            Account Overview
        ================================================== */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
          <h2 className="text-xl font-semibold">Recruiter Account</h2>

          <p className="mt-1 text-sm text-gray-500">Your account overview.</p>

          <div className="mt-7 grid gap-6 md:grid-cols-3">
            <InfoItem label="Role" value="Recruiter" />

            <InfoItem label="Email" value={profile.email} />

            <InfoItem label="Profile" value="Active" success />
          </div>
        </div>

        {/* ==================================================
            Security
        ================================================== */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5">
              <FaLock className="text-gray-300" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Account Security</h2>

              <p className="mt-1 text-sm text-gray-500">
                Update your password to keep your recruiter account secure.
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePasswordChange}
            className="grid gap-5 md:grid-cols-3"
          >
            <PasswordInput
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />

            <PasswordInput
              label="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />

            <PasswordInput
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={changingPassword}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {changingPassword ? "Updating..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>

        {/* ==================================================
            Photo Information
        ================================================== */}

        <p className="text-center text-xs text-gray-600">
          Profile photos are currently stored locally on this browser.
        </p>
      </div>
    </PageContainer>
  );
}

// ======================================================
// Section Header
// ======================================================

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="mb-7 flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-gray-300">
        {icon}
      </div>

      <div>
        <h2 className="text-xl font-semibold">{title}</h2>

        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

// ======================================================
// Input Field
// ======================================================

function InputField({
  label,
  name,
  value,
  onChange,
  disabled,
  type = "text",
  placeholder = "",
  step,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-400">{label}</label>

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        step={step}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

// ======================================================
// Array Field
// ======================================================

function ArrayField({ label, value, onChange, disabled, placeholder = "" }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-400">{label}</label>

      <input
        type="text"
        value={Array.isArray(value) ? value.join(", ") : ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

// ======================================================
// Info Item
// ======================================================

function InfoItem({ label, value, success }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-600">{label}</p>

      <p
        className={`mt-1 break-all text-sm ${
          success ? "text-green-400" : "text-gray-300"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}

// ======================================================
// Password Input
// ======================================================

function PasswordInput({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-400">{label}</label>

      <input
        type="password"
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
      />
    </div>
  );
}
