import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { params } = body || {};

    if (!params) {
      return NextResponse.json({ error: "Missing params object" }, { status: 400 });
    }

    const {
      id: userId,
      username,
      units,
      openingprice,
      margin,
      leverage,
      amount,
      buyOrSell,
      symbol,
      openingTime,
      stopLossValue,
      takeProfitValue,
      pending,
      matchingTradeIds,
    } = params;

    console.log(userId,
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
      pending,
      matchingTradeIds)

    if (matchingTradeIds && matchingTradeIds.length > 0) {
      const trades = await prisma.userAllTrades.findMany({
        where: { id: { in: matchingTradeIds } },
      });

      if (trades.length > 0) {
        await prisma.userAllTrades.updateMany({
          where: { id: { in: matchingTradeIds } },
          data: { pending: false },
        });
        return NextResponse.json({ msg: "Pending Trade Placed" }, { status: 201 });
      } else {
        return NextResponse.json({ error: "No matching trade found" }, { status: 404 });
      }
    }

    if (!userId || !username || !openingprice || !buyOrSell || !symbol) {
      return NextResponse.json({ error: "Some essential parameters are missing" }, { status: 400 });
    }

    const roundedMargin = parseFloat(margin).toFixed(4);
    let orderData = {
      authorId: userId,
      symbol,
      openingprice,
      leverage,
      margin: parseFloat(roundedMargin),
      unitsOrLots: units,
      buyOrSell,
      amount,
      openingTime,
    };

    if (stopLossValue) orderData.stopLossValue = stopLossValue;
    if (takeProfitValue) orderData.takeProfitValue = takeProfitValue;
    if (pending) orderData.pending = pending;

    const placeOrder = await prisma.userAllTrades.create({ data: orderData });

    const userRecord = await prisma.playerTradingStyleDetails.findFirst({
      where: { authorId: userId },
    });

    if (!userRecord) {
      await prisma.playerTradingStyleDetails.create({
        data: {
          authorId: userId,
          symbol: JSON.stringify({ [symbol]: 1 }),
        },
      });
    } else {
      // Fix parsing issue
      let updatedsymbol;
      try {
        updatedsymbol = JSON.parse(userRecord.symbol || "{}");
      } catch (err) {
        console.error("Invalid JSON in userRecord.symbol. Resetting to empty object.");
        updatedsymbol = {}; // Fallback to empty object if parsing fails
      }

      updatedsymbol[symbol] = (updatedsymbol[symbol] || 0) + 1;

      await prisma.playerTradingStyleDetails.update({
        where: { id: userRecord.id },
        data: { symbol: JSON.stringify(updatedsymbol) },
      });
    }

    return NextResponse.json({ msg: "Trade Placed", trade: placeOrder }, { status: 201 });
  } catch (error) {
    console.error("Error processing pairing:", error);
    return NextResponse.json({ error: "Error processing pairing", details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
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
