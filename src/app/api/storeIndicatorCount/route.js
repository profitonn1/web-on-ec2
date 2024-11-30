import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, username, indicatorName, toolName, timeInterval } = body;

        console.log(userId, username, indicatorName, toolName, timeInterval);

        if (!userId || !username) {
            return NextResponse.json(
                { error: "User not authenticated" },
                { status: 401 }
            );
        }

        // Find the user record
        let userRecord = await prisma.playerTradingStyleDetails.findFirst({
            where: { authorId: userId },
        });

        const updates = {};

        // Update the fields only if they are provided
        if (indicatorName) {
            updates.indicatorName = {
                ...userRecord?.indicatorName,
                [indicatorName]: (userRecord?.indicatorName?.[indicatorName] || 0) + 1,
            };
        }
        if (toolName) {
            updates.toolsName = {
                ...userRecord?.toolsName,
                [toolName]: (userRecord?.toolsName?.[toolName] || 0) + 1,
            };
        }
        if (timeInterval) {
            updates.timeInterval = {
                ...userRecord?.timeInterval,
                [timeInterval]: (userRecord?.timeInterval?.[timeInterval] || 0) + 1,
            };
        }

        if (userRecord) {
            await prisma.playerTradingStyleDetails.update({
                where: { id: userRecord.id },
                data: updates,
            });
        } else {
            await prisma.playerTradingStyleDetails.create({
                data: {
                    authorId: userId,
                    indicatorName: indicatorName ? { [indicatorName]: 1 } : {},
                    toolsName: toolName ? { [toolName]: 1 } : {},
                    timeInterval: timeInterval ? { [timeInterval]: 1 } : {},
                },
            });
        }

        return NextResponse.json({ msg: "Indicators updated successfully" }, { status: 201 });
    } catch (error) {
        console.log("Error:", error.stack);
        return NextResponse.json(
            { msg: "Error occurred", error: error.message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
