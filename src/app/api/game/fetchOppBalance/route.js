import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const player = searchParams.get("oppname");

    if(!player){
        return NextResponse.json({msg:"unauthorized"},{status:401})
    }

    const FindOppBalance =  await prisma.partialDemoBalance.findUnique({
        where:{player:player},
    })

    if(!FindOppBalance){
        return NextResponse.json({msg:"unauthorized"},{status:401})
    }
    return NextResponse.json({oppBalance:FindOppBalance.demoBalance},{status:201})
  } catch (error) {
    console.error('Error fetching oppBalance:', error);
    return NextResponse.json(
      { error: 'Error fetching oppBalance. Please try again.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

