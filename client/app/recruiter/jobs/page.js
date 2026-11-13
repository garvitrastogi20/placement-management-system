"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/services/api";

import HeroBanner from "@/components/ui/HeroBanner";
import GlassCard from "@/components/ui/GlassCard";
import PageContainer from "@/components/ui/PageContainer";
import EmptyState from "@/components/ui/EmptyState";

import ManageJobCard from "@/components/recruiter/ManageJobCard";
import DeleteJobModal from "@/components/recruiter/DeleteJobModal";

import { deleteJob } from "@/services/recruiterService";

export default function RecruiterJobsPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedJob, setSelectedJob] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await api.get("/recruiter/jobs");

      setJobs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await deleteJob(selectedJob._id);

      setJobs((prev) => prev.filter((job) => job._id !== selectedJob._id));

      setShowDeleteModal(false);

      setSelectedJob(null);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = search.toLowerCase();

      return (
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
      );
    });
  }, [jobs, search]);

  return (
    <PageContainer>
      <div className="space-y-10">
        <HeroBanner
          title="Manage Your Hiring Pipeline"
          subtitle="Create, edit and monitor every opportunity from one intelligent recruitment dashboard."
          buttonText="+ Create Job"
          onClick={() => router.push("/recruiter/create-job")}
        />

        <GlassCard>
          <input
            type="text"
            placeholder="Search jobs by title, company or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
                            w-full
                            bg-transparent
                            text-lg
                            text-white
                            outline-none
                            placeholder:text-gray-500
                        "
          />
        </GlassCard>

        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading Jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            title="No Jobs Found"
            subtitle="Create your first opportunity and start hiring."
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {filteredJobs.map((job) => (
              <ManageJobCard
                key={job._id}
                job={job}
                onApplicants={(job) =>
                  router.push(`/recruiter/jobs/${job._id}/applicants`)
                }
                onEdit={(job) => router.push(`/recruiter/jobs/${job._id}/edit`)}
                onDelete={(job) => {
                  setSelectedJob(job);

                  setShowDeleteModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteJobModal
        isOpen={showDeleteModal}
        loading={deleteLoading}
        jobTitle={selectedJob?.title}
        onClose={() => {
          setShowDeleteModal(false);

          setSelectedJob(null);
        }}
        onConfirm={handleDelete}
      />
    </PageContainer>
  );
}
