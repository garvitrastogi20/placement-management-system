"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getApplicants,
  updateApplicationStatus,
} from "@/services/recruiterService";

import ApplicantsTable from "@/components/recruiter/ApplicantsTable";

export default function ApplicantsPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const data = await getApplicants(id);

      console.log("Applicants API Response:", data);

      setApplicants(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const updateStatus = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status);

      await fetchApplicants();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-10 text-white">Loading Applicants...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Job Applicants</h1>

          <p className="mt-2 text-gray-400">
            Review applications, shortlist candidates, and manage the hiring
            process.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-6 py-4">
          <p className="text-sm text-blue-300">Total Applicants</p>

          <h2 className="mt-1 text-3xl font-bold text-white">
            {applicants.length}
          </h2>
        </div>
      </div>

      <ApplicantsTable applicants={applicants} updateStatus={updateStatus} />
    </div>
  );
}
