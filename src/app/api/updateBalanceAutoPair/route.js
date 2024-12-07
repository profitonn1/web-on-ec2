import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const { id, newBalance } = await req.json();

    if (!id || newBalance == null) {
      return NextResponse.json(
        { error: 'ID and newBalance are required' },
        { status: 400 }
      );
    }

    const balanceToString = String(newBalance); // Ensure balance is in string format

    // Perform both updates in a single transaction
   
      const checkPayment = await prisma.userAutomaticPairedDetails.findFirst({
        where:{authorId:id}
      })

      if(checkPayment && checkPayment.paid_us===false){
        const [updatedUser, paymentUpdate] = await prisma.$transaction([
        prisma.userFullDetails.update({
          where: { authorId: id },
          data: { balanceINR: balanceToString },
        }),
        prisma.userAutomaticPairedDetails.update({
          where: { authorId: id },
          data: { paid_us: true },
        }),
      ]);
        return NextResponse.json(
          {
            message: 'User balance and payment status updated successfully',
            updatedUser,
            paymentUpdate,
          },
          { status: 200 }
        );
      }
      else{
        return NextResponse.json({msg:"User already paid, redirect to autopairing page"},{status:201})
      }
   
   
  } catch (error) {
    console.error('Error updating user details:', error);
    return NextResponse.json(
      { error: 'Failed to update details. Please try again.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
