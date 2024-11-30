import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Parse the request body
    const requestBody = await request.json();
    const { player1, player2, player1Bet, player2Bet, date } = requestBody;

    console.log("Received challenge history data:", {
      player1,
      player2,
      player1Bet,
      player2Bet,
      date
    });

    // Validate data
    if (!player1 || !player2 || !player1Bet || !player2Bet || !date) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Create challenge history record
    const challengeHistory = await prisma.challangeHistory.create({
      data: {
        player1,
        player2,
        player1Bet,
        player2Bet,
        date: new Date(date),
      },
    });

    console.log("Challenge history saved:", challengeHistory);

    return new Response(
      JSON.stringify({ success: true, challengeHistory }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving challenge history:", error);
    console.error("Error details:", error.stack);

    return new Response(
      JSON.stringify({ error: "Failed to save challenge history", details: error.message }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
