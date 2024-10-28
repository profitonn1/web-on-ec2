// export const dynamic = "force-static"; 
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../lib/auth";
// import { tree } from "next/dist/build/templates/app-page";

export async function POST(request) {
   
    try{

      // Retrieve user details from the cookies in the request
      const userDetailsCookie = request.cookies.get('userDetails'); // Get the cookie

      // Check if the cookie exists and get its value
      const userDetails = userDetailsCookie ? userDetailsCookie.value : null; // Access the value

      console.log("User Details from Cookie:", userDetails);

      // Parse the user details from the cookie if it exists
      const parsedUserDetails = userDetails ? JSON.parse(userDetails) : null;

      if (!parsedUserDetails || !parsedUserDetails.id) {
        return NextResponse.json({
          error: "User not authenticated",
        }, { status: 401 });
      }
      const requestBody = await request.json();
      
      const parsedBody = JSON.parse(requestBody.body);
      const { username, betEndRange ,betStartRange,askStartRange , askEndRange } = parsedBody;

      const usercategory = await prisma.userCurrentPairedDetails.findFirst({
        where:{
          authorId:parsedUserDetails.id
        },
        include:{
          author:true
        }
      })


      if(parsedBody){
        const opponent = await prisma.user.findFirst({
            where: {
              username,
            }
          });
        
        console.log(opponent?.id)
        const isChallenger = await prisma.challengeGameRangeDetails.findFirst({
          where:{
            authorId:parsedUserDetails.id,
            opponentId:opponent?.id
          },
          include:{
            author:true
          }
        })
      

        console.log(isChallenger?.opponentId)
        if(!isChallenger){
           await prisma.challengeGameRangeDetails.create({
            data:{
              authorId: parsedUserDetails.id,
              betStartRange,
              betEndRange,
              askStartRange ,
              askEndRange,
              categoryChosen:usercategory?.category || "", 
              opponentId:opponent?.id || "",
            
            }
          })
        }

        if(isChallenger){
          return NextResponse.json({msg:"challenge already sent "},{status:404})
        }
        
      }else{
        return NextResponse.json({ msg:"error" }, { status: 500 })
      }
        return NextResponse.json('category');
    }catch(error){
      console.error("Error fetching user details:", error);
      return NextResponse.json({ error: "Error fetching user details" }, { status: 500 }); 
    }
}

