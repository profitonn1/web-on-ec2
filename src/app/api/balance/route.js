
// export const dynamic = "force-static"; 
export const revalidate = 60; // Set a revalidation time in seconds

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;

export async function GET(request) {

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
    const username = searchParams.get("username");

    console.log(`Received request with userId: ${userId}, username: ${username}`);

    if (!userId || !username) {
      console.error("Missing userId or username");
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const userFullDetails = await prisma.userFullDetails.findFirst({
      where: {
        authorId: userId,
      },
      include: {
        author: true,
      },
    });

    console.log("Fetched userFullDetails:", userFullDetails);

    if (!userFullDetails) {
      console.error("No userFullDetails found for userId:", userId);
      return NextResponse.json({
        username: username || "",
        joinedDate: "",
        nooftimespaired: "0",
        averageroc: "0",
        balanceINR: "0",
        Ranking: "Null",
      });
    }

    return NextResponse.json({
      username: userFullDetails.author.username || "",
      joinedDate: userFullDetails.author.joinedDate || "",
      nooftimespaired: userFullDetails.nooftimespaired || "0",
      averageroc: userFullDetails.averageroc || "0",
      balanceINR: userFullDetails.balanceINR || "0",
      Ranking: userFullDetails.Ranking || "Null",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching user details: ${error.message}`);
      return NextResponse.json({ error: `Error fetching user details: ${error.message}` }, { status: 500 });
    } else {
      console.error('Unknown error occurred');
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
    }
  }
}
