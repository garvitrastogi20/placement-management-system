"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaGraduationCap,
  FaCode,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaPhone,
  FaFileAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaTrash,
  FaEye,
  FaDownload,
  FaCheckCircle,
} from "react-icons/fa";

import ResumeUpload from "@/components/ResumeUpload";
import GlassCard from "@/components/ui/GlassCard";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    college: "",
    branch: "",
    semester: "",
    cgpa: "",
    skills: "",
    linkedin: "",
    github: "",
    portfolio: "",
    bio: "",
  });

  // ======================================================
  // Fetch Profile
  // ======================================================

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await api.get("/student/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load profile.");
      }

      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ======================================================
  // Profile Completion
  // ======================================================

  const completion = useMemo(() => {
    if (!profile) return 0;

    const fields = [
      profile.phone,
      profile.college,
      profile.branch,
      profile.semester,
      profile.cgpa,
      profile.skills?.length > 0,
      profile.linkedin,
      profile.github,
      profile.portfolio,
      profile.bio,
      profile.resume?.url,
    ];

    const completed = fields.filter(Boolean).length;

    return Math.round((completed / fields.length) * 100);
  }, [profile]);

  // ======================================================
  // Start Editing
  // ======================================================

  const handleEdit = () => {
    setFormData({
      phone: profile.phone || "",
      college: profile.college || "",
      branch: profile.branch || "",
      semester:
        profile.semester !== null && profile.semester !== undefined
          ? profile.semester
          : "",
      cgpa: profile.cgpa || "",
      skills: profile.skills?.join(", ") || "",
      linkedin: profile.linkedin || "",
      github: profile.github || "",
      portfolio: profile.portfolio || "",
      bio: profile.bio || "",
    });

    setIsEditing(true);
  };

  // ======================================================
  // Form Change
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // Save Profile
  // ======================================================

  const handleSave = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const payload = {
        phone: formData.phone,
        college: formData.college,
        branch: formData.branch,
        semester: formData.semester,
        cgpa: formData.cgpa,

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio,
        bio: formData.bio,
      };

      const res = await api.put("/student/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data.student);
      setIsEditing(false);

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // Delete Resume
  // ======================================================

  const handleDeleteResume = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your resume?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await api.delete("/student/delete-resume", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);

      await fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete resume.");
    }
  };

  // ======================================================
  // Loading
  // ======================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#C97B3C]/20 border-t-[#F4C27A]" />

          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </main>
    );
  }

  // ======================================================
  // New Student / No Profile
  // ======================================================

  if (!profile) {
    return (
      <main className="min-h-screen bg-transparent px-6 py-12">
        <div className="mx-auto max-w-4xl">
            <div className="mb-10">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#C97B3C]">
                PLACEMENT AI
              </p>

              <h1 className="text-4xl font-extrabold md:text-5xl">
                Complete Your Profile
              </h1>

              <p className="mt-4 max-w-2xl text-gray-400">
                Build your professional profile to improve your placement
                opportunities and job recommendations.
              </p>
            </div>

            <GlassCard>
              <div className="grid gap-8 md:grid-cols-2">
                {/* Phone */}

                <ProfileInput
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  icon={<FaPhone />}
                />

                {/* College */}

                <ProfileInput
                  label="College"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Chandigarh University"
                  icon={<FaGraduationCap />}
                />

                {/* Branch */}

                <ProfileInput
                  label="Branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Computer Science Engineering"
                  icon={<FaCode />}
                />

                {/* Semester */}

                <ProfileInput
                  label="Semester"
                  name="semester"
                  type="number"
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="8"
                  icon={<FaGraduationCap />}
                />

                {/* CGPA */}

                <ProfileInput
                  label="CGPA"
                  name="cgpa"
                  type="number"
                  step="0.01"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="8.5"
                  icon={<FaCheckCircle />}
                />

                {/* Skills */}

                <ProfileInput
                  label="Skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="C++, React, Node.js, MongoDB"
                  icon={<FaCode />}
                />

                {/* GitHub */}

                <ProfileInput
                  label="GitHub"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  icon={<FaGithub />}
                />

                {/* LinkedIn */}

                <ProfileInput
                  label="LinkedIn"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  icon={<FaLinkedin />}
                />

                {/* Portfolio */}

                <div className="md:col-span-2">
                  <ProfileInput
                    label="Portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                    icon={<FaGlobe />}
                  />
                </div>

                {/* Bio */}

                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-gray-300">
                    Bio
                  </label>

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell recruiters a little about yourself..."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-[#C97B3C]/60 focus:bg-white/[0.06]"
                  />
                </div>
              </div>

              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");

                    const payload = {
                      ...formData,
                      semester: formData.semester,
                      cgpa: formData.cgpa,
                      skills: formData.skills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean),
                    };

                    const res = await api.post("/student/profile", payload, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });

                    setProfile(res.data.student);

                    toast.success("Profile created successfully.");
                  } catch (error) {
                    toast.error(
                      error.response?.data?.message ||
                        "Failed to create profile.",
                    );
                  }
                }}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#C97B3C] to-[#F4C27A] px-6 py-4 font-bold text-black transition hover:scale-[1.01] hover:shadow-[0_10px_40px_rgba(201,123,60,.2)]"
              >
                <FaSave />
                Create Profile
              </button>
            </GlassCard>
          </div>
        </main>
    );
  }

  // ======================================================
  // Existing Profile
  // ======================================================

  return (
      <main className="min-h-screen bg-transparent px-4 sm:px-6 py-8 sm:py-10 text-white md:px-10">
        <div className="mx-auto max-w-7xl">
          {/* ========================================= */}
          {/* HERO */}
          {/* ========================================= */}

          <div className="relative mb-8 overflow-hidden rounded-[32px] border border-[#C97B3C]/15 bg-gradient-to-br from-[#171412]/95 via-[#111111]/95 to-[#0B0B0B]/95 p-8 shadow-[0_20px_60px_rgba(0,0,0,.45)] md:p-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C97B3C]/10 blur-[100px]" />

            <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#C97B3C] to-[#F4C27A] text-3xl font-extrabold text-black shadow-[0_10px_40px_rgba(201,123,60,.2)]">
                  {profile.user?.name?.charAt(0)?.toUpperCase() || "S"}
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C97B3C]">
                    STUDENT PROFILE
                  </p>

                  <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">
                    {profile.user?.name || "Student"}
                  </h1>

                  <p className="mt-2 text-gray-400">{profile.user?.email}</p>
                </div>
              </div>

              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center gap-3 rounded-2xl border border-[#C97B3C]/30 bg-[#C97B3C]/10 px-6 py-3 font-semibold text-[#F4C27A] transition hover:bg-[#C97B3C]/20"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-2xl bg-[#C97B3C] px-6 py-3 font-semibold text-black transition hover:bg-[#F4C27A] disabled:opacity-50"
                  >
                    <FaSave />
                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 font-semibold text-gray-300 transition hover:bg-white/[0.08]"
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ========================================= */}
          {/* PROFILE COMPLETION */}
          {/* ========================================= */}

          <GlassCard className="mb-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#C97B3C]">
                  PROFILE STRENGTH
                </p>

                <h2 className="mt-2 text-2xl font-bold">Profile Completion</h2>

                <p className="mt-2 text-gray-400">
                  Complete your profile to improve your placement opportunities.
                </p>
              </div>

              <div className="text-right">
                <span className="text-4xl font-extrabold text-[#F4C27A]">
                  {completion}%
                </span>
              </div>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C97B3C] to-[#F4C27A] transition-all duration-700"
                style={{
                  width: `${completion}%`,
                }}
              />
            </div>
          </GlassCard>

          {/* ========================================= */}
          {/* PERSONAL + ACADEMIC */}
          {/* ========================================= */}

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Personal */}

            <GlassCard>
              <SectionTitle icon={<FaUser />} title="Personal Information" />

              <div className="grid gap-6 md:grid-cols-2">
                <InfoField
                  label="Name"
                  value={profile.user?.name || "Not provided"}
                />

                <InfoField
                  label="Email"
                  value={profile.user?.email || "Not provided"}
                />

                {isEditing ? (
                  <ProfileInput
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    icon={<FaPhone />}
                  />
                ) : (
                  <InfoField
                    label="Phone"
                    value={profile.phone || "Not provided"}
                  />
                )}
              </div>

              {isEditing ? (
                <div className="mt-6">
                  <label className="mb-3 block text-sm font-medium text-gray-300">
                    Bio
                  </label>

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none transition focus:border-[#C97B3C]/60"
                  />
                </div>
              ) : (
                <div className="mt-6">
                  <p className="mb-2 text-sm text-gray-500">Bio</p>

                  <p className="leading-7 text-gray-300">
                    {profile.bio || "No bio added yet."}
                  </p>
                </div>
              )}
            </GlassCard>

            {/* Academic */}

            <GlassCard>
              <SectionTitle
                icon={<FaGraduationCap />}
                title="Academic Information"
              />

              {isEditing ? (
                <div className="grid gap-6">
                  <ProfileInput
                    label="College"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    icon={<FaGraduationCap />}
                  />

                  <ProfileInput
                    label="Branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    icon={<FaCode />}
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <ProfileInput
                      label="Semester"
                      name="semester"
                      type="number"
                      value={formData.semester}
                      onChange={handleChange}
                      icon={<FaGraduationCap />}
                    />

                    <ProfileInput
                      label="CGPA"
                      name="cgpa"
                      type="number"
                      step="0.01"
                      value={formData.cgpa}
                      onChange={handleChange}
                      icon={<FaCheckCircle />}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  <InfoField
                    label="College"
                    value={profile.college || "Not provided"}
                  />

                  <InfoField
                    label="Branch"
                    value={profile.branch || "Not provided"}
                  />

                  <InfoField
                    label="Semester"
                    value={profile.semester ?? "Not provided"}
                  />

                  <InfoField
                    label="CGPA"
                    value={profile.cgpa ?? "Not provided"}
                    highlight
                  />
                </div>
              )}
            </GlassCard>
          </div>

          {/* ========================================= */}
          {/* SKILLS */}
          {/* ========================================= */}

          <div className="mt-8">
            <GlassCard>
              <SectionTitle icon={<FaCode />} title="Technical Skills" />

              {isEditing ? (
                <div>
                  <label className="mb-3 block text-sm text-gray-400">
                    Skills
                  </label>

                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows={3}
                    placeholder="C++, JavaScript, React, Node.js, MongoDB"
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-[#C97B3C]/60"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Separate skills using commas.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {profile.skills?.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full border border-[#C97B3C]/30 bg-[#C97B3C]/10 px-5 py-2.5 font-medium text-[#F4C27A]"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills added yet.</p>
                  )}
                </div>
              )}
            </GlassCard>
          </div>

          {/* ========================================= */}
          {/* PROFESSIONAL LINKS */}
          {/* ========================================= */}

          <div className="mt-8">
            <GlassCard>
              <SectionTitle icon={<FaGlobe />} title="Professional Links" />

              {isEditing ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <ProfileInput
                    label="GitHub"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    icon={<FaGithub />}
                  />

                  <ProfileInput
                    label="LinkedIn"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    icon={<FaLinkedin />}
                  />

                  <div className="md:col-span-2">
                    <ProfileInput
                      label="Portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                      icon={<FaGlobe />}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  <SocialLink
                    icon={<FaGithub />}
                    label="GitHub"
                    value={profile.github}
                  />

                  <SocialLink
                    icon={<FaLinkedin />}
                    label="LinkedIn"
                    value={profile.linkedin}
                  />

                  <SocialLink
                    icon={<FaGlobe />}
                    label="Portfolio"
                    value={profile.portfolio}
                  />
                </div>
              )}
            </GlassCard>
          </div>

          {/* ========================================= */}
          {/* RESUME */}
          {/* ========================================= */}

          <div className="mt-8">
            <GlassCard>
              <SectionTitle icon={<FaFileAlt />} title="Resume" />

              {profile.resume?.url ? (
                <div className="rounded-2xl border border-[#C97B3C]/20 bg-[#C97B3C]/5 p-6">
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C97B3C]/15 text-2xl text-[#F4C27A]">
                        <FaFileAlt />
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">
                          {profile.resume.originalName || "Resume"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Uploaded{" "}
                          {profile.resume.uploadedAt
                            ? new Date(
                                profile.resume.uploadedAt,
                              ).toLocaleDateString()
                            : "recently"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={profile.resume.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl border border-[#C97B3C]/30 bg-[#C97B3C]/10 px-4 py-2.5 font-medium text-[#F4C27A] transition hover:bg-[#C97B3C]/20"
                      >
                        <FaEye />
                        View
                      </a>

                      <a
                        href={profile.resume.url}
                        download={profile.resume.originalName}
                        className="flex items-center gap-2 rounded-xl bg-[#C97B3C] px-4 py-2.5 font-medium text-black transition hover:bg-[#F4C27A]"
                      >
                        <FaDownload />
                        Download
                      </a>

                      <button
                        onClick={handleDeleteResume}
                        className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 font-medium text-red-400 transition hover:bg-red-500/20"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C97B3C]/10 text-2xl text-[#F4C27A]">
                    <FaFileAlt />
                  </div>

                  <h3 className="text-xl font-semibold">No Resume Uploaded</h3>

                  <p className="mt-2 text-gray-500">
                    Upload your latest resume to improve your placement profile.
                  </p>
                </div>
              )}

              <div className="mt-6">
                <ResumeUpload onUploadSuccess={fetchProfile} />
              </div>
            </GlassCard>
          </div>

          {/* ========================================= */}
          {/* SAVE BUTTON */}
          {/* ========================================= */}

          {isEditing && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#C97B3C] to-[#F4C27A] px-8 py-4 font-bold text-black shadow-[0_10px_40px_rgba(201,123,60,.15)] transition hover:scale-[1.02] disabled:opacity-50"
              >
                <FaSave />

                {saving ? "Saving Profile..." : "Save Profile"}
              </button>
            </div>
          )}
        </div>
      </main>
  );
}

// ======================================================
// Reusable Input
// ======================================================

function ProfileInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  step,
  icon,
}) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-gray-300">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C97B3C]">
            {icon}
          </span>
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          step={step}
          className={`w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-[#C97B3C]/60 focus:bg-white/[0.06] ${
            icon ? "pl-11 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

// ======================================================
// Section Title
// ======================================================

function SectionTitle({ icon, title }) {
  return (
    <div className="mb-7 flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C97B3C]/10 text-[#F4C27A]">
        {icon}
      </div>

      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
}

// ======================================================
// Information Field
// ======================================================

function InfoField({ label, value, highlight = false }) {
  return (
    <div>
      <p className="mb-2 text-sm text-gray-500">{label}</p>

      <p
        className={`font-semibold ${
          highlight ? "text-[#F4C27A]" : "text-gray-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// ======================================================
// Social Link
// ======================================================

function SocialLink({ icon, label, value }) {
  if (!value) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center gap-3 text-gray-500">
          {icon}
          <span>{label}</span>
        </div>

        <p className="mt-3 text-sm text-gray-600">Not added</p>
      </div>
    );
  }

  return (
    <a
      href={value}
      target="_blank"
      rel="noreferrer"
      className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-[#C97B3C]/30 hover:bg-[#C97B3C]/5"
    >
      <div className="flex items-center gap-3 text-[#F4C27A]">
        {icon}

        <span className="font-semibold">{label}</span>
      </div>

      <p className="mt-3 truncate text-sm text-gray-400 transition group-hover:text-gray-200">
        {value}
      </p>
    </a>
  );
}
