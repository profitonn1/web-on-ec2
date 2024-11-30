export const dynamic = 'force-static';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../../lib/auth";
// import { Session } from "inspector/promises";

export async function POST(request) {
  // const session = await getServerSession(authOptions);
  try {
     // Parse the JSON body
     const body = await request.json();

     // Destructure from `params`
     const { params } = body;
     const { id: userId, username, amount } = params;

     console.log(userId , username , amount )
 
     // Validate the required fields
     if (!userId || !username || !amount) {
       return NextResponse.json(
         { error: "Missing required fields" },
         { status: 400 }
       );
     }


    // Check if the user has already participated in a game
    const userCurrentPairedDetails = await prisma.userCurrentPairedDetails.findFirst({
      where: {
        authorId: userId
      },
      include: {
        author: true,
      },
    });

    // If the user hasn't participated yet, create a new game entry
    if (userCurrentPairedDetails?.isPaired=== false) {
      const potentialOpponents = await prisma.userCurrentPairedDetails.findMany({
        where: {
          amount,
          isPaired:false,
          NOT: {
            authorId: userId // Exclude the current user
          },
        },
      });

      // If there are any potential opponents, pick one at random
      let opponent = null;
      if (potentialOpponents.length > 0) {
        const randomIndex = Math.floor(Math.random() * potentialOpponents.length);
        opponent = potentialOpponents[randomIndex];
      }

      // If no opponent found, return a message indicating that
      if (!opponent) {
        return NextResponse.json({ message: "No opponent found with the same amount." }, { status: 404 });
      }
      await prisma.$transaction(async (tx) => {
        await tx.userCurrentPairedDetails.update({
          where: { authorId: userId},
          data: {
            isPaired: true,
            opponentId: opponent?.authorId
          }
        });
      
        await tx.userCurrentPairedDetails.update({
          where: { authorId: opponent.authorId },
          data: {
            isPaired: true,
            opponentId: userId
          }
        });
      });
      return NextResponse.json({ data: opponent }, { status: 201 });
    } else {
      return NextResponse.json({ data: userCurrentPairedDetails }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: "Error fetching user 1 details" }, { status: 500 });
  }finally {
    await prisma.$disconnect(); // Ensure the database connection is closed after the request
  }
}


export async function GET(request) {
  try {
    // Get query parameters from the URL
    const userId = request.nextUrl.searchParams.get("id");
    const username = request.nextUrl.searchParams.get("username");
    const amount = request.nextUrl.searchParams.get("amount");

    console.log(userId, "hi");

    // Validate the required fields
    if (!userId || !username || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch the user's pairing details
    const user = await prisma.userCurrentPairedDetails.findFirst({
      where: { authorId: userId },
    });

    if (!user || !user.opponentId) {
      return NextResponse.json({ error: "User or opponent not found" }, { status: 404 });
    }

    // Ensure opponentId is not null
    if (user.opponentId !== null) {
      const opponentname = await prisma.user.findUnique({
        where: { id: user.opponentId }, // No need for type casting since null is already checked
      });

      const opponentDetails = await prisma.userFullDetails.findFirst({
        where: { authorId: user.opponentId }, // Safe to use after null check
      });

      return NextResponse.json({
        oppname: opponentname?.username || "",
        winrate: opponentDetails?.winRate || "",
        ranking: opponentDetails?.Ranking || "",
      });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: "Error fetching user details" }, { status: 500 });
  }finally {
    await prisma.$disconnect(); // Ensure the database connection is closed after the request
  }
}














// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function POST(request) {
//   try {
//     // Parse the JSON body
//     const body = await request.json();
//     const { params } = body;
//     const { id: userId, username, amount } = params;

//     console.log(userId, username, amount);

//     // Validate required fields
//     if (!userId || !username || !amount) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Check if the user has already participated in a game
//     const userCurrentPairedDetails = await prisma.userCurrentPairedDetails.findFirst({
//       where: {
//         authorId: userId
//       },
//       include: {
//         author: true,
//       },
//     });

//     // If the user hasn't participated yet, create a new game entry
//     if (userCurrentPairedDetails?.isPaired === false) {
//       const potentialOpponents = await prisma.userCurrentPairedDetails.findMany({
//         where: {
//           amount,
//           isPaired: false,
//           NOT: {
//             authorId: userId // Exclude the current user
//           },
//         },
//       });

//       // Pick a random opponent if any exist
//       let opponent = null;
//       if (potentialOpponents.length > 0) {
//         const randomIndex = Math.floor(Math.random() * potentialOpponents.length);
//         opponent = potentialOpponents[randomIndex];
//       }

//       // If no opponent found, return a message
//       if (!opponent) {
//         return NextResponse.json({ message: "No opponent found with the same amount." }, { status: 404 });
//       }

//       // Update user pairing details in a transaction
//       await prisma.$transaction(async (tx) => {
//         await tx.userCurrentPairedDetails.update({
//           where: { authorId: userId },
//           data: {
//             isPaired: true,
//             opponentId: opponent?.authorId,
//           }
//         });

//         await tx.userCurrentPairedDetails.update({
//           where: { authorId: opponent.authorId },
//           data: {
//             isPaired: true,
//             opponentId: userId,
//           }
//         });
//       });

//       return NextResponse.json({ data: opponent }, { status: 201 });
//     } else {
//       return NextResponse.json({ data: userCurrentPairedDetails }, { status: 200 });
//     }
//   } catch (error) {
//     console.error("Error processing pairing:", error);
//     return NextResponse.json({ error: "Error processing pairing" }, { status: 500 });
//   } finally {
//     await prisma.$disconnect(); // Ensure Prisma client disconnects
//   }
// }

// export async function GET(request) {
//   try {
//     // Get query parameters from the URL
//     const userId = request.nextUrl.searchParams.get("id");
//     const username = request.nextUrl.searchParams.get("username");
//     const amount = request.nextUrl.searchParams.get("amount");

//     console.log(userId, "hi");

//     // Validate required fields
//     if (!userId || !username || !amount) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Fetch the user's pairing details
//     const user = await prisma.userCurrentPairedDetails.findFirst({
//       where: { authorId: userId },
//     });

//     if (!user || !user.opponentId) {
//       return NextResponse.json({ error: "User or opponent not found" }, { status: 404 });
//     }

//     // Fetch opponent details if opponentId is valid
//     const opponentname = await prisma.user.findUnique({
//       where: { id: user.opponentId },
//     });

//     const opponentDetails = await prisma.userFullDetails.findFirst({
//       where: { authorId: user.opponentId },
//     });

//     return NextResponse.json({
//       oppname: opponentname?.username || "Unknown",
//       winrate: opponentDetails?.winRate || "No win rate",
//       ranking: opponentDetails?.Ranking || "No ranking",
//     });
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     return NextResponse.json({ error: "Error fetching user details" }, { status: 500 });
//   } finally {
//     await prisma.$disconnect(); // Ensure Prisma client disconnects
//   }
// }
