import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

// Handle GET request (Fetch all users)
export async function GET() {
  try {
    const [users] = await db.promise().query("SELECT id, name, email FROM users");
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Handle POST request (Register new user)
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const [existingUser] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    
    if ((existingUser as any[]).length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Handle DELETE request (Delete user by email)
export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const [result] = await db.promise().query("DELETE FROM users WHERE email = ?", [email]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Handle PUT request (Update user details)
export async function PUT(req: Request) {
  try {
    const { id, name, email } = await req.json();

    if (!id || !name || !email) {
      return NextResponse.json({ error: "ID, name, and email are required" }, { status: 400 });
    }

    const [result] = await db.promise().query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id]
    );

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "User not found or no changes made" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
