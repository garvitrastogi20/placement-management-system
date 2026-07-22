"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function CreateJobPage() {

    const [formData, setFormData] =
        useState({
            title: "",
            company: "",
            location: "",
            package: "",
            description: "",
            skillsRequired: "",
        });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );

                await api.post(
                    "/jobs",
                    {
                        ...formData,
                        skillsRequired:
                            formData.skillsRequired
                                .split(",")
                                .map(
                                    (skill) =>
                                        skill.trim()
                                ),
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                toast.success(
                    "Job Created Successfully"
                );

            } catch (error) {

                toast.error(
                    error.response?.data
                        ?.message ||
                    "Failed to create job"
                );

            }
        };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-950 text-white p-8">

                <div className="max-w-3xl mx-auto bg-gray-900 border border-gray-800 p-8 rounded-2xl">

                    <h1 className="text-3xl font-bold mb-8">
                        Create New Job
                    </h1>

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="space-y-4"
                    >

                        <input
                            type="text"
                            name="title"
                            placeholder="Job Title"
                            onChange={
                                handleChange
                            }
                            className="w-full bg-gray-800 p-3 rounded-lg"
                        />

                        <input
                            type="text"
                            name="company"
                            placeholder="Company"
                            onChange={
                                handleChange
                            }
                            className="w-full bg-gray-800 p-3 rounded-lg"
                        />

                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            onChange={
                                handleChange
                            }
                            className="w-full bg-gray-800 p-3 rounded-lg"
                        />

                        <input
                            type="number"
                            name="package"
                            placeholder="Package"
                            onChange={
                                handleChange
                            }
                            className="w-full bg-gray-800 p-3 rounded-lg"
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            onChange={
                                handleChange
                            }
                            className="w-full bg-gray-800 p-3 rounded-lg h-32"
                        />

                        <input
                            type="text"
                            name="skillsRequired"
                            placeholder="Skills (comma separated)"
                            onChange={
                                handleChange
                            }
                            className="w-full bg-gray-800 p-3 rounded-lg"
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700"
                        >
                            Create Job
                        </button>

                    </form>

                </div>

            </div>
        </>
    );
}