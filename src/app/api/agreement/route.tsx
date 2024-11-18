import { createAgreement } from '@backend/services/agreement-service';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { proposalId } = await req.json(); // Parse JSON body

    if (!proposalId) {
      return NextResponse.json({
        status: 400,
        message: 'Proposal ID is required.',
      });
    }

    const result = await createAgreement(proposalId);

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        agreement: result.agreement,
        message: 'Agreement created successfully!',
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
    console.error('Error processing POST request:', error);
    return NextResponse.json(
      { message: 'Error occurred while processing request.' },
      { status: 500 }
    );
  }
}
