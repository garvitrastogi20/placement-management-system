"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ResumeUpload from "@/components/ResumeUpload";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    college: "",
    branch: "",
    cgpa: "",
    skills: "",
  });

  const [formData, setFormData] = useState({
    college: "",
    branch: "",
    cgpa: "",
    skills: "",
  });
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/student/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

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

      // Refresh profile
      const profileRes = await api.get("/student/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(profileRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete resume.");
    }
  };

  const handleEdit = () => {
    setEditData({
      college: profile.college,
      branch: profile.branch,
      cgpa: profile.cgpa,
      skills: profile.skills.join(", "),
    });

    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        "/student/profile",
        {
          ...editData,
          skills: editData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProfile(res.data.student);

      setIsEditing(false);

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/student/profile",
        {
          ...formData,
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Profile created successfully!");

      router.push("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create profile");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">
          <h1 className="text-3xl font-semibold">Loading...</h1>
        </div>
      </>
    );
  }

  // -------------------------------
  // NEW STUDENT
  // -------------------------------

  if (!profile) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center p-8">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-10 w-full max-w-2xl shadow-2xl"
          >
            <h1 className="text-4xl font-bold mb-2">Complete Your Profile</h1>

            <p className="text-gray-400 mb-8">
              Complete your profile before applying for jobs.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block mb-2">College</label>

                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Branch</label>

                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">CGPA</label>

                <input
                  type="number"
                  step="0.01"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Skills</label>

                <input
                  type="text"
                  name="skills"
                  placeholder="React, Node.js, MongoDB"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-4 text-lg font-semibold transition"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  // -------------------------------
  // EXISTING STUDENT
  // -------------------------------

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-950 text-white p-8">
        <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-3xl p-10 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Student Profile</h1>

            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-lg font-semibold"
              >
                ✏ Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateProfile}
                  className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg"
                >
                  Save
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-gray-400">College</p>

              {isEditing ? (
                <input
                  type="text"
                  name="college"
                  value={editData.college}
                  onChange={handleEditChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mt-2"
                />
              ) : (
                <p className="text-xl">{profile.college}</p>
              )}
            </div>

            <div>
              <p className="text-gray-400">Branch</p>

              {isEditing ? (
                <input
                  type="text"
                  name="branch"
                  value={editData.branch}
                  onChange={handleEditChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mt-2"
                />
              ) : (
                <p className="text-xl">{profile.branch}</p>
              )}
            </div>

            <div>
              <p className="text-gray-400">CGPA</p>

              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  name="cgpa"
                  value={editData.cgpa}
                  onChange={handleEditChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mt-2"
                />
              ) : (
                <p className="text-xl text-green-400">{profile.cgpa}</p>
              )}
            </div>

            <div>
              <p className="text-gray-400 mb-2">Skills</p>

              {isEditing ? (
                <textarea
                  name="skills"
                  value={editData.skills}
                  onChange={handleEditChange}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 mt-2"
                  placeholder="React, Node.js, MongoDB"
                />
              ) : (
                <div className="flex flex-wrap gap-3">
                  {profile.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-600 px-4 py-2 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Resume Section */}

            <div>
              <p className="text-gray-400 text-lg mb-4">Resume</p>

              {profile.resume?.url ? (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <p className="text-xl font-semibold">
                    📄 {profile.resume.originalName}
                  </p>

                  <p className="text-gray-400 mt-2">
                    Uploaded on{" "}
                    {profile.resume.uploadedAt
                      ? new Date(profile.resume.uploadedAt).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-6">
                    <a
                      href={profile.resume.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg"
                    >
                      👁 View Resume
                    </a>

                    <a
                      href={profile.resume.url}
                      download={profile.resume.originalName}
                      className="bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded-lg"
                    >
                      ⬇ Download Resume
                    </a>

                    <button
                      onClick={handleDeleteResume}
                      className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-lg"
                    >
                      🗑 Delete Resume
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <p className="text-red-400 mb-4">Resume not uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8">
          <ResumeUpload onUploadSuccess={fetchProfile} />
        </div>
      </div>
    </>
  );
}
