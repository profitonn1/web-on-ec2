// export const dynamic = 'force-static';
export const revalidate = 60; // Set a revalidation time in seconds


import { NextResponse ,NextRequest} from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()


export async function GET (request){
    
  
    try{

      const body = await request.json(); // Parse the JSON body
      const { id: userId, username } = body;
      if (!userId || !username) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
      }
        const isChallenged = await prisma.challengeGameRangeDetails.findMany({
            where:{
                opponentId:userId
            },
        })
        
        if (isChallenged.length > 0) {
            try {
              // Use Promise.all to handle the async operations inside the map
              const responseData = await Promise.all(
                isChallenged.map(async (challenger) => {
                  // Fetch the challenger name asynchronously and log the result
                  try {
                    const challengerName = await prisma.user.findUnique({
                      where: { id: challenger.authorId },
                    });
                    const ranking = await prisma.userFullDetails.findFirst({
                        where:{authorId:challenger.authorId}
                    })
                    // Return the mapped object including the username
                    return {
                      askStartRange: challenger.askStartRange,
                      askEndRange: challenger.askEndRange,
                      challengername: challengerName?.username || "Unknown", 
                      ranking:ranking?.Ranking // Fallback in case username is not found
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
          
          return NextResponse.json({ msg: "nochallenge" });
          
          
    }catch(error){
        return NextResponse.json({msg:"error",error})
    }
}