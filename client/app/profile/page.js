"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ResumeUpload from "@/components/ResumeUpload";
import api from "@/services/api";

export default function ProfilePage() {

    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        college: "",
        branch: "",
        cgpa: "",
        skills: "",
    });

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const token = localStorage.getItem("token");

                const res = await api.get(
                    "/student/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setProfile(res.data);

            } catch (error) {

                if (error.response?.status !== 404) {

                    console.log(error);

                }

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            await api.post(
                "/student/profile",
                {
                    ...formData,
                    skills: formData.skills
                        .split(",")
                        .map(skill => skill.trim())
                        .filter(skill => skill),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Profile created successfully!");

            router.push("/dashboard");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to create profile"
            );

        }

    };

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">
                    <h1 className="text-3xl font-semibold">
                        Loading...
                    </h1>
                </div>
            </>
        );

    }

    // -------------------------------
    // NEW STUDENT
    // -------------------------------

    if (!profile) {

        return (

            <>
                <Navbar />

                <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center p-8">

                    <form
                        onSubmit={handleSubmit}
                        className="bg-gray-900 border border-gray-800 rounded-3xl p-10 w-full max-w-2xl shadow-2xl"
                    >

                        <h1 className="text-4xl font-bold mb-2">
                            Complete Your Profile
                        </h1>

                        <p className="text-gray-400 mb-8">
                            Complete your profile before applying for jobs.
                        </p>

                        <div className="space-y-6">

                            <div>

                                <label className="block mb-2">
                                    College
                                </label>

                                <input
                                    type="text"
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                                    required
                                />

                            </div>

                            <div>

                                <label className="block mb-2">
                                    Branch
                                </label>

                                <input
                                    type="text"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                                    required
                                />

                            </div>

                            <div>

                                <label className="block mb-2">
                                    CGPA
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="cgpa"
                                    value={formData.cgpa}
                                    onChange={handleChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                                    required
                                />

                            </div>

                            <div>

                                <label className="block mb-2">
                                    Skills
                                </label>

                                <input
                                    type="text"
                                    name="skills"
                                    placeholder="React, Node.js, MongoDB"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-4 text-lg font-semibold transition"
                            >
                                Save Profile
                            </button>

                        </div>

                    </form>

                </div>

            </>

        );

    }

    // -------------------------------
    // EXISTING STUDENT
    // -------------------------------

    return (

        <>
            <Navbar />

            <div className="min-h-screen bg-gray-950 text-white p-8">

                <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-3xl p-10 shadow-xl">

                    <h1 className="text-4xl font-bold mb-8">
                        Student Profile
                    </h1>

                    <div className="space-y-6">

                        <div>

                            <p className="text-gray-400">
                                College
                            </p>

                            <p className="text-xl">
                                {profile.college}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-400">
                                Branch
                            </p>

                            <p className="text-xl">
                                {profile.branch}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-400">
                                CGPA
                            </p>

                            <p className="text-xl text-green-400">
                                {profile.cgpa}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-400 mb-2">
                                Skills
                            </p>

                            <div className="flex flex-wrap gap-3">

                                {profile.skills?.map((skill, index) => (

                                    <span
                                        key={index}
                                        className="bg-blue-600 px-4 py-2 rounded-full"
                                    >
                                        {skill}
                                    </span>

                                ))}

                            </div>

                        </div>

                        <div>

                            <p className="text-gray-400">
                                Resume
                            </p>

                            {profile.resumeUrl ? (

                                <a
                                    href={profile.resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-400 underline"
                                >
                                    View Resume
                                </a>

                            ) : (

                                <p className="text-red-400">
                                    Resume not uploaded
                                </p>

                            )}

                        </div>

                    </div>

                </div>

                <div className="max-w-4xl mx-auto mt-8">

                    <ResumeUpload />

                </div>

            </div>

        </>

    );

}