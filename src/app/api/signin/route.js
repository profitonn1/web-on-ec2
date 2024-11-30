import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { date } from 'zod';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Disconnect Prisma Client after use
async function disconnectPrisma() {
  await prisma.$disconnect();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const lowercasedUsername = username.trim().toLowerCase();

    const existingUser = await prisma.user.findFirst({
      where: { username: lowercasedUsername },
    });

    console.log(lowercasedUsername)
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (existingUser.signin) {
      return NextResponse.json({ error: 'User Already Signed In' }, { status: 402 });
    }

    const passwordCheck = await bcrypt.compare(password, existingUser.password);
    if (!passwordCheck) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { signin: true ,
         signInTime : new Date()
        },
      
    });

    // Check if existingUser properties are valid before signing the token
    if (!existingUser.id || !existingUser.username) {
      throw new Error('Missing user information for token generation');
    }

    const token = jwt.sign(
      { id: existingUser.id, username: existingUser.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove httpOnly flag to make cookies accessible in JavaScript
    const response = NextResponse.json({ message: 'Login successful' }, { status: 201 });

    response.cookies.set('userDetails', JSON.stringify({
      id: existingUser.id,
      username: existingUser.username,
    }), {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 , // 1 month
      path: '/',
      sameSite: 'lax',
    });

    response.cookies.set('token', token, {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 , // 1 month
      path: '/',
      sameSite: 'lax',
    });

    return response;

  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Error during login' }, { status: 500 });
  } finally {
    await disconnectPrisma(); // Ensure disconnection in finally block
  }
}
