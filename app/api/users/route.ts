import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";

// Handle GET request (optional)
export async function GET() {
  return NextResponse.json({ message: "Users API works" });
}

// Handle POST request
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
