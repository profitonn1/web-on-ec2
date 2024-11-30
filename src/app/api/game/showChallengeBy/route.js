// // export const dynamic = 'force-static';
// export const revalidate = 60; // Set a revalidation time in seconds
// import { NextResponse, NextRequest } from "next/server";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// export async function GET(request) {
//   try {
//     // Extract user details from the request headers or cookies
//     const userDetailsCookie = request.cookies.get('userDetails');
//     const userDetails = userDetailsCookie ? JSON.parse(userDetailsCookie.value) : null;

//     if (!userDetails || !userDetails.id || !userDetails.username) {
//       return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
//     }

//     const userId = userDetails.id;

//     // Fetch challenges for the authenticated user
//     const isChallenged = await prisma.challengeGameRangeDetails.findMany({
//       where: {
//         opponentId: userId, // Retrieve challenges where this user is the opponent
//       },
//     });

//     if (isChallenged.length > 0) {
//       try {
//         // Use Promise.all to handle the async operations inside the map
//         const responseData = await Promise.all(
//           isChallenged.map(async (challenger) => {
//             try {
//               // Fetch the challenger name asynchronously
//               const challengerName = await prisma.user.findUnique({
//                 where: { id: challenger.authorId },
//               });
//               const ranking = await prisma.userFullDetails.findFirst({
//                 where: { authorId: challenger.authorId },
//               });

//               // Return the mapped object including the username and ranking
//               return {
//                 askStartRange: challenger.askStartRange,
//                 askEndRange: challenger.askEndRange,
//                 challengerName: challengerName?.username || "Unknown",
//                 ranking: ranking?.Ranking || "No ranking available",
//               };
//             } catch (error) {
//               console.error("Error fetching challenger name:", error);
//               return {
//                 askStartRange: challenger.askStartRange,
//                 askEndRange: challenger.askEndRange,
//                 challengerName: "Unknown",
//                 ranking: "Error fetching ranking",
//               };
//             }
//           })
//         );
//         return NextResponse.json({ data: responseData });
//       } catch (error) {
//         console.error("Error mapping challenges:", error);
//         return NextResponse.json({ error: "Something went wrong while processing challenges" });
//       }
//     }

//     return NextResponse.json({ msg: "No challenges found" });
//   } catch (error) {
//     console.error("Error in GET challenge retrieval:", error);
//     return NextResponse.json({ msg: "Error retrieving challenges", error });
//   } finally {
//     await prisma.$disconnect(); // Ensure the database connection is closed after the request
//   }
// }


// export const dynamic = 'force-static';
export const revalidate = 60; // Set a revalidation time in seconds
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Retrieve user details from the cookies in the request
    const userDetailsCookie = request.cookies.get('userDetails');
    const userDetails = userDetailsCookie ? JSON.parse(userDetailsCookie.value) : null;

    if (!userDetails || !userDetails.id || !userDetails.username) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const userId = userDetails.id;

    // Fetch challenges where this user is the opponent
    const isChallenged = await prisma.challengeGameRangeDetails.findMany({
      where: {
        opponentId: userId,
      },
      include: {
        author: true, // Ensure you are including the author details
      },
    });

    if (isChallenged.length > 0) {
      const responseData = isChallenged.map((challenger) => ({
        askStartRange: challenger.askStartRange,
        askEndRange: challenger.askEndRange,
        challengerName: challenger.author.username || "Unknown", // Get the username from the included author
      }));

      return NextResponse.json({ data: responseData });
    }

    return NextResponse.json({ msg: "No challenges found" });
  } catch (error) {
    console.error("Error in GET challenge retrieval:", error);
    return NextResponse.json({ msg: "Error retrieving challenges", error });
  } finally {
    await prisma.$disconnect(); // Ensure the database connection is closed after the request
  }
}
