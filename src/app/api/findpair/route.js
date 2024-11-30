import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { id, username, amount } = req.body;
    const amountToString = String(amount);
    const newID = String(id);
    const userString = String(username);
    const findOponent = await prisma.userCurrentPairedDetails.findMany({
      where: { authorId: newID },
      data: { amount: amountToString },
    });
  } catch (error) {
    console.error("error getting opponent:", error);
    return NextResponse.json(
      { error: "Failed to get opponent" },
      { status: 500 }
    );
  }finally {
    await prisma.$disconnect(); // Ensure the database connection is closed after the request
  }
}
