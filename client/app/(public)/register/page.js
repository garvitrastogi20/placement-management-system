"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
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

    try {
      setLoading(true);
      const res = await api.post("/auth/register", formData);

      alert(res.data.message);
      router.push("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 border rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          className="w-full border p-2 mb-3"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          className="w-full border p-2 mb-3"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          minLength={6}
          className="w-full border p-2 mb-3"
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={formData.role}
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        >
          <option value="student">Student</option>

          <option value="recruiter">Recruiter</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 w-full disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
