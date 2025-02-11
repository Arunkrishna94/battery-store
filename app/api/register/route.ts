import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, results) => {
        if (err) return reject(NextResponse.json({ error: "Database error" }, { status: 500 }));
        resolve(NextResponse.json({ message: "User registered" }, { status: 201 }));
      }
    );
  });
}
