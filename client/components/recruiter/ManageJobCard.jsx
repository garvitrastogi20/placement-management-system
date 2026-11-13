"use client";

import {
  FaMapMarkerAlt,
  FaUsers,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaArrowRight,
} from "react-icons/fa";

import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

export default function ManageJobCard({ job, onEdit, onDelete, onApplicants }) {
  const isActive = !job.deadline || new Date(job.deadline) >= new Date();

  return (
    <GlassCard className="group h-full">
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">{job.title}</h3>

          <p className="mt-2 text-gray-400">{job.company}</p>
        </div>

        <Badge variant={isActive ? "success" : "danger"}>
          {isActive ? "Active" : "Expired"}
        </Badge>
      </div>

      {/* Salary */}

      <div className="mt-6">
        <span
          className="
            inline-flex
            rounded-xl
            border
            border-[#C97B3C]/20
            bg-[#C97B3C]/10
            px-4
            py-2
            text-lg
            font-semibold
            text-[#F4C27A]
          "
        >
          ₹ {job.package?.toLocaleString()} LPA
        </span>
      </div>

      {/* Information */}

      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3 text-gray-300">
          <FaMapMarkerAlt className="text-[#C97B3C]" />

          <span>{job.location}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-300">
          <FaUsers className="text-[#C97B3C]" />

          <span>{job.applicantCount || 0} Applicants</span>
        </div>

        {job.deadline && (
          <div className="flex items-center gap-3 text-gray-300">
            <FaCalendarAlt className="text-[#C97B3C]" />

            <span>{new Date(job.deadline).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Divider */}

      <div className="my-6 h-px bg-white/10" />

      {/* Footer */}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onApplicants(job)}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-[#C97B3C]
            px-4
            py-2
            font-medium
            text-black
            transition-all
            duration-300
            hover:bg-[#F4C27A]
          "
        >
          <FaArrowRight />
          Applicants
        </button>

        <button
          onClick={() => onEdit(job)}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-[#F4C27A]/30
            bg-[#F4C27A]/10
            px-4
            py-2
            text-[#F4C27A]
            transition-all
            duration-300
            hover:bg-[#F4C27A]/20
          "
        >
          <FaEdit />
          Edit
        </button>

        <button
          onClick={() => onDelete(job)}
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
            text-red-400
            transition-all
            duration-300
            hover:bg-red-500/20
          "
        >
          <FaTrash />
          Delete
        </button>
      </div>
    </GlassCard>
  );
}
