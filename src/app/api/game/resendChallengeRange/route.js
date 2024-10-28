// export const dynamic = 'force-static';
export const revalidate = 60; // Set a revalidation time in seconds

import { NextResponse ,NextRequest} from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export async function POST(request) {
   

    try {

      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('id');
      const username = searchParams.get('username');
  
      if (!userId || !username) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
      }
        const requestBody = await request.json();
        const { challengedby, betEndRange2, betStartRange2, askStartRange2, askEndRange2 } = requestBody;

        console.log('Received Data:', challengedby, betEndRange2, betStartRange2, askStartRange2, askEndRange2);

        const challengedbyUser = await prisma.user.findUnique({
            where: {
                username: challengedby
            }
        });
        console.log('challengedbyUser:', challengedbyUser);

        const challengedRangeDataEntry = await prisma.challengeGameRangeDetails.findFirst({
            where: {
                authorId: challengedbyUser?.id,
                opponentId: userId
            }
        });
        console.log('challengedRangeDataEntry:', challengedRangeDataEntry);

        const resendChallengeData = await prisma.challengeResendGameRangeDetails.findFirst({
            where: {
                authorId: challengedRangeDataEntry?.id
            }
        });
        
        if (!resendChallengeData && challengedRangeDataEntry) {
            await prisma.challengeResendGameRangeDetails.create({
                data: {
                    authorId: challengedRangeDataEntry.id,
                    betStartRange2,
                    betEndRange2,
                    askStartRange2,
                    askEndRange2,
                }
            });

            return NextResponse.json({ msg: "Range Data Resend done" }, { status: 201 });
        } else {
            return NextResponse.json({ msg: "Data Already Sent to this Challenger" }, { status: 400 });
        }
    } catch (error) {
        console.error('Error:', error); // Log the error
        return NextResponse.json({ msg: "Error occurred", error: error }, { status: 500 });
    }
}


export async function GET (request){

    try{
        
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('id');
      const username = searchParams.get('username');
  
      if (!userId || !username) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
      }
        const challengerid = await prisma.challengeGameRangeDetails.findMany({
            where:{authorId:userId}
        })
        
        if (challengerid.length > 0) {
            try {
              // Use Promise.all to handle the async operations inside the map
              const responseData = await Promise.all(
                challengerid.map(async (challenger) => {
                  // Fetch the challenger name asynchronously and log the result
                  try {
                    // const challengeToName = await db.user.findUnique({
                    //     where: { id: challenger.opponentId || ""},
                    //   });
  
                    //     //   const ranking = await db.userFullDetails.findFirst({
                    //     //       where:{authorId:challenger.authorId}
                    //     //   })
  
                      const resentdata = await prisma.challengeResendGameRangeDetails.findFirst({
                          where:{authorId:challenger.id}
                      })
  

                    // Return the mapped object including the username
                    return {
                        betStartRange2: resentdata?.betStartRange2,
                        betEndRange2: resentdata?.betEndRange2,
                        askStartRange2: resentdata?.askStartRange2,
                        askEndRange2: resentdata?.askEndRange2,
                  
                    };
                  } catch (error) {
                    console.error("Error fetching challenger name:", error);  // Catch any errors
                    return {
                      askStartRange: challenger.askStartRange,
                      askEndRange: challenger.askEndRange,
                      username: "Unknown",  // Handle the case where the user is not found
                    };
                  }
                })
              );
              return NextResponse.json({ data: responseData });
            } catch (error) {
              console.error("Error mapping challenges:", error);
              return NextResponse.json({ error: "Something went wrong" });
            }
          }
          
          return NextResponse.json({ msg: "nochallengeSent" });
          
          
    }catch(error){
        return NextResponse.json({msg:"error",error})
    }
}