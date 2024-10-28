export const dynamic = "force-static"; 
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Destructure from `params`
    const { params } = body;
    const { id: userId, username, amount } = params;


    // Validate the required fields
    if (!userId || !username || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the user is already paired or has participated in a game
    const userCurrentPairedDetails = await prisma.userCurrentPairedDetails.findFirst({
      where: {
        authorId: userId,
      },
      include: {
        author: true,
      },
    });

    if (userCurrentPairedDetails?.isPaired === false) {
      // Update the amount if the user is not paired yet
      await prisma.userCurrentPairedDetails.update({
        where: { authorId: userId },
        include: { author: true },
        data: { amount: amount }, // Update the amount
      });
    }

    // Return the updated user details
    return NextResponse.json({ data: userCurrentPairedDetails }, { status: 200 });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
