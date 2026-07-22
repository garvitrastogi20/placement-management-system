"use client";

import { useRef, useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        if (selectedFile.type !== "application/pdf") {
            toast.error("Only PDF files are allowed.");
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a resume first.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("resume", file);

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

            toast.success("Resume uploaded successfully!");

            console.log(res.data);

            // Optional: clear selected file after upload
            setFile(null);
            fileInputRef.current.value = "";
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Upload failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <h2 className="text-2xl font-bold text-white mb-6">
                Upload Resume
            </h2>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Select Resume Button */}
            <button
                onClick={() => fileInputRef.current.click()}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-5 py-3 rounded-xl transition"
            >
                📄 Select Resume
            </button>

            {/* Selected File */}
            <div className="mt-4">
                {file ? (
                    <p className="text-green-400 font-medium">
                        Selected: {file.name}
                    </p>
                ) : (
                    <p className="text-gray-400">
                        No file selected
                    </p>
                )}
            </div>

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
                {loading ? "Uploading..." : "Upload Resume"}
            </button>

        </div>
    );
}