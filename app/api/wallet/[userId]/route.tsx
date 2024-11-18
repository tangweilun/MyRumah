import { topupWallet } from '@backend/services/user-service';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = parseInt(params.userId, 10);

  try {
    const { topupAmount } = await req.json();

    if (!topupAmount) {
      return NextResponse.json({
        status: 400,
        message: 'Missing topup amount.',
      });
    }

    const result = await topupWallet(userId, topupAmount);

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        updatedUserData: result.updatedUserData,
        message: 'Wallet is topped up successfully!',
      });
    } else if (result.status === 400) {
      return NextResponse.json({
        status: result.status,
        message: 'Invalid top up amount.',
      });
    } else if (result.status === 404) {
      return NextResponse.json({
        status: result.status,
        message: 'User not found.',
      });
    } else if (result.status === 500) {
      return NextResponse.json(
        { message: 'Error occurred when topping up wallet.' },
        { status: result.status }
      );
    }
  } catch (error) {
    console.error('Error: ', error);
    return NextResponse.json(
      { message: 'Error occurred while processing PATCH request' },
      { status: 500 }
    );
  }
}
