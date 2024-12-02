// export const dynamic = "force-static"; 
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Parse the JSON body
    const body = await request.json();
    const { userId, username, amount } = body;


    console.log(userId,username , amount)
    // Validate the required fields
    if (!userId || !username || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the user is already paired or has participated in a game
    const userAutomaticPairedDetails = await prisma.userAutomaticPairedDetails.findFirst({
      where: {
        authorId: userId,
      },
      include: {
        author: true,
      },
    });

    if (userAutomaticPairedDetails?.isPaired === false) {
      // Update the amount if the user is not paired yet
      await prisma.userAutomaticPairedDetails.update({
        where: { authorId: userId },
        include: { author: true },
        data: { amount: amount }, // Update the amount
      });
    }

    // Return the updated user details
    return NextResponse.json({ data: "hello"}, { status: 200 });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }finally {
    await prisma.$disconnect(); // Ensure the database connection is closed after the request
  }
}

