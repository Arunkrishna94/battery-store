"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard"); // Redirect to dashboard
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold text-center mb-4">Sign In</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            required 
            className="p-2 border rounded-md w-full"
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
            className="p-2 border rounded-md w-full"
          />
          <button 
            type="submit" 
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
