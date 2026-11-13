"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  getApplicants,
  updateApplicationStatus,
} from "@/services/recruiterService";

export default function ApplicantsPage() {
  const params = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getApplicants(params.id);
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Failed to load applicants",
      );
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchApplicants();
    }
  }, [params.id, fetchApplicants]);

  const updateStatus = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status);
      toast.success(`Student ${status}`);
      fetchApplicants();
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Status update failed",
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-blue-900 text-blue-300";

      case "Selected":
        return "bg-green-900 text-green-300";

      case "Rejected":
        return "bg-red-900 text-red-300";

      default:
        return "bg-yellow-900 text-yellow-300";
    }
  };

  return (
    <div className="min-h-screen text-white">
      <h1 className="mb-8 text-4xl font-bold">Applicants</h1>

      {loading ? (
        <p className="text-gray-400">Loading applicants...</p>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center text-gray-400">
          No applicants found for this job yet.
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="rounded-2xl border border-gray-800 bg-gray-900 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {app.student?.name || "Unknown Student"}
                  </h2>

                  <p className="mt-2 text-gray-400">
                    {app.student?.email || "No email provided"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 ${getStatusColor(app.status)}`}
                >
                  {app.status}
                </span>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => updateStatus(app._id, "Shortlisted")}
                  className="rounded-lg bg-blue-600 px-4 py-2"
                >
                  Shortlist
                </button>

                <button
                  onClick={() => updateStatus(app._id, "Rejected")}
                  className="rounded-lg bg-red-600 px-4 py-2"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
