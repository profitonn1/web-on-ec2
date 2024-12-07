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

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { id: userId, username, amount } = body;

    console.log(userId, username, amount, typeof(amount));

    // Fetch potential opponents and include related `user` and `userFullDetails`
    const potentialOpponents = await prisma.userAutomaticPairedDetails.findMany({
      where: {
        amount: "50",
        isPaired: false,
        NOT: {
          authorId: userId
        }
      },
      include: {
        author: {
          select: {
            username: true,
            userfulldetails: {
              take: 1, // Take the first entry from the array
              select: {
                winRate: true,
                Ranking: true
              }
            }
          }
        }
      }
    });


    console.log("Potential Opponents:", potentialOpponents);

    if (potentialOpponents.length === 0) {
      const serachAlreadyFoundPlayer = await prisma.userAutomaticPairedDetails.findFirst({
        where: {
          opponentId: userId,
        },
      });
    
      const serachAlreadyMatchedOpponent = await prisma.totalAutomaticHistory.findFirst({
        where: {
          OR: [
            { playerOneUserName: username }, 
            { playerTwoUserName: username }
          ],
          status: "ongoing", // Only fetch ongoing games
        },
        orderBy: {
          startTime: 'desc', // Order by start time to get the latest game
        },
      });
    
      if (!serachAlreadyMatchedOpponent) {
        return NextResponse.json({ error: "No potential opponents found" }, { status: 404 });
      } else {
        // Identify the opponent based on the current user's username
        const opponentUsername = serachAlreadyMatchedOpponent.playerOneUserName === username
          ? serachAlreadyMatchedOpponent.playerTwoUserName
          : serachAlreadyMatchedOpponent.playerOneUserName;
    
        // Fetch opponent's full details, including win rate, ranking, etc.
        const opponent = await prisma.userFullDetails.findFirst({
          where: {
            author: {
              username: opponentUsername,
            },
          },
        });
    
        // Fetch the demo balance for the opponent
        const demoMoney = await prisma.partialDemoBalance.findUnique({
          where: { player: opponentUsername },
        });
    
        // Send the response with opponent details
        return NextResponse.json({
          oppname: opponentUsername,
          winrate: opponent?.winRate,
          ranking: opponent?.Ranking,
          oppDemoBalance: demoMoney?.demoBalance,
        }, { status: 200 });
      }
    }
    
    
    // Randomly choose an opponent from the list
    const randomOpponent = potentialOpponents[Math.floor(Math.random() * potentialOpponents.length)];

    // Ensure opponent details are available
    const opponentDetails = randomOpponent?.author?.userfulldetails[0];

    await prisma.$transaction([
      // Update userAutomaticPairedDetails for both users
      prisma.userAutomaticPairedDetails.update({
        where: { authorId: userId },
        data: { isPaired: true, opponentId: randomOpponent.authorId },
      }),
      prisma.userAutomaticPairedDetails.update({
        where: { authorId: randomOpponent.authorId },
        data: { isPaired: true, opponentId: userId },
      }),
    
      // Delete both entries from userAutomaticPairedDetails
      prisma.userAutomaticPairedDetails.delete({
        where: { authorId: userId },
      }),
      prisma.userAutomaticPairedDetails.delete({
        where: { authorId: randomOpponent.authorId },
      }),
    
      // Create only one entry in TotalAutomaticHistory
      // Check if `userId` is responsible for creating the entry
      ...(userId < randomOpponent.authorId
        ? [
            prisma.totalAutomaticHistory.create({
              data: {
                amount: randomOpponent.amount, 
                category: randomOpponent.category, 
                playerOneUserName: randomOpponent.author.username,
                playerTwoUserName: username, 
                status: "ongoing", 
                startTime: new Date(), 
              },
            }),
          ]
        : []), // If not, skip creating the entry
    ]);  

    const demoMoney = await prisma.partialDemoBalance.findUnique({
      where:{player:randomOpponent.author.username},
    })
    // Send both users' details (user and opponent) in the response
    return NextResponse.json({
          oppname: randomOpponent.author.username,
          winrate: opponentDetails.winRate,
          ranking: opponentDetails.Ranking,
          oppDemoBalance: demoMoney.demoBalance,
    }, { status: 201 });
  } catch (error) {
    // Safeguard error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error checking challenge pairing:", errorMessage);

    return NextResponse.json(
      { error: "Error occurred", details: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
