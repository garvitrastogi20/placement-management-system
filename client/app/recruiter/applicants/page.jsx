"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

import PageContainer from "@/components/ui/PageContainer";
import HeroBanner from "@/components/ui/HeroBanner";
import EmptyState from "@/components/ui/EmptyState";

import ApplicantStats from "@/components/recruiter/ApplicantStats";
import ApplicantFilters from "@/components/recruiter/ApplicantFilters";
import ApplicantCard from "@/components/recruiter/ApplicantCard";

import {
  getApplicants,
  updateApplicantStatus,
} from "@/services/applicantService";

import toast from "react-hot-toast";

export default function ApplicantsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // ==========================
  // Fetch Applicants
  // ==========================

  const fetchApplicants = useCallback(async (targetPage = page) => {
    try {
      setLoading(true);

      const response = await getApplicants({ page: targetPage, limit: 10 });
      const applicantList = Array.isArray(response)
        ? response
        : response?.data || [];

      setApplications(applicantList);

      if (response?.pagination) {
        setPagination(response.pagination);
      } else {
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalRecords: applicantList.length,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false,
        });
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchApplicants(page);
  }, [page, fetchApplicants]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  // ==========================
  // Statistics
  // ==========================

  const stats = useMemo(
    () => ({
      totalApplicants: pagination.totalRecords || applications.length,

      applied: applications.filter((a) => a.status === "Applied").length,

      shortlisted: applications.filter((a) => a.status === "Shortlisted")
        .length,

      selected: applications.filter((a) => a.status === "Selected").length,
    }),
    [applications, pagination.totalRecords],
  );

  // ==========================
  // Search + Filter
  // ==========================

  const filteredApplicants = useMemo(() => {
    const query = search.toLowerCase();

    return applications.filter((app) => {
      const studentName = (app.student?.name || "Unknown Student").toLowerCase();
      const studentEmail = (app.student?.email || "").toLowerCase();

      const matchesSearch =
        studentName.includes(query) || studentEmail.includes(query);

      const matchesStatus = status === "All" || app.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, status]);

  // ==========================
  // Update Status
  // ==========================

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await updateApplicantStatus(applicationId, newStatus);

      toast.success("Status Updated");

      fetchApplicants(page);
    } catch (error) {
      toast.error(error);
    }
  };

  // ==========================
  // Loading UI
  // ==========================

  if (loading && applications.length === 0) {
    return (
      <PageContainer>
        <HeroBanner
          title="Manage Applicants"
          subtitle="Loading applicants..."
        />

        <div className="mt-10 text-center text-gray-400">
          Loading Applicants...
        </div>
      </PageContainer>
    );
  }

  // ==========================
  // UI
  // ==========================

  return (
    <PageContainer>
      <HeroBanner
        title="Manage Applicants"
        subtitle="Review applications, shortlist candidates and manage your hiring pipeline."
      />

      <div className="mt-10 space-y-10">
        <ApplicantStats stats={stats} />

        <ApplicantFilters
          search={search}
          setSearch={handleSearchChange}
          status={status}
          setStatus={handleStatusChange}
        />

        {filteredApplicants.length === 0 ? (
          <EmptyState
            title="No Applicants Found"
            subtitle="Students who apply to your jobs will appear here."
          />
        ) : (
          <>
            <div className="space-y-6">
              {filteredApplicants.map((application) => (
                <ApplicantCard
                  key={application._id}
                  application={application}
                  updateStatus={updateStatus}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-white/10">
                <p className="text-sm text-slate-600 dark:text-gray-400">
                  Showing page <span className="font-semibold text-slate-900 dark:text-white">{pagination.currentPage}</span> of{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">{pagination.totalPages}</span> ({pagination.totalRecords} total applicants)
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination.hasPrevPage || loading}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Previous
                  </button>

                  <span className="text-sm font-medium text-slate-600 dark:text-gray-300">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.hasNextPage || loading}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
