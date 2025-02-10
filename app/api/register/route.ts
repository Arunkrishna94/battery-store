import { NextResponse } from "next/server";

let users = []; // Temporary storage, replace with DB later.

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const newUser = { name, email, password };
  users.push(newUser);

  return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
}
