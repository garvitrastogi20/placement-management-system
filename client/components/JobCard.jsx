"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function JobCard({ job, isApplied, onApplied }) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(isApplied);
  useEffect(() => {
    setApplied(isApplied);
  }, [isApplied]);

  const handleApply = async (e) => {
    e.stopPropagation();
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.post(
        `/jobs/${job._id}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message);
      setApplied(true);

      if (onApplied) {
        onApplied(job._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Application Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden">
      <Link
        href={`/jobs/${job._id}`}
        className="block p-6 hover:bg-gray-800/40 transition"
      >
        <h2 className="text-2xl font-bold text-white">{job.title}</h2>

        <p className="mt-2 text-gray-400">{job.company}</p>

        <p className="mt-2 text-gray-300">📍 {job.location}</p>

        <p className="mt-2 font-semibold text-green-400">
          ₹ {job.package?.toLocaleString()}
        </p>
      </Link>

      <div className="px-6 pb-6">
        <button
          onClick={handleApply}
          disabled={loading || applied}
          className={`w-full py-2 rounded-lg text-white transition ${
            applied
              ? "bg-green-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Applying..." : applied ? "✓ Applied" : "Apply Now"}
        </button>
      </div>
    </div>
  );
}
