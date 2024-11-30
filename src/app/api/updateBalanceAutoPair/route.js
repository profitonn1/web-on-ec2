import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const { id, newBalance } = await req.json();

    // Convert newBalance and id to strings if necessary
    const balanceToString = String(newBalance);
    const newID = String(id);

    // Update user balance in the database
    const updatedUser = await prisma.userFullDetails.update({
      where: { authorId: newID },
      data: { balanceINR: balanceToString },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user balance:", error);
    return NextResponse.json({ error: "Failed to update balance" }, { status: 500 });
  }finally {
    await prisma.$disconnect(); // Ensure the database connection is closed after the request
  }
}