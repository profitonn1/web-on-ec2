// export const dynamic = 'force-dynamic';
export const dynamic = 'force-static';
import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, username, token } = body;

    console.log(token , userId , username)
    if (!userId || !username || !token) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    return NextResponse.json({ user: decoded }, { status: 200 });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.error("Error verifying token:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
