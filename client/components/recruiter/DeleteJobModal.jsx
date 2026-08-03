"use client";

export default function DeleteJobModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  jobTitle,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white">
          Delete Job
        </h2>

        <p className="mt-4 text-gray-300">
          Are you sure you want to delete
          <span className="font-semibold text-red-400">
            {" "}
            {jobTitle}
          </span>
          ?
        </p>

        <p className="mt-2 text-sm text-gray-500">
          This action cannot be undone.
        </p>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-600 px-5 py-2 text-white hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}