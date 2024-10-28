
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Read the JSON body from the request
    const body = await request.json();
    console.log('Request body:', body); // Log the entire request body for debugging

    // Extract username from the body
    const { username } = body;
    console.log('Extracted username:', username); // Log the extracted username

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Log the database query for debugging
    console.log('Updating user with username:', username);

    const updateResult = await prisma.user.update({
      where: { username },
      data: { signin: false },
    });

    // Log the result of the update operation
    console.log('Update result:', updateResult);

    // Create a response and clear the cookies
    const response = NextResponse.json({ message: 'Sign-out status updated' }, { status: 200 });

    // Clear userDetails cookie
    response.cookies.set('userDetails', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // Expire the cookie immediately
      path: '/',
    });

    // Clear token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // Expire the cookie immediately
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Error updating sign-out status:', error);
    return NextResponse.json({ error: 'Error updating sign-out status' }, { status: 500 });
  }
}
