// export const dynamic = 'force-static';

// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient()

// export async function POST(request) {
//   try {
//     const { userId, username, amount } = await request.json();
//     if (!userId || !username || !amount) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const userDetails = await prisma.userAutomaticPairedDetails.findFirst({
//       where: { authorId: userId },
//     });

//     if (userDetails && userDetails.isPaired) {
//       return NextResponse.json({ data: userDetails }, { status: 201 });
//     }

//     const potentialOpponents = await prisma.userAutomaticPairedDetails.findMany({
//       where: {
//         amount,
//         isPaired: false,
//         NOT: { authorId: userId },
//       },
//       include: {
//         user: {
//           select: {
//             username: true, // Fetch username from the user table
//             userFullDetails: { // Fetch winrate and ranking from userFullDetails
//               select: {
//                 winRate: true,
//                 Ranking: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     // Map the results to structure them as needed
//     const formattedOpponents = potentialOpponents.map((opponent) => ({
//       username: opponent.user.username || "Unknown",
//       winrate: opponent.user.userFullDetails?.winRate || "N/A",
//       ranking: opponent.user.userFullDetails?.Ranking || "Unranked",
//     }));

//     console.log(formattedOpponents);

//     if (formattedOpponents.length === 0) {
//       return NextResponse.json({ message: "No opponent found." }, { status: 404 });
//     }

//     const opponent = formattedOpponents[Math.floor(Math.random() * formattedOpponents.length)];

//     await prisma.$transaction([
//       prisma.userAutomaticPairedDetails.update({
//         where: { authorId: userId },
//         data: { isPaired: true, opponentId: opponent.authorId },
//       }),
//       prisma.userAutomaticPairedDetails.update({
//         where: { authorId: opponent.authorId },
//         data: { isPaired: true, opponentId: userId },
//       }),
//     ]);

//     return NextResponse.json({ data: opponent }, { status: 201 });
//   } catch (error) {
//     console.error("Error in POST:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function GET(request) {
//   try {
//     // Parse query parameters from the request URL
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");
//     const username = searchParams.get("username");
//     const amount = searchParams.get("amount");

//     // Log the extracted parameters for debugging
//     console.log("ID:", id);
//     console.log("Username:", username);
//     console.log("Amount:", amount);
//     console.log("Request URL:", request.url);

//     // Validate required query parameters
//     if (!id || !username || !amount) {
//       return NextResponse.json(
//         { error: "Missing required fields: id, username, or amount" },
//         { status: 400 }
//       );
//     }

//     // Fetch the user's pairing details
//     const user = await prisma.userAutomaticPairedDetails.findFirst({
//       where: { authorId: id },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found or not paired" },
//         { status: 404 }
//       );
//     }

//     // Check if the user has an opponent
//     if (!user.opponentId) {
//       return NextResponse.json(
//         { error: "Opponent not found for the user" },
//         { status: 404 }
//       );
//     }

//     // Fetch opponent's details
//     const opponentname = await prisma.user.findUnique({
//       where: { id: user.opponentId },
//     });

//     const opponentDetails = await prisma.userFullDetails.findFirst({
//       where: { authorId: user.opponentId },
//     });

//     // Construct the response object with optional chaining
//     return NextResponse.json({
//       oppname: opponentname?.username || "Unknown Opponent",
//       winrate: opponentDetails?.winRate || "N/A",
//       ranking: opponentDetails?.Ranking || "Unranked",
//     });
//   } catch (error) {
//     console.error("Error fetching user details:", error.message);
//     return NextResponse.json(
//       { error: "Internal server error while fetching user details" },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect(); // Ensure the database connection is closed
//   }
// }

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Create a Prisma Client instance
const prisma = new PrismaClient();
export async function POST(request) {
  try {
    const body = await request.json();
    const { id: userId, username, amount } = body;

    console.log("Received Request:", userId, username, amount);

    // Fetch potential opponents and ongoing match concurrently
    const [potentialOpponents, ongoingMatch] = await Promise.all([
      prisma.userAutomaticPairedDetails.findMany({
        where: {
          amount: amount,
          isPaired: false,
          NOT: { authorId: userId },
        },
        include: {
          author: {
            select: {
              username: true,
              userfulldetails: {
                take: 1,
                select: {
                  winRate: true,
                  Ranking: true,
                },
              },
            },
          },
        },
      }),
      prisma.totalAutomaticHistory.findFirst({
        where: {
          OR: [{ playerOneUserName: username }, { playerTwoUserName: username }],
          status: "ongoing",
        },
        orderBy: { startTime: "desc" },
      }),
    ]);

    // No potential opponents
    if (potentialOpponents.length === 0) {
      if (!ongoingMatch) {
        return NextResponse.json(
          { error: "No potential opponents found" },
          { status: 404 }
        );
      }

      // Retrieve ongoing match opponent details
      const opponentUsername =
        ongoingMatch.playerOneUserName === username
          ? ongoingMatch.playerTwoUserName
          : ongoingMatch.playerOneUserName;

      const opponent = await prisma.userFullDetails.findFirst({
        where: { author: { username: opponentUsername } },
      });

      const demoMoney = await prisma.partialDemoBalance.findUnique({
        where: { player: opponentUsername },
      });

      return NextResponse.json(
        {
          oppname: opponentUsername,
          winrate: opponent?.winRate,
          ranking: opponent?.Ranking,
          oppDemoBalance: demoMoney?.demoBalance,
          startTime: ongoingMatch.startTime,
          gameId: ongoingMatch.gameId,
        },
        { status: 200 }
      );
    }

    // Randomly choose an opponent
    const randomOpponent =
      potentialOpponents[Math.floor(Math.random() * potentialOpponents.length)];
    const opponentDetails = randomOpponent?.author?.userfulldetails[0];

    if (!randomOpponent || !opponentDetails) {
      return NextResponse.json(
        { error: "Opponent details missing" },
        { status: 500 }
      );
    }

    // Perform transactional pairing and game creation
    const newGame = await prisma.$transaction(async (tx) => {
      // Update pairing details
      await tx.userAutomaticPairedDetails.delete({
        where: { authorId: userId },
      });

      await tx.userAutomaticPairedDetails.delete({
        where: { authorId: randomOpponent.authorId },
      });

      // Create new game
      return tx.totalAutomaticHistory.create({
        data: {
          amount: randomOpponent.amount,
          category: randomOpponent.category,
          playerOneUserName: randomOpponent.author.username,
          playerTwoUserName: username,
          status: "ongoing",
          startTime: new Date(),
        },
      });
    });

    const demoMoney = await prisma.partialDemoBalance.findUnique({
      where: { player: randomOpponent.author.username },
    });

    // Sync the game details for both players
    return NextResponse.json(
      {
        oppname: randomOpponent.author.username,
        winrate: opponentDetails.winRate,
        ranking: opponentDetails.Ranking,
        oppDemoBalance: demoMoney?.demoBalance,
        startTime: newGame.startTime,
        gameId: newGame?.gameId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during challenge pairing:", error.message);

    return NextResponse.json(
      { error: "Error occurred", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

