// app/api/add-user/route.tsx

import { register } from '../../../backend/services/user-service';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    return NextResponse.json({ message: 'qqq' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { status: 'error', message: 'aaa' },
        { status: 500 }
      );
    }
  }
}

export async function POST(req: Request) {
  try {
    const { userData } = await req.json(); // Parse JSON body
    console.log(11111);

    if (!userData) {
      return NextResponse.json(
        { status: 'error', message: 'Missing userData' },
        { status: 400 }
      );
    }

    const result = await register(
      userData.username,
      userData.password,
      userData.email,
      userData.phoneNumber,
      userData.userRole
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { status: 'error', message: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
