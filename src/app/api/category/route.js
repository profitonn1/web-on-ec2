// export const dynamic = "force-static"; 
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json(); 
  const { categoryChosen, params } = body;
  const userId = params.id;
  const username = params.username;

  if (!userId || !username) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    console.log(categoryChosen);

    const category = await prisma.userCurrentPairedDetails.findFirst({
      where: {
        authorId: userId,
      },
      include: {
        author: true,
      },
    });

    // Create new category if it doesn't exist
    if (!category && categoryChosen) {
      const newCategory = await prisma.userCurrentPairedDetails.create({
        data: {
          category: categoryChosen,
          authorId: userId,
        }
      });
      return NextResponse.json(newCategory);
    }

    // Update existing category
    if (category && categoryChosen) {
      const updatedCategory = await prisma.userCurrentPairedDetails.update({
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
      return NextResponse.json(updatedCategory);
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: "Error fetching user details" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure the database connection is closed after the request
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
    const currentChallengersList = await prisma.userCurrentPairedDetails.findMany({
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
