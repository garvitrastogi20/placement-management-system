"use client";

export default function ManageJobCard({
  job,
  onEdit,
  onDelete,
  onApplicants,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-lg transition hover:border-blue-500/40">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">
          {job.title}
        </h3>

        <p className="text-gray-300">
          {job.company}
        </p>

        <p className="text-gray-400">
          📍 {job.location}
        </p>

        <p className="text-green-400 font-semibold">
          ₹ {job.package} LPA
        </p>

        <p className="text-sm text-gray-400">
          Applicants: {job.applicantCount}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => onApplicants(job)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Applicants
        </button>

        <button
          onClick={() => onEdit(job)}
          className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(job)}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}