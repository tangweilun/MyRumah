// app/api/add-user/route.tsx

import { login } from '@backend/services/auth-service';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const userData = await req.json(); // Parse JSON body
    console.log('Received data:', userData);

    if (!userData) {
      return NextResponse.json({
        status: 400,
        message: 'Missing registration information.',
      });
    }
    // return NextResponse.json(userData, { status: 200 });
    const result = await login(
      userData.email,
      userData.userRole,
      userData.password
    );

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        userData: result.userData,
        message: 'Login successfully!',
      });
    } else if (result.status === 400) {
      return NextResponse.json({
        status: result.status,
        message: 'Incomplete login credential!',
      });
    } else if (result.status === 401) {
      return NextResponse.json({
        status: result.status,
        message: 'Invalid login credential!',
      });
    } else if (result.status === 500) {
      return NextResponse.json(
        { message: 'Error occurred when user login.' },
        { status: result.status }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Error occurred while processing POST request' },
      { status: 500 }
    );
  }
}
