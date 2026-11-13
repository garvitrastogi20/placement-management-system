"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import api from "@/services/api";

export default function MockInterviewPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");

  const [interview, setInterview] = useState(null);
  const [answer, setAnswer] = useState("");

  const [evaluation, setEvaluation] = useState(null);
  const [overallReport, setOverallReport] = useState(null);

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [startingInterview, setStartingInterview] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const [error, setError] = useState("");

  // Load available jobs.
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        setError("");

        const response = await api.get("/jobs");

        console.log("FULL JOBS API RESPONSE:", response.data);

        const data = response.data;

        // Handle common API response formats.
        const jobList = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.jobs)
              ? data.jobs
              : Array.isArray(data?.data?.jobs)
                ? data.data.jobs
                : Array.isArray(data?.data?.data)
                  ? data.data.data
                  : [];

        console.log("EXTRACTED JOB LIST:", jobList);

        setJobs(jobList);

        if (jobList.length === 0) {
          setError(
            "No jobs were found. Please check whether jobs are available.",
          );
        }
      } catch (err) {
        console.error("Fetch jobs error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load jobs. Please try again.",
        );
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  // Start the interview.
  const handleStartInterview = async () => {
    if (!selectedJob) {
      setError("Please select a job first.");
      return;
    }

    try {
      setError("");
      setStartingInterview(true);

      setEvaluation(null);
      setOverallReport(null);
      setAnswer("");

      const response = await api.post("/ai/mock-interview/start", {
        jobId: selectedJob,
      });

      setInterview(response.data.data);
    } catch (err) {
      console.error("Start interview error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to start the interview. Please try again.",
      );
    } finally {
      setStartingInterview(false);
    }
  };

  // Submit the answer to the current question.
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError("Please enter your answer before submitting.");
      return;
    }

    if (!interview?.interviewId) {
      setError("Interview session not found.");
      return;
    }

    try {
      setError("");
      setSubmittingAnswer(true);

      const response = await api.post(
        `/ai/mock-interview/${interview.interviewId}/answer`,
        {
          answer: answer.trim(),
        },
      );

      const result = response.data.data;

      setEvaluation({
        score: result.score,
        feedback: result.feedback,
        strengths: result.strengths || [],
        improvements: result.improvements || [],
      });

      setAnswer("");

      if (result.completed) {
        setOverallReport(result.overallReport);

        setInterview((previous) => ({
          ...previous,
          completed: true,
          overallScore: result.overallScore,
        }));
      } else {
        setInterview((previous) => ({
          ...previous,
          currentQuestionIndex: result.currentQuestionIndex,
          question: result.nextQuestion,
        }));
      }
    } catch (err) {
      console.error("Submit answer error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to evaluate your answer. Please try again.",
      );
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Reset the page to start another interview.
  const handleNewInterview = () => {
    setInterview(null);
    setEvaluation(null);
    setOverallReport(null);
    setAnswer("");
    setSelectedJob("");
    setError("");
  };

  const currentQuestionNumber = (interview?.currentQuestionIndex || 0) + 1;

  const totalQuestions = interview?.totalQuestions || 8;

  return (
    <PageContainer>
      <div className="mx-auto max-w-4xl py-2">
        {/* Page Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-[#C97B3C]">
            AI INTERVIEW SIMULATOR
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            AI Mock Interview
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Practice job-specific interview questions generated from your
            resume and receive AI-powered feedback.
          </p>
        </div>

          {/* Job Selection */}
          {!interview && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Start a new interview
              </h2>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Select a job to generate personalized interview questions. Make
                sure your resume is uploaded in your profile.
              </p>

              <div className="mt-6">
                <label
                  htmlFor="job"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Select job
                </label>

                <select
                  id="job"
                  value={selectedJob}
                  onChange={(event) => setSelectedJob(event.target.value)}
                  disabled={loadingJobs || startingInterview}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">
                    {loadingJobs
                      ? "Loading jobs..."
                      : jobs.length === 0
                        ? "No jobs available"
                        : "Choose a job"}
                  </option>

                  {jobs.map((job) => (
                    <option key={job._id || job.id} value={job._id || job.id}>
                      {job.title || job.jobTitle || "Untitled Job"}
                      {" — "}
                      {job.company || job.companyName || "Company"}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleStartInterview}
                disabled={loadingJobs || startingInterview || !selectedJob}
                className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {startingInterview
                  ? "Generating interview questions..."
                  : "Start Mock Interview"}
              </button>
            </div>
          )}

          {/* Interview in Progress */}
          {interview && !interview.completed && (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {interview.jobTitle}
                    </h2>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {interview.company}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    Question {currentQuestionNumber} of {totalQuestions}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${
                        (currentQuestionNumber / totalQuestions) * 100
                      }%`,
                    }}
                  />
                </div>

                {/* Current Question */}
                <div className="rounded-lg bg-gray-50 p-5 dark:bg-gray-800">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      {interview.question?.topic}
                    </span>

                    <span className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      {interview.question?.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold leading-relaxed text-gray-900 dark:text-white">
                    {interview.question?.question}
                  </h3>
                </div>

                {/* Answer */}
                <label
                  htmlFor="answer"
                  className="mb-2 mt-6 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your answer
                </label>

                <textarea
                  id="answer"
                  rows={7}
                  maxLength={10000}
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Explain your answer clearly. Include examples where relevant..."
                  disabled={submittingAnswer}
                  className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                <div className="mt-2 text-right text-xs text-gray-500 dark:text-gray-400">
                  {answer.length}/10,000 characters
                </div>

                {error && (
                  <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={submittingAnswer || !answer.trim()}
                  className="mt-5 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submittingAnswer
                    ? "Evaluating your answer..."
                    : "Submit Answer"}
                </button>
              </div>

              {/* Feedback for Previous Answer */}
              {evaluation && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Previous Answer Feedback
                  </h2>

                  <div className="mt-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Score
                    </span>

                    <p className="text-3xl font-bold text-blue-600">
                      {evaluation.score}/10
                    </p>
                  </div>

                  <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">
                    {evaluation.feedback}
                  </p>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div>
                      <h3 className="font-semibold text-green-700 dark:text-green-400">
                        Strengths
                      </h3>

                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                        {evaluation.strengths.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-orange-700 dark:text-orange-400">
                        Improvements
                      </h3>

                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
                        {evaluation.improvements.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Final Report */}
          {interview?.completed && (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Interview Completed!
                </h2>

                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  You have completed all {totalQuestions} questions for{" "}
                  {interview.jobTitle}.
                </p>

                <div className="mt-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Overall Score
                  </p>

                  <p className="mt-1 text-5xl font-bold text-blue-600">
                    {interview.overallScore ?? "—"}
                    <span className="text-2xl">/10</span>
                  </p>
                </div>
              </div>

              {overallReport && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Final Interview Report
                  </h2>

                  <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">
                    {overallReport.overallFeedback}
                  </p>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="font-semibold text-green-700 dark:text-green-400">
                        Strongest Areas
                      </h3>

                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
                        {(overallReport.strengths || []).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-orange-700 dark:text-orange-400">
                        Areas to Improve
                      </h3>

                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
                        {(overallReport.improvements || []).map(
                          (item, index) => (
                            <li key={index}>{item}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleNewInterview}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Start Another Interview
              </button>
            </div>
          )}
        </div>
      </PageContainer>
  );
}
