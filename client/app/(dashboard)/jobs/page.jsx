"use client";

import { useEffect, useState } from "react";

import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import api from "@/services/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await api.get("/jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            company: companyFilter || undefined,
            location: locationFilter || undefined,
            skill: skillFilter || undefined,
          },
        });

        setJobs(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [companyFilter, locationFilter, skillFilter]);

  return (
    <PageContainer>
      <Navbar />

      <div className="mt-8">
        <h1 className="mb-8 text-4xl font-bold text-white">Available Jobs</h1>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search title/company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder-gray-400"
          />

          <input
            type="text"
            placeholder="Filter Company"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 p-3 text-white"
          />

          <input
            type="text"
            placeholder="Filter Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 p-3 text-white"
          />

          <input
            type="text"
            placeholder="Filter Skill"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 p-3 text-white"
          />
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-lg text-gray-400">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <h2 className="text-2xl font-semibold text-white">
              No Jobs Available
            </h2>

            <p className="mt-3 text-gray-400">
              Check back later for new opportunities.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs
              .filter((job) => {
                const query = search.toLowerCase();

                return (
                  job.title.toLowerCase().includes(query) ||
                  job.company.toLowerCase().includes(query)
                );
              })
              .map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  isApplied={job.isApplied}
                  onApplied={(jobId) => {
                    setJobs((previousJobs) =>
                      previousJobs.map((currentJob) =>
                        currentJob._id === jobId
                          ? {
                              ...currentJob,
                              isApplied: true,
                            }
                          : currentJob,
                      ),
                    );
                  }}
                />
              ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
