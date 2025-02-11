import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "@/lib/db"; // Your MySQL connection file

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        return new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM users WHERE email = ?",
            [credentials.email],
            async (err, results) => {
              if (err) return reject(new Error("Database error"));
              if (!results.length) return reject(new Error("User not found"));

              const user = results[0];
              const isValid = await bcrypt.compare(credentials.password, user.password);
              if (!isValid) return reject(new Error("Invalid credentials"));

              resolve({ id: user.id, name: user.name, email: user.email });
            }
          );
        });
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
