"use client";

import { FaUserCheck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function ApplicantActions({ applicationId, updateStatus }) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Shortlist */}

      <button
        onClick={() => updateStatus(applicationId, "Shortlisted")}
        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-yellow-500/30
          bg-yellow-500/10
          px-4
          py-2
          text-sm
          font-medium
          text-yellow-400
          transition-all
          duration-300
          hover:-translate-y-1
          hover:bg-yellow-500/20
        "
      >
        <FaUserCheck />
        Shortlist
      </button>

      {/* Select */}

      <button
        onClick={() => updateStatus(applicationId, "Selected")}
        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-green-500/30
          bg-green-500/10
          px-4
          py-2
          text-sm
          font-medium
          text-green-400
          transition-all
          duration-300
          hover:-translate-y-1
          hover:bg-green-500/20
        "
      >
        <FaCheckCircle />
        Select
      </button>

      {/* Reject */}

      <button
        onClick={() => updateStatus(applicationId, "Rejected")}
        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-red-500/30
          bg-red-500/10
          px-4
          py-2
          text-sm
          font-medium
          text-red-400
          transition-all
          duration-300
          hover:-translate-y-1
          hover:bg-red-500/20
        "
      >
        <FaTimesCircle />
        Reject
      </button>
    </div>
  );
}
