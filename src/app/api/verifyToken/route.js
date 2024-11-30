import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, username, token } = body;

    if (!userId || !username || !token) {
      // Explicitly return an error for missing credentials
      return NextResponse.json({ error: "Missing credentials" }, { status: 401 });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    // If verification succeeds, return the decoded user details
    return NextResponse.json({ user: decoded }, { status: 200 });

  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      // Invalid token
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (error instanceof jwt.TokenExpiredError) {
      // Token expired
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    // Catch any other errors
    console.error("Error verifying token:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
