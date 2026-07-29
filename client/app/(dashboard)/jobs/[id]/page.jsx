"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import Navbar from "@/components/Navbar";
import PageContainer from "@/components/layout/PageContainer";
import toast from "react-hot-toast";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJob(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to load job.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        `/jobs/${job._id}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      setJob((prev) => ({
        ...prev,
        isApplied: true,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Application Failed");
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return (
      <PageContainer>
        <Navbar />
        <div className="text-center mt-20 text-xl">Loading...</div>
      </PageContainer>
    );

  if (!job)
    return (
      <PageContainer>
        <Navbar />
        <div className="text-center mt-20 text-red-500 text-xl">
          Job Not Found
        </div>
      </PageContainer>
    );

  return (
    <PageContainer>
      <Navbar />

      <div className="max-w-5xl mx-auto mt-10">

        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-500 hover:underline"
        >
          ← Back to Jobs
        </button>

        <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">

          <h1 className="text-4xl font-bold">{job.title}</h1>

          <p className="text-xl text-blue-400 mt-2">
            {job.company}
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-8">

            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400">Location</p>
              <p>{job.location}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400">Package</p>
              <p>₹ {job.package?.toLocaleString()}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400">Deadline</p>
              <p>{new Date(job.deadline).toLocaleDateString()}</p>
            </div>

          </div>

          <div className="mt-10">

            <h2 className="text-2xl font-semibold">
              Job Description
            </h2>

            <p className="mt-4 text-gray-300 leading-8">
              {job.description}
            </p>

          </div>

          <div className="mt-10">

            <h2 className="text-2xl font-semibold">
              Required Skills
            </h2>

            <div className="flex flex-wrap gap-3 mt-5">

              {job.skillsRequired?.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-600 px-4 py-2 rounded-full"
                >
                  {skill}
                </span>
              ))}

            </div>

          </div>

          <div className="mt-10 bg-gray-800 rounded-xl p-6">

            <h2 className="text-xl font-semibold">
              Recruiter
            </h2>

            <p className="mt-3">
              {job.recruiter?.name}
            </p>

            <p className="text-gray-400">
              {job.recruiter?.email}
            </p>

          </div>

          <button
            onClick={handleApply}
            disabled={job.isApplied || applying}
            className={`mt-10 w-full py-3 rounded-xl text-lg font-semibold ${
              job.isApplied
                ? "bg-green-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {applying
              ? "Applying..."
              : job.isApplied
              ? "✓ Applied"
              : "Apply Now"}
          </button>

        </div>

      </div>
    </PageContainer>
  );
}