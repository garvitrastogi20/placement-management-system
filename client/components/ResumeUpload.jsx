"use client";

import { useRef, useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function ResumeUpload({
    buttonText = "📄 Upload Resume",
    onUploadSuccess,
}) {
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

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

            const res = await api.post(
                "/student/upload-resume",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log(res.data);

            toast.success("Resume uploaded successfully!");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            if (onUploadSuccess) {
                await onUploadSuccess();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Upload failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
            />

            <button
                type="button"
                disabled={loading}
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-5 py-3 text-white font-semibold transition"
            >
                {loading ? "Uploading..." : buttonText}
            </button>
        </>
    );
}