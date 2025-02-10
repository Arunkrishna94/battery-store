"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/signin");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <h2 className="text-xl font-semibold mt-4">Your Newsletters</h2>
      <ul className="list-disc">
        <li>Newsletter 1</li>
        <li>Newsletter 2</li>
        <li>Newsletter 3</li>
      </ul>
    </div>
  );
}
