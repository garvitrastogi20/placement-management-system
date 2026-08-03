"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getSingleJob, updateJob } from "@/services/recruiterService";

import toast from "react-hot-toast";

export default function EditJobPage() {
  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    package: "",
    description: "",
    skillsRequired: "",
    deadline: "",
  });

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const data = await getSingleJob(id);

      setFormData({
        title: data.title,

        company: data.company,

        location: data.location,

        package: data.package,

        description: data.description,

        skillsRequired: data.skillsRequired.join(", "),

        deadline: data.deadline ? data.deadline.substring(0, 10) : "",
      });
    } catch {
      toast.error("Job not found");
    } finally {
      setLoading(false);
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
      await updateJob(id, {
        ...formData,

        skillsRequired: formData.skillsRequired
          .split(",")
          .map((skill) => skill.trim()),
      });

      toast.success("Job Updated Successfully");

      router.push("/recruiter/jobs");
    } catch {
      toast.error("Failed to update job");
    }
  };

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold mb-8">Edit Job</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full rounded-xl bg-gray-900 border border-gray-700 p-4"
          required
        />

        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company"
          className="w-full rounded-xl bg-gray-900 border border-gray-700 p-4"
          required
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full rounded-xl bg-gray-900 border border-gray-700 p-4"
          required
        />

        <input
          type="number"
          name="package"
          value={formData.package}
          onChange={handleChange}
          placeholder="Package"
          className="w-full rounded-xl bg-gray-900 border border-gray-700 p-4"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={5}
          className="w-full rounded-xl bg-gray-900 border border-gray-700 p-4"
          required
        />

        <input
          type="text"
          name="skillsRequired"
          value={formData.skillsRequired}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
          className="w-full rounded-xl bg-gray-900 border border-gray-700 p-4"
        />

        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full rounded-xl bg-gray-900 border border-gray-700 p-4"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 hover:bg-blue-700"
          >
            Update Job
          </button>

          <button
            type="button"
            onClick={() => router.push("/recruiter/jobs")}
            className="rounded-xl border border-gray-600 px-6 py-3 hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
