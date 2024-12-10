import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { gameId, username, balance, first, second } = body;

    // Validate required fields
    if (!gameId || !username || !balance) {
      return NextResponse.json(
        { msg: "Missing required data" },
        { status: 400 }
      );
    }

    console.log("Incoming Data:", { gameId, username, balance, first, second });

    // Fetch the game row to verify its status and end time
    const automaticGameRow = await prisma.totalAutomaticHistory.findUnique({
      where: { gameId },
    });

    if (!automaticGameRow) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    if (
      automaticGameRow.status === "ongoing" &&
      automaticGameRow.endTime === null
    ) {
      await prisma.totalAutomaticHistory.update({
        where: { gameId },
        data: {
          status: "completed",
          endTime: new Date(),
          first,
          second,
        },
      });

      console.log(`Game ${gameId} marked as completed.`);
      return NextResponse.json(
        { msg: "Game status updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { msg: "Game already completed or invalid status" },
        { status: 400 }
      );
    }
  } catch (error) {
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
