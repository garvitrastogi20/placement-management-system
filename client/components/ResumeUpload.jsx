"use client";

import { useRef, useState } from "react";
import { FaFilePdf, FaUpload } from "react-icons/fa";

import api from "@/services/api";
import toast from "react-hot-toast";

export default function ResumeUpload({
  buttonText = "Upload Resume",
  onUploadSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // Only PDF files
    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("resume", selectedFile);

      const token = localStorage.getItem("token");

      const res = await api.post("/student/upload-resume", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);

      toast.success("Resume uploaded successfully!");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onUploadSuccess) {
        await onUploadSuccess();
      }
    } catch (error) {
      console.error("Resume Upload Error:", error);

      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hidden File Input */}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Area */}

      <div className="rounded-2xl border border-dashed border-[#C97B3C]/30 bg-[#C97B3C]/5 p-6 transition-all duration-300 hover:border-[#C97B3C]/50 hover:bg-[#C97B3C]/10">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Icon */}

          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C97B3C]/10 text-2xl text-[#F4C27A]">
            <FaFilePdf />
          </div>

          {/* Heading */}

          <h3 className="text-lg font-semibold text-white">
            {loading ? "Uploading your resume..." : "Upload your latest resume"}
          </h3>

          {/* Description */}

          <p className="mt-2 max-w-md text-sm text-gray-500">
            Upload your resume in PDF format. Keep it updated to improve your
            placement opportunities.
          </p>

          {/* Button */}

          <button
            type="button"
            disabled={loading}
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#C97B3C] to-[#F4C27A] px-6 py-3 font-semibold text-black shadow-[0_8px_30px_rgba(201,123,60,.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(201,123,60,.2)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaUpload />

            {loading ? "Uploading..." : buttonText}
          </button>

          {/* File Information */}

          <p className="mt-3 text-xs text-gray-600">
            PDF only • Recommended under 5 MB
          </p>
        </div>
      </div>
    </div>
  );
}
