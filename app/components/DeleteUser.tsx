"use client";

import { useState } from "react";

export default function DeleteUser() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    if (!email) {
      setMessage("Please enter an email.");
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message || data.error);
    } catch (error) {
      setMessage("Failed to delete user.");
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h2 className="text-lg font-semibold">Delete User</h2>
      <input
        type="email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded-md w-full"
      />
      <button
        onClick={handleDelete}
        className="mt-2 bg-red-500 text-white p-2 rounded-md"
      >
        Delete
      </button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
