import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const { id, newBalance, amount , category } = await req.json();

    if (!id || newBalance == null || amount == null) {
      return NextResponse.json(
        { error: 'ID, newBalance, and amount are required' },
        { status: 400 }
      );
    }

    // Fetch the user's payment and pairing details
    const checkPayment = await prisma.userAutomaticPairedDetails.findFirst({
      where: { authorId: id },
    });

    if (!checkPayment) {
      const [createAutomaticUser , updatePayment] = await prisma.$transaction([
        prisma.userAutomaticPairedDetails.create({
          data:{
            authorId:id,
            category,
            amount,
          }
        }),
        prisma.userFullDetails.update({
          where:{authorId:id},
          data:{balanceINR:newBalance}
        })
      ])
      return NextResponse.json(
        { error: 'User balance is updated Successfully' },
        { status: 201 }
      );
    }

    // Handle the case where the user has not yet paid
    if (checkPayment.paid_us === false) {
      const [updatedUser, paymentUpdate] = await prisma.$transaction([
        prisma.userFullDetails.update({
          where: { authorId: id },
          data: { balanceINR: newBalance },
        }),
        prisma.userAutomaticPairedDetails.update({
          where: { authorId: id },
          data: { paid_us: true, amount: amount },
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

    // Handle the case where the user is already paired, but the amount has changed
    if (checkPayment.paid_us === true && checkPayment.amount !== amount) {
      const previousAmount = checkPayment.amount;

      const [updatedUser, paymentUpdate] = await prisma.$transaction([
        prisma.userAutomaticPairedDetails.update({
          where: { authorId: id },
          data: { amount: amount },
        }),
        prisma.userFullDetails.update({
          where: { authorId: id },
          data: {
            balanceINR: {
              decrement: previousAmount, // Subtract the old amount
              increment: amount, // Add the new amount
            },
          },
        }),
      ]);

      return NextResponse.json(
        {
          message: 'User balance updated successfully for changed amount',
          updatedUser,
          paymentUpdate,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { msg: 'User already paid, redirect to autopairing page' },
      { status: 201 }
    );
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
