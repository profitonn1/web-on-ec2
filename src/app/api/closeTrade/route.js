import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { params } = body;
        const { userId, username, tradeId, profitOrLoss, closingPrice } = params;

        console.log("Received params:", params);

        // Check for missing parameters
        if (!userId || !username || !tradeId || profitOrLoss === undefined || profitOrLoss === null) {
            console.error("Missing Params");
            return NextResponse.json({ error: "Some parameters are missing" }, { status: 400 });
        }

        const profitLoss = parseFloat(profitOrLoss);
        
        if (isNaN(profitLoss)) {
            console.error("Invalid profitOrLoss value");
            return NextResponse.json({ error: "Invalid profitOrLoss value" }, { status: 400 });
        }

        // Log the trade before updating
        console.log("Updating trade with tradeId:", tradeId);

        // Update the trade with closing time and profitOrLoss
        const updatedTrade = await prisma.userAllTrades.update({
            where: { id: tradeId },
            data: {
                closingTime: new Date(),
                profitOrLoss: profitLoss,
                closingPrice: closingPrice,
            },
        });

        console.log("Updated trade:", updatedTrade);

        return NextResponse.json({ msg: "Trade Closed" }, { status: 200 });

    } catch (error) {
        console.error("Error processing pairing:", error);
        return NextResponse.json({ error: "Error processing pairing", details: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure disconnection in finally block
    }
}




export async function GET(request) {
    try {
        const body = await request.json();
        const { params } = body;
        const { userId, username, tradeId, profitOrLoss,  } = params;

        console.log(userId, username, tradeId, profitOrLoss, );

        // Check for missing parameters
        if (!userId || !username || !tradeId || profitOrLoss === undefined || profitOrLoss === null ) {
            console.error("Missing Params");
            return NextResponse.json({ error: "Some parameters are missing" }, { status: 400 });
        }

        const profitLoss = parseFloat(profitOrLoss);
        
        // Check if profitOrLoss is a valid number
        if (isNaN(profitLoss)) {
            console.error("Invalid profitOrLoss value");
            return NextResponse.json({ error: "Invalid profitOrLoss value" }, { status: 400 });
        }

        // Update the trade with closing time and profitOrLoss
        const updatedTrade = await prisma.userAllTrades.update({
            where: { id: tradeId },
            data: {
                closingTime: new Date(),
                profitOrLoss: profitLoss,
            },
        });

        // Return the updated demoBalance in the response
        return NextResponse.json({ msg: "Trade Placed"}, { status: 200 });

    } catch (error) {
        console.error("Error processing pairing:", error);
        return NextResponse.json({ error: "Error processing pairing", details: error.message }, { status: 500 });

    } finally {
        await prisma.$disconnect(); // Ensure disconnection in finally block
    }
}


