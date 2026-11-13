"use client";

import { useEffect, useState } from "react";

import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import api from "@/services/api";

export default function InterviewPreparationPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");

  const [questions, setQuestions] = useState(null);
  const [activeTab, setActiveTab] = useState("technical");

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // Interview history states
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [viewingSessionId, setViewingSessionId] = useState("");
  const [historyError, setHistoryError] = useState("");

  // Fetch available jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs");
        setJobs(response.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load available jobs.",
        );
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch saved interview preparation history
  const fetchHistory = async () => {
    try {
      setHistoryError("");

      const response = await api.get("/ai/interview-preparation/history");

      setHistory(response.data?.data || []);
    } catch (err) {
      setHistoryError(
        err.response?.data?.message ||
          "Unable to load interview preparation history.",
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Generate interview questions
  const handleGenerate = async () => {
    if (!selectedJobId) {
      setError("Please select a job first.");
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setQuestions(null);
      setExpandedQuestions({});
      setViewingSessionId("");

      const response = await api.post("/ai/interview-preparation", {
        jobId: selectedJobId,
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to generate questions.",
        );
      }

      setQuestions(response.data.data);
      setActiveTab("technical");

      // Refresh saved sessions after successful generation
      await fetchHistory();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong while generating questions.",
      );
    } finally {
      setGenerating(false);
    }
  };

  // Open a previously saved interview preparation session
  const handleViewSession = async (sessionId) => {
    try {
      setViewingSessionId(sessionId);
      setError("");
      setExpandedQuestions({});

      const response = await api.get(
        `/ai/interview-preparation/history/${sessionId}`,
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to load saved session.",
        );
      }

      setQuestions(response.data.data);
      setActiveTab("technical");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to open this interview session.",
      );
    } finally {
      setViewingSessionId("");
    }
  };

  const questionSections = {
    technical: {
      title: "Technical Questions",
      description: "Prepare for technical concepts and coding interviews.",
      items: questions?.technicalQuestions || [],
    },
    project: {
      title: "Project Questions",
      description: "Practice explaining your projects and technical decisions.",
      items: questions?.projectQuestions || [],
    },
    hr: {
      title: "HR Questions",
      description: "Prepare for behavioral and HR interview rounds.",
      items: questions?.hrQuestions || [],
    },
  };

  const currentSection = questionSections[activeTab];

  const toggleQuestion = (index) => {
    setExpandedQuestions((previous) => ({
      ...previous,
      [index]: !previous[index],
    }));
  };

  return (
    <PageContainer>
      <Navbar />

      <div className="mx-auto mt-8 max-w-5xl space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            AI Career Preparation
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Interview Preparation
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            Generate personalized interview questions using your resume and the
            job you&apos;re targeting.
          </p>
        </div>

        {/* Job Selection */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <label
            htmlFor="job"
            className="mb-3 block text-sm font-medium text-gray-300"
          >
            Select a job
          </label>

          {loadingJobs ? (
            <p className="text-gray-400">Loading available jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-400">No jobs are currently available.</p>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row">
              <select
                id="job"
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  setQuestions(null);
                  setViewingSessionId("");
                  setError("");
                }}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#111827] p-3 text-white outline-none focus:border-blue-500"
              >
                <option value="">Choose a job...</option>

                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title} — {job.company}
                  </option>
                ))}
              </select>

              <button
                onClick={handleGenerate}
                disabled={!selectedJobId || generating}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating
                  ? "Generating Questions..."
                  : "Generate Interview Questions"}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Previous Interview Sessions */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Previous Interview Sessions
            </h2>

            <p className="mt-2 text-gray-400">
              Reopen your previously generated interview questions.
            </p>
          </div>

          {loadingHistory ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-400">
              Loading interview history...
            </div>
          ) : historyError ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {historyError}
              <button
                onClick={fetchHistory}
                className="ml-3 font-semibold underline"
              >
                Retry
              </button>
            </div>
          ) : history.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-400">
              No saved interview sessions yet. Generate questions for a job to
              create your first session.
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((session) => (
                <div
                  key={session._id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-semibold text-white">
                      {session.jobTitle}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      {session.company}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      {session.createdAt
                        ? new Date(session.createdAt).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleViewSession(session._id)}
                    disabled={viewingSessionId === session._id}
                    className="shrink-0 rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {viewingSessionId === session._id
                      ? "Opening Session..."
                      : "View Session"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generated or Saved Questions */}
        {questions && (
          <div className="space-y-6">
            {/* Job Info */}
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
              <p className="text-sm text-blue-300">
                {viewingSessionId
                  ? "Interview preparation for"
                  : "Interview preparation for"}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                {questions.jobTitle}
              </h2>

              <p className="mt-1 text-gray-300">{questions.company}</p>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-300">
                <span>
                  {questions.technicalQuestions?.length || 0} Technical
                </span>
                <span>•</span>
                <span>{questions.projectQuestions?.length || 0} Project</span>
                <span>•</span>
                <span>{questions.hrQuestions?.length || 0} HR</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
              {Object.entries(questionSections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    activeTab === key
                      ? "bg-blue-600 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>

            {/* Questions */}
            <div>
              <h2 className="text-2xl font-bold text-white">
                {currentSection.title}
              </h2>

              <p className="mt-2 text-gray-400">{currentSection.description}</p>

              <div className="mt-6 space-y-4">
                {currentSection.items.map((item, index) => {
                  const questionKey = `${activeTab}-${index}`;
                  const isExpanded = expandedQuestions[questionKey];

                  return (
                    <div
                      key={questionKey}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                    >
                      <button
                        onClick={() => toggleQuestion(questionKey)}
                        className="flex w-full items-start justify-between gap-4 p-5 text-left"
                      >
                        <div className="flex gap-4">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-semibold text-blue-400">
                            {index + 1}
                          </span>

                          <div>
                            <p className="font-medium leading-7 text-white">
                              {item.question}
                            </p>

                            {item.topic && (
                              <span className="mt-2 inline-block rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
                                {item.topic}
                              </span>
                            )}

                            {item.difficulty && (
                              <span className="ml-2 mt-2 inline-block rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
                                {item.difficulty}
                              </span>
                            )}

                            {item.project && (
                              <p className="mt-2 text-sm text-blue-300">
                                Project: {item.project}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="shrink-0 text-gray-400">
                          {isExpanded ? "−" : "+"}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-white/10 bg-black/10 px-5 py-4">
                          <p className="text-sm font-semibold text-blue-300">
                            Hint
                          </p>

                          <p className="mt-2 leading-6 text-gray-300">
                            {item.hint ||
                              "Try answering this question yourself first."}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {currentSection.items.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-400">
                    No questions available in this section.
                  </div>
                )}
              </div>
            </div>

            {/* Generate another set */}
            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={generating || !selectedJobId}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate Again"}
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
