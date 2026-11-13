"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getApplicants,
  updateApplicationStatus,
} from "@/services/recruiterService";

import ApplicantsTable from "@/components/recruiter/ApplicantsTable";

export default function ApplicantsPage() {
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // =====================================
  // Fetch Applicants
  // =====================================
  const fetchApplicants = useCallback(
    async (showLoading = true) => {
      if (!id) return;

      if (showLoading) {
        setLoading(true);
      }

      setError("");

      try {
        const data = await getApplicants(id);

        if (!Array.isArray(data)) {
          throw new Error("Unexpected response from applicants API.");
        }

        setApplicants(data);
      } catch (err) {
        console.error("FETCH APPLICANTS ERROR:", err);

        setError(
          typeof err === "string"
            ? err
            : err.message || "Unable to fetch applicants.",
        );
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [id],
  );

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  // =====================================
  // Update Applicant Status
  // =====================================
  const updateStatus = async (applicationId, status) => {
    setUpdating(true);
    setError("");
    setNotice("");

    try {
      await updateApplicationStatus(applicationId, status);

      setNotice("Applicant status updated successfully.");

      // Refresh the applicants list
      await fetchApplicants(false);
    } catch (err) {
      console.error("UPDATE APPLICANT STATUS ERROR:", err);

      setError(
        typeof err === "string"
          ? err
          : err.message || "Unable to update applicant status.",
      );
    } finally {
      setUpdating(false);
    }
  };

  // =====================================
  // Loading
  // =====================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-10 text-white">
        <p className="text-lg">Loading applicants...</p>
      </div>
    );
  }

  // =====================================
  // Page
  // =====================================
  return (
    <div className="min-h-screen space-y-8 bg-slate-950 p-6 text-white md:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Job Applicants</h1>

          <p className="mt-2 text-gray-400">
            Review applications, shortlist candidates, and manage the hiring
            process.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-6 py-4">
          <p className="text-sm text-blue-300">Total Applicants</p>

          <h2 className="mt-1 text-3xl font-bold">{applicants.length}</h2>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => fetchApplicants()}
            className="mt-3 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium hover:bg-red-500/30"
          >
            Retry
          </button>
        </div>
      )}

      {/* Success message */}
      {notice && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
          {notice}
        </div>
      )}

      {/* Applicants Table */}
      <div className={updating ? "opacity-70" : ""}>
        <ApplicantsTable
          applicants={applicants}
          updateStatus={updateStatus}
          updating={updating}
        />
      </div>
    </div>
  );
}
