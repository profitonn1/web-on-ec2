import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { id: userId, username, amount } = body;

    console.log(userId, username, amount, typeof amount);
    
  } catch (error) {
    // Safeguard error handling
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error in updating the balance after the match:", errorMessage);

    return NextResponse.json(
      { error: "Error occurred", details: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
