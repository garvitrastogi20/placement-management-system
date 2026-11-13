"use client";

import { useEffect, useState } from "react";
import { FaFileAlt, FaArrowRight, FaChartLine } from "react-icons/fa";
import { useRouter } from "next/navigation";

import api from "@/services/api";
import GlassCard from "@/components/ui/GlassCard";

export default function ResumeAnalysisCard() {
  const router = useRouter();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchLatestAnalysis = async () => {
      try {
        const response = await api.get("/ai/resume-analysis/history");

        const history = Array.isArray(response.data?.history)
          ? response.data.history
          : [];

        if (!cancelled) {
          setReport(history[0] || null);
        }
      } catch (err) {
        console.error("LATEST RESUME ANALYSIS ERROR:", err);

        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              "Unable to load your latest resume analysis.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchLatestAnalysis();

    return () => {
      cancelled = true;
    };
  }, []);

  const score = Number(report?.matchScore ?? 0);
  const safeScore = Math.max(0, Math.min(100, score));

  return (
    <GlassCard>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#C97B3C]/20 bg-[#C97B3C]/10 text-[#F4C27A]">
            <FaChartLine />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#C97B3C]">
              AI CAREER INSIGHTS
            </p>

            <h2 className="text-2xl font-bold text-white">
              Latest Resume Analysis
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/resume-analyzer")}
          className="inline-flex items-center gap-2 rounded-xl border border-[#C97B3C]/30 px-4 py-2 text-sm font-semibold text-[#F4C27A] transition hover:bg-[#C97B3C]/10"
        >
          Resume Analyzer
          <FaArrowRight />
        </button>
      </div>

      {loading ? (
        <div className="mt-6 animate-pulse rounded-2xl bg-white/[0.03] p-6">
          <div className="h-5 w-40 rounded bg-white/10" />
          <div className="mt-4 h-4 w-64 rounded bg-white/10" />
        </div>
      ) : error ? (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : !report ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C97B3C]/10 text-2xl text-[#F4C27A]">
            <FaFileAlt />
          </div>

          <h3 className="mt-4 font-semibold text-white">
            No resume analysis yet
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Analyze your resume against a job to see your match score and skill
            gaps here.
          </p>

          <button
            type="button"
            onClick={() => router.push("/resume-analyzer")}
            className="mt-5 rounded-xl bg-[#C97B3C] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#F4C27A]"
          >
            Analyze My Resume
          </button>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-400">Latest match estimate</p>

              <h3 className="mt-2 truncate text-xl font-bold text-white">
                {report.jobTitle || "Resume Analysis"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {report.company || "Company not specified"}
              </p>

              <p className="mt-3 text-xs text-gray-500">
                {report.createdAt
                  ? new Date(report.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Date unavailable"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-5">
              <div className="text-right">
                <p className="text-3xl font-bold text-[#F4C27A]">
                  {safeScore}
                  <span className="text-sm text-gray-500">/100</span>
                </p>

                <p className="mt-1 text-xs text-gray-500">Match score</p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/resume-analyzer")}
                className="rounded-xl border border-[#C97B3C]/30 px-4 py-2 text-sm font-semibold text-[#F4C27A] transition hover:bg-[#C97B3C]/10"
              >
                View Report
              </button>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#C97B3C] transition-all"
              style={{ width: `${safeScore}%` }}
            />
          </div>
        </div>
      )}
    </GlassCard>
  );
}
