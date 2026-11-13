"use client";

import { useEffect, useMemo, useState } from "react";

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

  // ==========================
  // Fetch Applicants
  // ==========================

  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const data = await getApplicants();

      setApplications(data);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // ==========================
  // Statistics
  // ==========================

  const stats = useMemo(
    () => ({
      totalApplicants: applications.length,

      applied: applications.filter((a) => a.status === "Applied").length,

      shortlisted: applications.filter((a) => a.status === "Shortlisted")
        .length,

      selected: applications.filter((a) => a.status === "Selected").length,
    }),
    [applications],
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

      fetchApplicants();
    } catch (error) {
      toast.error(error);
    }
  };

  // ==========================
  // Loading UI
  // ==========================

  if (loading) {
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
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />

        {filteredApplicants.length === 0 ? (
          <EmptyState
            title="No Applicants Found"
            subtitle="Students who apply to your jobs will appear here."
          />
        ) : (
          <div className="space-y-6">
            {filteredApplicants.map((application) => (
              <ApplicantCard
                key={application._id}
                application={application}
                updateStatus={updateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
