"use client";

import { useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function ResumeUpload() {

    const [file, setFile] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const handleUpload =
        async () => {

            if (!file) {

                toast.error(
                    "Select a file first"
                );

                return;
            }

            try {

                setLoading(true);

                const formData =
                    new FormData();

                formData.append(
                    "resume",
                    file
                );

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const res =
                    await api.post(
                        "/student/upload-resume",
                        formData,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                                "Content-Type":
                                    "multipart/form-data",
                            },
                        }
                    );

                toast.success(
                    "Resume Uploaded"
                );

                console.log(
                    res.data
                );

            } catch (error) {

                toast.error(
                    error.response?.data
                        ?.message ||
                    "Upload Failed"
                );

            } finally {

                setLoading(false);

            }
        };

    return (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">

            <h2 className="text-2xl font-bold mb-4">
                Upload Resume
            </h2>

            <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                    setFile(
                        e.target.files[0]
                    )
                }
                className="mb-4 block"
            />

            <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"
            >
                {loading
                    ? "Uploading..."
                    : "Upload Resume"}
            </button>

        </div>
    );
}