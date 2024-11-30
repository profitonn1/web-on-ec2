import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { symbolPrice, symbol } = body;

    console.log("Symbol:", symbol, "Price:", symbolPrice);

    if (!symbolPrice || !symbol) {
      console.error("Missing Params");
      return NextResponse.json({ error: "Some parameters are missing" }, { status: 401 });
    }

   

    return NextResponse.json({ mag:"done"}, { status: 200 });

  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
