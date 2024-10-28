import {  NextResponse } from 'next/server';
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const lowercasedUsername = username.replace(/\s+/g, '').toLowerCase();
    
    const existingUser = await prisma.user.findFirst({
      where: {
        username: lowercasedUsername,
      },
    });

    if (existingUser?.signin === true) {
      return NextResponse.json({ error: 'User Already Signed In' }, { status: 402 });
    }

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const passwordCheck = await bcrypt.compare(password, existingUser.password);
    if (!passwordCheck) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { signin: true },
    });

    const token = jwt.sign({
      id: existingUser.id,
      username: existingUser.username,
    }, JWT_SECRET, { expiresIn: '1d' });

    const response = NextResponse.json({ message: 'Login successful' }, { status: 201 });

    response.cookies.set('userDetails', JSON.stringify({
      id: existingUser.id,
      username: existingUser.username,
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
      sameSite: 'lax',
    });

    response.cookies.set('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Error during login' }, { status: 500 });
  }
}
