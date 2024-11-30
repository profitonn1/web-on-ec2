// // export const dynamic = 'force-static';
// export const revalidate = 60; // Set a revalidation time in seconds

// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET(request) {
//   try {
//     // Extract search parameters from the request
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('id');
//     const username = searchParams.get('username');

//     // Validate user authentication
//     if (!userId || !username) {
//       return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
//     }

//     // Fetch challenge details for the user
//     const isChallenged = await prisma.challengeGameRangeDetails.findMany({
//       where: { authorId: userId },
//     });

//     // If challenges exist, process them
//     if (isChallenged.length > 0) {
//       try {
//         const responseData = await Promise.all(
//           isChallenged.map(async (challenger) => {
//             try {
//               const challengeToName = await prisma.user.findUnique({
//                 where: { id: challenger.opponentId || "" },
//               });

//               const ranking = await prisma.userFullDetails.findFirst({
//                 where: { authorId: challenger.authorId },
//               });

//               return {
//                 betStartRange: challenger.betStartRange,
//                 betEndRange: challenger.betEndRange,
//                 askStartRange: challenger.askStartRange,
//                 askEndRange: challenger.askEndRange,
//                 challengeToname: challengeToName?.username || "Unknown",
//                 ranking: ranking?.Ranking || "No ranking", // Fallback for ranking
//               };
//             } catch (error) {
//               console.error("Error fetching challenger details:", error);
//               return {
//                 askStartRange: challenger.askStartRange,
//                 askEndRange: challenger.askEndRange,
//                 challengeToname: "Unknown", // Handle unknown challenger
//                 ranking: "No ranking", // Provide fallback
//               };
//             }
//           })
//         );
//         return NextResponse.json({ data: responseData });
//       } catch (error) {
//         console.error("Error processing challenges:", error);
//         return NextResponse.json({ error: "Something went wrong while processing challenges." }, { status: 500 });
//       }
//     }

//     // Return message if no challenges were sent
//     return NextResponse.json({ msg: "No challenges sent." }, { status: 404 });

//   } catch (error) {
//     console.error("Error in API handler:", error); // Log the error for debugging
//     return NextResponse.json({ msg: "Internal server error", error: error.message }, { status: 500 });
//   } finally {
//     await prisma.$disconnect(); // Ensure Prisma client disconnects
//   }
// }




// export const dynamic = 'force-static';
export const revalidate = 60; // Set a revalidation time in seconds

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const username = searchParams.get('username');

    if (!userId || !username) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const isChallenged = await prisma.challengeGameRangeDetails.findMany({
      where: { authorId: userId },
    });

    if (isChallenged.length > 0) {
      try {
        const responseData = await Promise.all(
          isChallenged.map(async (challenger) => {
            try {
              const challengeToName = await prisma.user.findUnique({
                where: { id: challenger.opponentId || "" },
              });

              const ranking = await prisma.userFullDetails.findFirst({
                where: { authorId: challenger.authorId }
              });

              return {
                betStartRange: challenger.betStartRange,
                betEndRange: challenger.betEndRange,
                askStartRange: challenger.askStartRange,
                askEndRange: challenger.askEndRange,
                challengeToname: challengeToName?.username || "Unknown",
                ranking: ranking?.Ranking || "No ranking", // Provide a fallback for ranking
              };
            } catch (error) {
              console.error("Error fetching challenger details:", error);
              return {
                askStartRange: challenger.askStartRange,
                askEndRange: challenger.askEndRange,
                challengeToname: "Unknown", // Handle the case where the user is not found
                ranking: "No ranking", // Provide fallback
              };
            }
          })
        );
        return NextResponse.json({ data: responseData });
      } catch (error) {
        console.error("Error processing challenges:", error);
        return NextResponse.json({ error: "Something went wrong while processing challenges." });
      }
    }

    return NextResponse.json({ msg: "No challenge sent" });
  } catch (error) {
    console.error("Error in API handler:", error); // Log the error for debugging
    return NextResponse.json({ msg: "Internal server error", error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client disconnects
  }
}
