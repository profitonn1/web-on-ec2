import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Create a Prisma Client instance
const prisma = new PrismaClient();

export async function POST(request) {
    try {
      const body = await request.json();
      const { demoBalance, username, userId } = body;

        console.log("Received:", username, demoBalance, userId);

        // Check for missing parameters
        if (!demoBalance || !username || !userId) {
            console.error("Missing Params");
            return NextResponse.json({ error: "Some parameters are missing" }, { status: 400 });
        }

        // Ensure demoBalance is a valid number
        const parsedDemoBalance = parseFloat(demoBalance);
        if (isNaN(parsedDemoBalance)) {
            return NextResponse.json({ error: "Invalid demoBalance value" }, { status: 400 });
        }

        // Use upsert to handle both create and update operations
        await prisma.partialDemoBalance.upsert({
            where: { player: username },  // Match the player field
            update: {
                demoBalance: parsedDemoBalance,  // Update the balance if player exists
            },
            create: {
                player: username,
                demoBalance: parsedDemoBalance,
                authorId: userId,  // Create a new record if player doesn't exist
            },
        });

        // Return the updated demoBalance in the response
        return NextResponse.json({ msg: "Demo balance updated", demoBalance: parsedDemoBalance }, { status: 201 });

    } catch (error) {
        console.error("Error in backend:", error.message);
        return NextResponse.json({ error: "Error processing request" }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure disconnection in finally block
    }
}



export async function GET(request) {
    try {
      const { searchParams } = new URL(request.url);
      const username = searchParams.get('username');
  
      console.log("Received username:", username);
      
      // Check if required parameters are present
      if (!username) {
        console.error("Missing Params");
        return NextResponse.json({ error: "Some parameters are missing" }, { status: 401 });
      }
  
      // Fetch user balance from the database
      const findUser = await prisma.partialDemoBalance.findFirst({
        where: { player: username },
      });

      if (!findUser) {
        console.error("User not found or match is over.");
        return NextResponse.json({ error: "User not found or match is over" }, { status: 404 });
      }
  
      // console.log("Fetched demo balance:", findUser.player1DemoBalance);
   
      // Return the demo balance to the frontend
      return NextResponse.json({ demoBalance: findUser.demoBalance }, { status: 200 });
      
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ error: "Error processing request" }, { status: 500 });
    } finally {
      await prisma.$disconnect(); // Ensure disconnection in the finally block
    }
}
