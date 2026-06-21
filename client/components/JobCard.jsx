"use client";

import { useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function JobCard({ job }) {

    const [loading, setLoading] =
        useState(false);

    const handleApply = async () => {

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");

            const res = await api.post(
                `/jobs/${job._id}/apply`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                res.data.message
            );

        } catch (error) {

            toast.error(
                error.response?.data
                    ?.message ||
                "Application Failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition">

            <h2 className="text-2xl font-bold text-white">
                {job.title}
            </h2>

            <p className="text-gray-400 mt-2">
                {job.company}
            </p>

            <p className="text-gray-300 mt-2">
                📍 {job.location}
            </p>

            <p className="mt-2 font-semibold text-green-400">
                ₹ {job.package?.toLocaleString()}
            </p>

            <button
                onClick={handleApply}
                disabled={loading}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
                {loading
                    ? "Applying..."
                    : "Apply Now"}
            </button>

        </div>
    );
}