"use client";

import { useState } from "react";
import api from "@/services/api";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post(
                "/auth/register",
                formData
            );

            alert(res.data.message);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Registration Failed"
            );
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="w-96 p-6 border rounded-lg shadow"
            >
                <h1 className="text-2xl font-bold mb-4">
                    Register
                </h1>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full border p-2 mb-3"
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-3"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-3"
                    onChange={handleChange}
                />

                <select
                    name="role"
                    className="w-full border p-2 mb-3"
                    onChange={handleChange}
                >
                    <option value="student">
                        Student
                    </option>

                    <option value="recruiter">
                        Recruiter
                    </option>
                </select>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 w-full"
                >
                    Register
                </button>
            </form>
        </div>
    );
}