import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { username, mobile, password, email } = await request.json();
    console.log("Received data:", { username, mobile, password, email }); // Add this log

    // Validate input data
    if (!username || !email || !password || !mobile) {
      return NextResponse.json({ msg: "Invalid input" }, { status: 400 });
    }

    const lowercasedUsername = username.replace(/\s+/g, '').toLowerCase();
    const existingEmail = await prisma.user.findFirst({ where: { email } });
    const existingUser = await prisma.user.findFirst({ where: { username: lowercasedUsername } });

    if (existingEmail) {
      return NextResponse.json({ msg: "User already exists" }, { status: 400 });
    }

    if (existingUser) {
      return NextResponse.json({ msg: "Username already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const signInDateTime = new Date();

    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username: lowercasedUsername,
          mobile,
          email,
          password: hashedPassword,
          joinedDate: signInDateTime,
        },
      });

      await tx.userFullDetails.create({
        data: {
          nooftimespaired: "0",
          averageroc: "0",
          balanceINR: 0,
          authorId: newUser.id,
          winRate: "0/0",
          Ranking: "Null",
        },
      });
    });

    return NextResponse.json({ msg: "Signup success" });
  } catch (e) {
    if (e instanceof Error) {
      console.error("Signup error:", e.message); // Ensure to log message if it's an Error instance
    } else {
      console.error("Signup error:", e); // Log as generic error if it's not an Error instance
    }
    return NextResponse.json({ msg: "Signup failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure disconnection in finally block
  }
}
