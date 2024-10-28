// export const dynamic = 'force-static';
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PUT(request) {
  try {
    const { id, newBalance } = await request.json()

    // Optional: Ensure newBalance is a number (if necessary)
    if (typeof newBalance !== "number") {
      return NextResponse.json(
        { error: "newBalance must be a number" },
        { status: 400 }
      )
    }

    // Update the user's balance
    const updatedUser = await prisma.userFullDetails.update({
      where: { authorId: id }, // Ensure that authorId is correct
      data: { balanceINR: newBalance }, // Ensure that newBalance is a number
      include: { author: true }
    })

    console.log("Updated User ID:", id)
    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    console.error("Error updating user balance:", error)
    return NextResponse.json(
      { error: "Failed to update balance" },
      { status: 500 }
    )
  }
}