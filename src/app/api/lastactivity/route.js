// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function POST(request) {
//   try {
//     // Parse the JSON body from the request
//     const body = await request.json();

//     // Extract username from the body
//     const { username } = body;
//     console.log('Extracted username:', username); // Log the extracted username

//     if (!username) {
//       return NextResponse.json({ error: 'Username is required' }, { status: 400 });
//     }

//     // Update the user's lastActivity timestamp
//     const updateResult = await prisma.user.update({
//       where: { username },
//       data: {
//         lastActivity: new Date(), // Set lastActivity to the current timestamp
//       },
//     });

//     // Return success response
//     return NextResponse.json({ message: 'lastActivity updated' }, { status: 200 });

//   } catch (error) {
//     console.error('Error updating lastActivity:', error);
//     return NextResponse.json({ error: 'Error updating lastActivity' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect(); // Ensure disconnection in finally block
//   }
// }
