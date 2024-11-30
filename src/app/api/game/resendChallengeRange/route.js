// export const dynamic = 'force-static';
export const revalidate = 60; // Set a revalidation time in seconds

import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');
        const username = searchParams.get('username');

        if (!userId || !username) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const requestBody = await request.json();
        const { challengedby, betEndRange2, betStartRange2, askStartRange2, askEndRange2 } = requestBody;

        const challengedbyUser = await prisma.user.findUnique({
            where: { username: challengedby }
        });

        const challengedRangeDataEntry = await prisma.challengeGameRangeDetails.findFirst({
            where: {
                authorId: challengedbyUser?.id,
                opponentId: userId
            }
        });

        const resendChallengeData = await prisma.challengeResendGameRangeDetails.findFirst({
            where: { authorId: challengedRangeDataEntry?.id }
        });

        if (!resendChallengeData && challengedRangeDataEntry) {
            await prisma.challengeResendGameRangeDetails.create({
                data: {
                    authorId: challengedRangeDataEntry.id,
                    betStartRange2,
                    betEndRange2,
                    askStartRange2,
                    askEndRange2,
                }
            });
            return NextResponse.json({ msg: "Range Data Resend done" }, { status: 201 });
        } else {
            return NextResponse.json({ msg: "Data Already Sent to this Challenger" }, { status: 400 });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ msg: "Error occurred", error: error }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure to disconnect
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');
        const username = searchParams.get('username');

        if (!userId || !username) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        const challengerid = await prisma.challengeGameRangeDetails.findMany({
            where: { authorId: userId }
        });

        if (challengerid.length > 0) {
            const responseData = await Promise.all(
                challengerid.map(async (challenger) => {
                    const resentdata = await prisma.challengeResendGameRangeDetails.findFirst({
                        where: { authorId: challenger.id }
                    });
                    return {
                        betStartRange2: resentdata?.betStartRange2,
                        betEndRange2: resentdata?.betEndRange2,
                        askStartRange2: resentdata?.askStartRange2,
                        askEndRange2: resentdata?.askEndRange2,
                    };
                })
            );
            return NextResponse.json({ data: responseData });
        }

        return NextResponse.json({ msg: "No challenges sent" });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ msg: "Error occurred", error: error }, { status: 500 });
    } finally {
        await prisma.$disconnect(); // Ensure to disconnect
    }
}
