"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

function getErrorMessage(error) {
  const serverData = error?.response?.data;

  if (typeof serverData === "string" && serverData.trim()) {
    return serverData;
  }

  return (
    serverData?.message ||
    serverData?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function getJobId(job) {
  return job?._id || job?.id || "";
}

function getJobList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.jobs)) return data.jobs;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.jobs)) return data.data.jobs;
  return [];
}

function getItemText(item) {
  if (typeof item === "string") return item;

  if (item && typeof item === "object") {
    return (
      item.name ||
      item.title ||
      item.task ||
      item.detail ||
      item.reason ||
      JSON.stringify(item)
    );
  }

  return String(item ?? "");
}

function getSkillDetails(item) {
  if (typeof item === "string") {
    return { title: item, detail: "" };
  }

  return {
    title: item?.name || item?.title || "Skill",
    detail:
      item?.evidence || item?.reason || item?.importance || item?.detail || "",
  };
}

function getDetailedError(error) {
  let serializedError = {};

  try {
    serializedError = typeof error?.toJSON === "function" ? error.toJSON() : {};
  } catch {
    serializedError = {};
  }

  return {
    name: error?.name,
    message: error?.message,
    code: error?.code,
    status: error?.response?.status,
    response: error?.response?.data,
    responseHeaders: error?.response?.headers,
    requestUrl: error?.config?.url,
    requestMethod: error?.config?.method,
    baseURL: error?.config?.baseURL,
    serializedError,
  };
}

function getAnalysisPayload(data) {
  if (data?.analysis && typeof data.analysis === "object") {
    return data.analysis;
  }

  return null;
}

function SectionList({ title, items, emptyText = "Nothing listed." }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#141417] p-5">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>

      {Array.isArray(items) && items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="flex gap-3 text-sm leading-6 text-gray-300"
            >
              <span className="text-orange-400">•</span>
              <span>{getItemText(item)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">{emptyText}</p>
      )}
    </section>
  );
}

function SkillList({ title, items, color, emptyText }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#141417] p-5">
      <h3 className={`mb-4 text-lg font-semibold ${color}`}>{title}</h3>

      {Array.isArray(items) && items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => {
            const skill = getSkillDetails(item);

            return (
              <li
                key={`${skill.title}-${index}`}
                className="rounded-xl bg-white/5 p-3"
              >
                <p className="font-medium">{skill.title}</p>

                {skill.detail && (
                  <p className="mt-1 text-sm text-gray-400">{skill.detail}</p>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">{emptyText}</p>
      )}
    </section>
  );
}

function RecommendationList({ title, items }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#141417] p-5">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>

      {Array.isArray(items) && items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => {
            const detail =
              typeof item === "string"
                ? item
                : item?.detail || item?.task || item?.description || "";

            const heading =
              typeof item === "string"
                ? ""
                : item?.title || item?.priority || item?.name || "";

            return (
              <li
                key={`${title}-${index}`}
                className="rounded-xl bg-white/5 p-3"
              >
                {heading && <p className="font-medium">{heading}</p>}

                {detail && (
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    {detail}
                  </p>
                )}

                {!heading && !detail && (
                  <p className="text-sm text-gray-300">{getItemText(item)}</p>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No recommendations listed.</p>
      )}
    </section>
  );
}

export default function ResumeAnalyzerPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [historyError, setHistoryError] = useState("");

  const loadJobs = useCallback(async () => {
    setLoadingJobs(true);

    try {
      const response = await api.get("/jobs");
      const list = getJobList(response.data);

      setJobs(list);

      if (list.length > 0) {
        setSelectedJobId((current) => {
          if (current && list.some((job) => getJobId(job) === current)) {
            return current;
          }

          return getJobId(list[0]);
        });
      }
    } catch (err) {
      console.error("LOAD JOBS ERROR:", getDetailedError(err));
      setError(`Unable to load jobs: ${getErrorMessage(err)}`);
    } finally {
      setLoadingJobs(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    setHistoryError("");

    try {
      const response = await api.get("/ai/resume-analysis/history");
      const data = response.data;

      const reports = Array.isArray(data?.history)
        ? data.history
        : Array.isArray(data?.reports)
          ? data.reports
          : [];

      setHistory(reports);
    } catch (err) {
      console.error("LOAD RESUME HISTORY ERROR:", getDetailedError(err));
      setHistoryError(getErrorMessage(err));
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
    loadHistory();
  }, [loadJobs, loadHistory]);

  const handleAnalyze = async (event) => {
    event.preventDefault();

    if (!selectedJobId) {
      setError("Please select a job first.");
      return;
    }

    setAnalyzing(true);
    setError("");
    setNotice("");
    setAnalysis(null);

    try {
      const response = await api.post("/ai/resume-analysis", {
        jobId: selectedJobId,
      });

      const data = response.data;
      const result = getAnalysisPayload(data);

      if (!data?.success || !result) {
        throw new Error(data?.message || "The server returned no analysis.");
      }

      setAnalysis({
        ...result,
        job: data.job || result.job,
        resume: data.resume || result.resume,
        analysisId: data.analysisId || result.analysisId,
      });

      if (data.saved === false) {
        setNotice(
          data.saveWarning ||
            "Analysis generated, but the report could not be saved.",
        );
      } else {
        setNotice("Analysis completed successfully and saved.");
        await loadHistory();
      }
    } catch (err) {
      const details = getDetailedError(err);

      console.error("RESUME ANALYSIS REQUEST FAILED:", details);
      console.error("SERVER RESPONSE:", details.response);
      console.error("HTTP STATUS:", details.status);
      console.error("ERROR CODE:", details.code);
      console.error("REQUEST URL:", details.baseURL, details.requestUrl);

      setError(
        getErrorMessage(err) +
          (details.status
            ? ` (HTTP ${details.status})`
            : details.code === "ERR_NETWORK"
              ? " (Network error: check whether the backend is running and reachable.)"
              : ""),
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleOpenReport = async (analysisId) => {
    if (!analysisId) return;

    setError("");
    setNotice("");

    try {
      const response = await api.get(
        `/ai/resume-analysis/history/${analysisId}`,
      );

      const report = response.data?.report;

      if (!report) {
        throw new Error("Saved report was not returned by the server.");
      }

      setAnalysis({
        ...report,
        job: {
          id: report.job,
          title: report.jobTitle,
          company: report.company,
        },
        resume: {
          originalName: report.resumeName,
        },
        analysisId: report._id,
      });

      setNotice("Saved report loaded successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("OPEN SAVED REPORT ERROR:", getDetailedError(err));
      setError(getErrorMessage(err));
    }
  };

  const handleViewJobAndApply = () => {
    const jobId = analysis?.job?.id || analysis?.job?._id || selectedJobId;

    if (!jobId) {
      setError("Unable to find the job associated with this analysis.");
      return;
    }

    router.push(`/jobs/${jobId}`);
  };

  const score = Number(analysis?.matchScore ?? 0);
  const safeScore = Math.max(0, Math.min(100, score));

  return (
    <div className="w-full px-4 py-6 sm:px-8 text-slate-900 dark:text-white transition-colors duration-200">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-orange-400">
            PlaceMentor AI
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            AI Resume Analyzer
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-gray-400 sm:text-base">
            Compare your uploaded PDF resume with a job description, identify
            skill gaps, and get actionable recommendations.
          </p>
        </header>

        {/* Resume analysis form */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-[#141417] p-5 sm:p-7">
          <h2 className="mb-5 text-xl font-semibold">Analyze your resume</h2>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <label
              htmlFor="job-select"
              className="block text-sm font-medium text-gray-300"
            >
              Select a job
            </label>

            <select
              id="job-select"
              value={selectedJobId}
              onChange={(event) => setSelectedJobId(event.target.value)}
              disabled={loadingJobs || analyzing || jobs.length === 0}
              className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-4 py-3 text-white outline-none focus:border-orange-400 disabled:opacity-50"
            >
              <option value="">
                {loadingJobs
                  ? "Loading jobs..."
                  : jobs.length === 0
                    ? "No jobs available"
                    : "Choose a job"}
              </option>

              {jobs.map((job) => {
                const id = getJobId(job);

                return (
                  <option key={id} value={id}>
                    {job.title || "Untitled job"} —{" "}
                    {job.company || "Company not specified"}
                  </option>
                );
              })}
            </select>

            <button
              type="submit"
              disabled={loadingJobs || analyzing || !selectedJobId}
              className="w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {analyzing ? "Analyzing resume..." : "Analyze Resume"}
            </button>
          </form>

          <p className="mt-4 text-xs leading-5 text-gray-500">
            Upload your PDF resume in your student profile before running an
            analysis. Reports are estimates and are not guaranteed ATS scores or
            hiring predictions.
          </p>
        </section>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 whitespace-pre-wrap break-words rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            <p className="font-semibold">Request failed</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Success or warning message */}
        {notice && (
          <div
            role="status"
            className={`mb-6 rounded-xl border p-4 text-sm ${
              notice.toLowerCase().includes("could not") ||
              notice.toLowerCase().includes("could not be saved") ||
              notice.toLowerCase().includes("couldn't")
                ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-200"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {notice}
          </div>
        )}

        {/* Current analysis */}
        {analysis && (
          <section className="mb-10 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#141417] p-5 sm:p-7">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-400">Resume match estimate</p>

                  <h2 className="mt-2 text-2xl font-bold">
                    {analysis.job?.title || "Resume Analysis"}
                  </h2>

                  <p className="mt-1 text-gray-400">
                    {analysis.job?.company || "Company not specified"}
                  </p>

                  <p className="mt-3 text-xs text-gray-500">
                    Resume: {analysis.resume?.originalName || "resume.pdf"}
                  </p>
                </div>

                <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full border-4 border-orange-400">
                  <span className="text-4xl font-bold text-orange-400">
                    {safeScore}
                  </span>
                  <span className="text-sm text-gray-400">out of 100</span>
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-orange-400 transition-all"
                  style={{ width: `${safeScore}%` }}
                />
              </div>

              <h3 className="mt-6 font-semibold">Overall assessment</h3>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-300">
                {analysis.summary || "No summary provided."}
              </p>

              {analysis.scoreExplanation && (
                <>
                  <h3 className="mt-5 font-semibold">Why this score?</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-300">
                    {analysis.scoreExplanation}
                  </p>
                </>
              )}

              {/* NEW: View job and apply */}
              <button
                type="button"
                onClick={handleViewJobAndApply}
                className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-black transition hover:bg-orange-400 sm:w-auto"
              >
                View Job & Apply
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <SkillList
                title="Matched skills"
                items={analysis.matchedSkills}
                color="text-emerald-300"
                emptyText="No matched skills listed."
              />

              <SkillList
                title="Missing skills"
                items={analysis.missingSkills}
                color="text-red-300"
                emptyText="No missing skills listed."
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <SectionList title="Strengths" items={analysis.strengths} />

              <SectionList title="Weaknesses" items={analysis.weaknesses} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <RecommendationList
                title="Improvement suggestions"
                items={analysis.suggestions}
              />

              <RecommendationList
                title="Action plan"
                items={analysis.actionPlan}
              />
            </div>
          </section>
        )}

        {/* Saved analysis history */}
        <section className="rounded-2xl border border-white/10 bg-[#141417] p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Previous analyses</h2>
              <p className="mt-1 text-sm text-gray-400">
                Your most recent saved reports
              </p>
            </div>

            <button
              type="button"
              onClick={loadHistory}
              disabled={loadingHistory}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
            >
              {loadingHistory ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {historyError && (
            <p className="mb-4 break-words text-sm text-red-300">
              Could not load history: {historyError}
            </p>
          )}

          {loadingHistory ? (
            <p className="text-sm text-gray-400">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-gray-500">
              No saved analyses yet. Generate your first report above.
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 rounded-xl border border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold">
                      {item.jobTitle || "Untitled job"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      {item.company || "Company not specified"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-orange-400">
                      {item.matchScore ?? 0}/100
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenReport(item._id)}
                      className="rounded-lg border border-orange-400/50 px-3 py-2 text-sm text-orange-300 hover:bg-orange-400/10"
                    >
                      View report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
