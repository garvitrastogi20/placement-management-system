"use client";

import { FaCheckCircle, FaTimesCircle, FaUserCheck } from "react-icons/fa";

export default function ApplicantsTable({ applicants = [], updateStatus }) {
  if (applicants.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900 p-10 text-center">
        <h2 className="text-2xl font-semibold text-white">No Applicants Yet</h2>

        <p className="mt-2 text-gray-400">
          Students who apply for this job will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
      <table className="w-full">
        <thead className="bg-gray-950">
          <tr className="text-left text-gray-300">
            <th className="p-5">Student</th>

            <th className="p-5">Email</th>

            <th className="p-5">Status</th>

            <th className="p-5">Applied</th>

            <th className="p-5 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {applicants.map((app) => (
            <tr
              key={app._id}
              className="border-t border-gray-800 hover:bg-gray-800/40 transition"
            >
              <td className="p-5 font-medium text-white">{app.student.name}</td>

              <td className="p-5 text-gray-400">{app.student.email}</td>

              <td className="p-5">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    app.status === "Applied"
                      ? "bg-blue-500/20 text-blue-400"
                      : app.status === "Shortlisted"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : app.status === "Selected"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {app.status}
                </span>
              </td>

              <td className="p-5 text-gray-400">
                {new Date(app.createdAt).toLocaleDateString()}
              </td>

              <td className="p-5">
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => updateStatus(app._id, "Shortlisted")}
                    className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-yellow-400"
                    title="Shortlist Candidate"
                  >
                    <div className="flex items-center gap-2">
                      <FaUserCheck />
                      Shortlist
                    </div>
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "Selected")}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                    title="Select Candidate"
                  >
                    <div className="flex items-center gap-2">
                      <FaCheckCircle />
                      Select
                    </div>
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "Rejected")}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    title="Reject Candidate"
                  >
                    <div className="flex items-center gap-2">
                      <FaTimesCircle />
                      Reject
                    </div>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
