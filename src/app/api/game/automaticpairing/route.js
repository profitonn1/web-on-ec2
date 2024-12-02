export const dynamic = 'force-static';

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()


export async function POST(request) {
  // const session = await getServerSession(authOptions);
  try {
     // Parse the JSON body
     const body = await request.json();

     // Destructure from `params`
     const { userId, username, amount } = body;
 
 console.log(userId , username , amount )
     // Validate the required fields
     if (!userId || !username || !amount) {
       return NextResponse.json(
         { error: "Missing required fields" },
         { status: 400 }
       );
     }


    // Check if the user has already participated in a game
    const userAutomaticPairedDetails = await prisma.userAutomaticPairedDetails.findFirst({
      where: {
        authorId: userId
      },
      include: {
        author: true,
      },
    });


    // If the user hasn't participated yet, create a new game entry
    if (userAutomaticPairedDetails?.isPaired=== false) {
      const potentialOpponents = await prisma.userAutomaticPairedDetails.findMany({
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
        return NextResponse.json({ message: "No opponent found with the same amount." }, { status: 404});
      }

      await prisma.$transaction(async (tx) => {
        await tx.userAutomaticPairedDetails.update({
          where: { authorId: userId},
          data: {
            isPaired: true,
            opponentId: opponent?.authorId
          }
        });
      
        await tx.userAutomaticPairedDetails.update({
          where: { authorId: opponent.authorId },
          data: {
            isPaired: true,
            opponentId: userId
          }
        });
      });
      console.log(opponent)
      return NextResponse.json({ data: opponent}, { status: 201});
    } 
    if(userAutomaticPairedDetails?.isPaired=== true) {
      return NextResponse.json({ data: userAutomaticPairedDetails }, { status: 201 });
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
    
    const { searchParams } = new URL(request.url); // Correct way to get query parameters in Next.js API
    const id = searchParams.get('id');
    const username = searchParams.get('username');
    const amount = searchParams.get('amount');

    // Log the extracted parameters to verify
    console.log("ID:", id); // Check if you are getting the ID
    console.log("Username:", username); // Check if you are getting the username
    console.log("Amount:", amount); // Check if you are getting the amount
    console.log(request.url)
    // const username = searchParams.get('username');
    // const amount = searchParams.get('amount');
 
    // if (!id || !username || !amount) {
    //   return NextResponse.json(
    //     { error: "Missing required fields" },
    //     { status: 400 }
    //   );
    // }

    // // Fetch the user's pairing details
    // const user = await prisma.userAutomaticPairedDetails.findFirst({
    //   where: { authorId: id },
    // });

    // if (!user || !user.opponentId) {
    //   return NextResponse.json({ error: "User or opponent not found" }, { status: 404 });
    // }

    // // Ensure opponentId is not null
    // if (user.opponentId !== null) {
    //   const opponentname = await prisma.user.findUnique({
    //     where: { id: user.opponentId }, // No need for type casting since null is already checked
    //   });

    //   const opponentDetails = await prisma.userFullDetails.findFirst({
    //     where: { authorId: user.opponentId }, // Safe to use after null check
    //   });

    //   return NextResponse.json({
    //     oppname: opponentname?.username || "",
    //     winrate: opponentDetails?.winRate || "",
    //     ranking: opponentDetails?.Ranking || "",
    //   });
 
    // }
    return NextResponse.json({msg:"hello"})
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: "Error fetching user details" }, { status: 500 });
  }finally {
    await prisma.$disconnect(); // Ensure the database connection is closed after the request
  }
}


