import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Create a Prisma Client instance
const prisma = new PrismaClient();

export async function POST(request) {
    try {
      const body = await request.json();
      const { demoBalance, username, userId } = body;

        if(demoBalance){
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
      }
      else{
        const demoBalanceRow = await prisma.partialDemoBalance.findFirst({
          where:{player:username},
        })

       if(demoBalanceRow){
        await prisma.partialDemoBalance.update({
          where:{id:demoBalanceRow.id},
          data:{category:null}
        })
       }
       if(!demoBalanceRow){
        await prisma.partialDemoBalance.create({
          data:{category:null,
            authorId:userId,
            player:username,
            demoBalance:10000,
          }
        })
       }

       return NextResponse.json({msg:"category changed to null"})
      }
    } catch (error) {
        console.error("Error in backend:", error.message);
        return NextResponse.json({ error: "Error processing request" }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure disconnection in finally block
    }
}



export async function GET(request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    // Check if `username` is provided
    if (!username) {
      console.error("Missing 'username' parameter.");
      return NextResponse.json({ error: "Missing 'username' parameter." }, { status: 401 });
    }

    // Fetch the user's demo balance from the database
    const findUser = await prisma.partialDemoBalance.findFirst({
      where: { player: username },
    });

    // Handle case where user is not found
    if (!findUser) {
      console.error("User not found or demo balance not set.");
      return NextResponse.json({ error: "User not found or demo balance not set." }, { status: 404 });
    }

    // Return the demo balance and category
    return NextResponse.json(
      {
        demoBalance: findUser.demoBalance,
        category: findUser.category || "null", // Default to "null" if category is not set
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure database connection is closed
  }
}
