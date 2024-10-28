
export const dynamic = 'force-static';

import { NextResponse   } from "next/server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../lib/auth";

export async function POST(request) {
  const body = await request.json(); // Parse the JSON body
  const { categoryChosen, params } = body; // Destructure params from the body

  const userId = params.id; // Access userId from params
  const username = params.username; // Access username from params

  if (!userId || !username) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

    try{
      
        console.log(categoryChosen)

        const category = await prisma.userCurrentPairedDetails.findFirst({
            where: {
              authorId: userId,
            },
            include: {
              author: true,
            },
        });

        if(!category && categoryChosen){
           await prisma.userCurrentPairedDetails.create({
            data:{
              category:categoryChosen,
              authorId: userId,
            }
          })
        }

        if (category && categoryChosen) {
          await prisma.userCurrentPairedDetails.update({
            where: {
              id:category?.id, // Ensure session and  parsedUserDetails.id exist
            },
            data: {
              category:categoryChosen, // The updated categoryChosen field
            },
            include: {
              author: true, // Including the author in the response
            },
          });
        }

      
        return NextResponse.json(category);
    }catch(error){
      console.error("Error fetching user details:", error);
      return NextResponse.json({ error: "Error fetching user details" }, { status: 500 }); 
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

  // Check if categoryChosen is provided
  if (!category) {
    return NextResponse.json({ error: "Missing categoryChosen parameter" }, { status: 400 });
  }

  try {
    // Fetch current challengers
    const currentChallengersList = await prisma.userCurrentPairedDetails.findMany({
      where: {
        category,
        authorId: {
          not:  userId
        }
      },
      include: { author: true }
    });

    console.log("Current Challengers List:", currentChallengersList);

    if (currentChallengersList.length > 0) {
      // Fetch users' full details
      const challengeUserList = await prisma.userFullDetails.findMany({
        include: {
          author: {
            include: {
              challengeGameRangeDetails: true
            }
          }
        }
      });

      // Map through the list of current challengers and find matching users
      const responseData = currentChallengersList.map((challenger )=> {
        // Find user in the list of users with matching authorId
        const user = challengeUserList.find((u) => u.authorId === challenger.authorId);

        if (user?.author?.username) {
          return {
            // ranking: user.ranking, // Uncomment if ranking exists in user
            username: user.author.username, // Safely access the author's name
            averageroc: user.averageroc, // Access the fields directly from user
            winRate: user.winRate,
            ranking:user.Ranking
          };
        }
        return null; // Return null if no match is found
      }).filter((item) => item !== null); // Filter out null items

      console.log("Response Data:", responseData);

      // Return the response data
      return NextResponse.json(responseData);
    } else {
      // Return an empty array if no challengers are found
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
     
  
  // const currentChallengersList = await db.challengeGameRangeDetails.findMany({
  //   where: { 
  //     categoryChosen,
  //     authorId: {
  //       not:  parsedUserDetails.id,  // Ensure opponent is not the current user
  //     },
  //   },
  //   include: { author: true },
  // });
  
  
  // if (currentChallengersList.length > 0 ) {
  //   const challengeUserList = await db.u.findMany({
  //     include: {
  //       author: {
  //         include: {
  //           categoryDetails: true,  // Include related data from `categoryDetails`
  //         },
  //       },
  //     },
  //   });
  
  //   // Loop through the challengeUserList and find the matching currentChallengersList by authorId
  //   const responseData = challengeUserList.map(user => {
  //     const matchingCurrentChallenger = currentChallengersList.find(cu => cu.authorId === user.authorId);
  //     if(matchingCurrentChallenger?.author.username){
  //       return {
  //         ranking:user.ranking,
  //         name: matchingCurrentChallenger?.author.username,  // Safely access the author's name
  //         averageroc: user.averageroc,  // Access the fields directly from user
  //         winRate: user.winRate,
  //       };
  //     }
      
      
  //   });
  

    
  //  return NextResponse.json(responseData);
