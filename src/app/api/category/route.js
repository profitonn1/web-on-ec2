// export const dynamic = "force-static"; 
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();
  const { categoryChosen, params } = body;
  const userId = params?.id;
  const username = params?.username;

  if (!userId || !username) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    let demoBalance = null;
    if (categoryChosen === "beginner") {
      demoBalance = 10000;
    } else if (categoryChosen === "plus") {
      demoBalance = 50000;
    } else if (categoryChosen === "pro") {
      demoBalance = 100000;
    }

    const demoBalanceRow = await prisma.partialDemoBalance.findFirst({
      where: {
        player: username,
      },
    });

    if (!demoBalanceRow) {
      await prisma.partialDemoBalance.create({
        data: {
          authorId: userId, 
          player: username,
          demoBalance: demoBalance,
        },
      });
    } else {
      await prisma.partialDemoBalance.update({
        where: { id: demoBalanceRow.id }, // Use a unique identifier
        data: {
          category: categoryChosen,
        },
      });
    }

    let category = await prisma.userAutomaticPairedDetails.findFirst({
      where: {
        authorId: userId,
      },
      include: {
        author: true,
      },
    });

    if (!category && categoryChosen) {
      category = await prisma.userAutomaticPairedDetails.create({
        data: {
          category: categoryChosen,
          authorId: userId,
        },
      });
    } else if (category && categoryChosen) {
      category = await prisma.userAutomaticPairedDetails.update({
        where: {
          id: category.id,
        },
        data: {
          category: categoryChosen,
        },
        include: {
          author: true,
        },
      });
    }

    return NextResponse.json({msg:"category updated"});
  } catch (error) {
    console.error("Error updating the category :", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("categoryChosen");
  const userId = searchParams.get('id');
  const username = searchParams.get('username');


  if (!userId || !username) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  if (!category) {
    return NextResponse.json({ error: "Missing categoryChosen parameter" }, { status: 400 });
  }

  try {

    
    const currentChallengersList = await prisma.userAutomaticPairedDetails.findMany({
      where: {
        category,
        authorId: {
          not: userId
        }
      },
      include: { author: true }
    });

    // console.log("Current Challengers List:", currentChallengersList);

    if (currentChallengersList.length > 0) {
      const challengeUserList = await prisma.userFullDetails.findMany({
        include: {
          author: {
            include: {
              challengeGameRangeDetails: true
            }
          }
        }
      });

      const responseData = currentChallengersList
        .map((challenger) => {
          const user = challengeUserList.find((u) => u.authorId === challenger.authorId);

          if (user?.author?.username && user.averageroc && user.winRate && user.Ranking) {
            return {
              username: user.author.username,
              averageroc: user.averageroc,
              winRate: user.winRate,
              ranking: user.Ranking
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      console.log("Response Data:", responseData);

      return NextResponse.json(responseData);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure the database connection is closed after the request
  }
}
