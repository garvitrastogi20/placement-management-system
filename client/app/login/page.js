"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function LoginPage() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const res = await api.post(
                "/auth/login",
                formData
            );

            localStorage.setItem(
                "token",
                res.data.token
            );

            localStorage.setItem(
                "role",
                res.data.user.role
            );

            localStorage.setItem(
                "name",
                res.data.user.name
            );

            alert("Login Successful");

            if (
                res.data.user.role ===
                "recruiter"
            ) {

                router.push(
                    "/recruiter/dashboard"
                );

            } else {

                router.push(
                    "/dashboard"
                );

            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Login Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="flex justify-center items-center min-h-screen bg-gray-950">

            <form
                onSubmit={handleSubmit}
                className="w-96 bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl"
            >

                <h1 className="text-3xl font-bold text-white mb-6 text-center">

                    Login

                </h1>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white mb-4"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white mb-6"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 p-3 rounded-lg text-white font-semibold transition"
                >

                    {loading
                        ? "Logging in..."
                        : "Login"}

                </button>

            </form>

        </div>

    );

}