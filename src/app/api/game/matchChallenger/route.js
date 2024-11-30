// export const dynamic = "force-static"; 
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request) {
  try {

    const requestBody = await request.json();
    const { data, data2 , userId, username} = requestBody;

    console.log("id",userId , data)

    if (!userId || !username) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

  

    const rangeIntersection = (range1, range2) => {
      const [start1, end1] = range1;
      const [start2, end2] = range2;

      // Find the intersection range
      const intersectionStart = Math.max(start1, start2);
      const intersectionEnd = Math.min(end1, end2);

      // If there's an intersection, return the intersection range
      if (intersectionStart <= intersectionEnd) {
        return [intersectionStart, intersectionEnd];
      }

      // If there's no intersection, return null
      return null;
    };

    const bet1 = [data.betStartRange, data.betEndRange];
    const ask2 = [data2.askStartRange2, data2.askEndRange2];
    const bet2 = [data2.betStartRange2, data2.betEndRange2];
    const ask1 = [data.askStartRange, data.askEndRange];

    const intersection1 = rangeIntersection(bet1, ask2);
    const intersection2 = rangeIntersection(ask1, bet2);

    if (intersection1 !== null && intersection2 !== null) {
      const challengerBet = Math.floor(
        (intersection1[0] + intersection1[1]) / 2
      );
      const opponentBet = Math.floor((intersection2[0] + intersection2[1]) / 2);

      console.log(data.challengeToname);

      const challengedTo = await prisma.user.findUnique({
        where: {
          username: data.challengeToname,
        },
      });

      if (challengedTo) {
        const opponent = await prisma.challengeGameRangeDetails.findMany({
          where: {
            opponentId: challengedTo.id,
          },
        });

        const challenger = await prisma.challengeGameRangeDetails.findMany({
          where: {
            authorId: userId,
          },
        });

        const match = await prisma.challengeGameRangeDetails.findFirst({
          where: {
            opponentId: challengedTo.id,
            authorId: userId,
          },
        });

        console.log("opponent", opponent);
        console.log("match", match);

        let shouldUpdatePaired = true; // Flag to track if all conditions are met

        for (let i = 0; i < challenger?.length; i++) {
          for (let j = 0; j < opponent?.length; j++) {
            // Log for debugging purposes
            console.log(challenger[i], opponent[j]);

            // If any of the conditions fail, set the flag to false
            if (
              opponent[j]?.paired === true ||
              challenger[i]?.paired === true ||
              match?.paired === true
            ) {
              shouldUpdatePaired = false;
              break; // Exit the inner loop if condition is not met
            }
          }

          // If the flag is false, no need to continue checking further challengers
          if (!shouldUpdatePaired) {
            break;
          }
        }

        // If the flag is still true, meaning all conditions were met, update paired to true
        if (shouldUpdatePaired) {
          await prisma.challengeGameRangeDetails.update({
            where: {
              id: match?.id,
            },
            data: {
              paired: true,
            },
          });
          return NextResponse.json(
            { challengerBet, intersection1, intersection2, opponentBet },
            { status: 201 }
          );
        } else {
          return NextResponse.json({ error: "Already Paired" }, { status: 404 });
        }
      }

      return NextResponse.json(
        { challengerBet, intersection1, intersection2, opponentBet },
        { status: 201 }
      );
    }

    return NextResponse.json({ msg: "No Common Price Range " }, { status: 401 });
  } catch (error) {
    console.error("Error:", error); // Log the error
    return NextResponse.json(
      { msg: "Error occurred", error: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Ensure the database connection is closed after the request
  }
}
