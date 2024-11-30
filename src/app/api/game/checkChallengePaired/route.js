import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Extract the userId from the query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id"); // This is the opponentId

    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Check for a paired challenge using userId as opponentId
    const challengeDetails = await prisma.challengeGameRangeDetails.findFirst({
      where: {
        opponentId: userId,  // We are checking if the opponent (userId) is paired
        paired: true,         // We only want challenges that are paired
      },
    });

    // If challenge is found and paired, return paired: true
    if (challengeDetails) {
      return NextResponse.json({ paired: true }, { status: 200 });
    }

    // If no paired challenge is found, return paired: false
    return NextResponse.json({ paired: false }, { status: 200 });

  } catch (error) {
    console.error("Error checking challenge pairing:", error);
    return NextResponse.json({ error: "Error occurred", details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma connection is closed after processing the request
  }
}
