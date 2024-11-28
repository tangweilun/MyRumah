import { processDeposit } from '@backend/services/deposit-service'; // Adjust path as needed
import { getDepositData } from '@backend/services/deposit-service';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { agreementId } = await req.json(); // Parse JSON body

    // Validate the agreementId
    if (!agreementId) {
      return NextResponse.json({
        status: 400,
        message: 'Agreement ID is required.',
      });
    }

    // Process the deposit
    const result = await processDeposit(agreementId);

    // Handle response based on the service result
    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        message: 'Deposit processed successfully!',
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

export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const agreementId = parseInt(searchParams.get('agreementId') || '');
  
      if (!agreementId) {
        return NextResponse.json({
          status: 400,
          message: 'Agreement ID is required.',
        });
      }
  
      const result = await getDepositData(agreementId);
  
      return NextResponse.json({
        status: result.status,  
        ...(result.status === 200
          ? { depositDetails: result.depositDetails }
          : { message: result.message }),
      });
    } catch (error) {
      console.error('Error processing GET request for deposit:', error);
      return NextResponse.json(
        { message: 'Error occurred while retrieving deposit information.' },
        { status: 500 }
      );
    }
  }