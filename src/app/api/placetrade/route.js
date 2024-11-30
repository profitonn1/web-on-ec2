import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Create a Prisma Client instance
const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { params } = body;
        const { 
            id: userId, 
            username, 
            units, 
            openingprice, 
            margin, 
            amount, 
            buyOrSell, 
            symbol, 
            openingTime, 
            stopLossValue, 
            takeProfitValue, 
            stopLossActive, 
            takeProfitActive, 
            selectButton 
        } = params;

        console.log(userId, username, openingprice, units, margin, buyOrSell, symbol, openingTime, stopLossValue, takeProfitValue, stopLossActive, takeProfitActive, selectButton);

        // Check for missing essential parameters
        if (!userId || !username || !openingprice || !buyOrSell || !symbol) {
            console.error("Missing Params");
            return NextResponse.json({ error: "Some parameters are missing" }, { status: 401 });
        }

        // Round the margin to 4 decimal places
        const roundedMargin = parseFloat(margin).toFixed(4);

        // Initialize data to be inserted into the database
        let orderData = {
            authorId: userId,
            symbol,
            openingprice,
            margin: parseFloat(roundedMargin),
            unitsOrLots: units,
            buyOrSell,
            amount,
            openingTime,
        };

        // Conditionally add stopLossValue if stopLossActive is true and selectButton is changed
        if (stopLossValue) {
            orderData.stopLossValue = stopLossValue;
        }
        
        
        // Conditionally add takeProfitValue if takeProfitActive is true and selectButton is changed
        if (takeProfitValue) {
            orderData.takeProfitValue = takeProfitValue;
        }

        // Create the trade entry in the database
        const placeOrder = await prisma.userAllTrades.create({
            data: orderData,
        });

        const userRecord = await prisma.playerTradingStyleDetails.findFirst({
          where:{authorId:userId}
        })

        if(!userRecord){
          await prisma.playerTradingStyleDetails.create({
            data:{
              authorId:userId,
              symbol:{
                [symbol]:1
              }
            }
          })
        }else {
          // If record exists, parse the Indicators field and update it
          const updatedsymbol = { ...userRecord.symbol };
          updatedsymbol[symbol] = (updatedsymbol[symbol] || 0) + 1;
    
          await prisma.playerTradingStyleDetails.update({
            where: { id: userRecord.id },
            data: { symbol: updatedsymbol },
          });
        }

        return NextResponse.json({ msg: "Trade Placed" }, { status: 201 });

    } catch (error) {
        console.error("Error processing pairing:", error);
        return NextResponse.json({ error: "Error processing pairing" }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure disconnection in finally block
    }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const username = searchParams.get('username');

    console.log(userId, username);
    
    // Check if required parameters are present
    if (!userId || !username) {
      console.error("Missing Params");
      return NextResponse.json({ error: "Some parameters are missing" }, { status: 401 });
    }

    // Fetch trades from the database
    const trades = await prisma.userAllTrades.findMany({
      where: { authorId: userId }
    });

    // Return the trades list to the frontend
    return NextResponse.json({ trades }, { status: 200 });
  } catch (error) {
    console.error("Error processing pairing:", error);
    return NextResponse.json({ error: "Error processing pairing" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure disconnection in the finally block
  }
}
