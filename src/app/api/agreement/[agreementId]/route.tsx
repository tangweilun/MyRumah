import { updateAgreement } from '@backend/services/agreement-service';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { agreementId: string } }) {
  try {
    const { action, userType, newDepositStatus } = await req.json(); // Accept `action`, `userType`, and optionally `newDepositStatus`
    const agreementId = parseInt(params.agreementId);

    if (!agreementId || !action) {
      return NextResponse.json({
        status: 400,
        message: 'Agreement ID and action are required.',
      });
    }

    const result = await updateAgreement(agreementId, action, userType, newDepositStatus);

    return NextResponse.json({ status: result.status, message: result.message });
  } catch (error) {
    console.error('Error in agreement route:', error);
    return NextResponse.json(
      { message: 'Error occurred while processing agreement request.' },
      { status: 500 }
    );
  }
}
