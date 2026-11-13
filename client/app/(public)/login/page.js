"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/services/api";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";
import Background from "@/components/ui/Background";
import { FaEnvelope, FaLock, FaArrowRight, FaArrowLeft } from "react-icons/fa";

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
            const res = await api.post("/auth/login", formData);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.user.role);
            localStorage.setItem("name", res.data.user.name);

            toast.success("Login Successful");

            if (res.data.user.role === "recruiter") {
                router.push("/recruiter/dashboard");
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Login Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Background>
            <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-8">
                {/* Top bar */}
                <div className="flex items-center justify-between mx-auto w-full max-w-5xl">
                    <Logo />
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            href="/"
                            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-[#F4C27A] transition"
                        >
                            <FaArrowLeft size={10} /> Home
                        </Link>
                    </div>
                </div>

                {/* Form card */}
                <div className="flex items-center justify-center my-8">
                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#11100F]/90 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                        <div className="text-center mb-8">
                            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-[#C97B3C]">
                                WELCOME BACK
                            </span>
                            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Sign In
                            </h1>
                            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
                                Enter your credentials to access your dashboard
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500">
                                        <FaEnvelope size={14} />
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#C97B3C] dark:focus:ring-[#C97B3C]/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500">
                                        <FaLock size={14} />
                                    </span>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#C97B3C] dark:focus:ring-[#C97B3C]/20"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-60 active:scale-[0.99] dark:bg-gradient-to-r dark:from-[#C97B3C] dark:to-[#F4C27A] dark:text-black dark:shadow-[0_10px_30px_rgba(201,123,60,.25)]"
                            >
                                {loading ? (
                                    <span>Signing In...</span>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <FaArrowRight size={13} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-600 dark:border-white/10 dark:text-gray-400">
                            Don&apos;t have an account yet?{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-blue-600 hover:underline dark:text-[#F4C27A]"
                            >
                                Create an account
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer copyright */}
                <div className="text-center text-xs text-slate-400 dark:text-gray-600 pb-2">
                    © {new Date().getFullYear()} Placementor AI. All rights reserved.
                </div>
            </div>
        </Background>
    );
}