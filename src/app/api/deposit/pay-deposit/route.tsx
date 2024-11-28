import { payDeposit } from '@backend/services/deposit-service'; // Adjust path as needed
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { agreementId, userId, userRole } = await req.json(); // Parse JSON body

    // Validate the input fields
    if (!agreementId || !userId || !userRole) {
      return NextResponse.json({
        status: 400,
        message: 'Agreement ID, User ID, and User Role are required.',
      });
    }

    // Validate userRole value
    if (userRole !== 'tenant' && userRole !== 'owner') {
      return NextResponse.json({
        status: 400,
        message: 'Invalid user role. Must be "tenant" or "owner".',
      });
    }

    // Call the payDeposit function
    const result = await payDeposit(agreementId, userId, userRole);

    // Handle response based on the service result
    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        message: result.message,
      });
    } else if (result.status === 400 || result.status === 404) {
      return NextResponse.json({
        status: result.status,
        message: result.message,
      });
    } else {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }
  } catch (error) {
    console.error('Error processing POST request for deposit:', error);
    return NextResponse.json(
      { message: 'Error occurred while processing deposit request.' },
      { status: 500 }
    );
  }
}
