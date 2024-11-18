import { signAgreement, approveAgreement } from '@backend/services/agreement-service';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { agreementId: string } }) {
  try {
    const { action, userType } = await req.json(); // Expect `action` and optionally `userType` in the request body
    const agreementId = parseInt(params.agreementId);

    if (!agreementId || !action) {
      return NextResponse.json({
        status: 400,
        message: 'Agreement ID and action are required.',
      });
    }

    if (action === 'sign') {
      if (!userType) {
        return NextResponse.json({
          status: 400,
          message: 'User type is required for signing.',
        });
      }

      const result = await signAgreement(agreementId, userType);

      return NextResponse.json({ status: result.status, message: result.message });
    } else if (action === 'approve') {
      const result = await approveAgreement(agreementId);

      return NextResponse.json({ status: result.status, message: result.message });
    } else {
      return NextResponse.json({
        status: 400,
        message: 'Invalid action. Valid actions are "sign" or "approve".',
      });
    }
  } catch (error) {
    console.error('Error in agreement route:', error);
    return NextResponse.json(
      { message: 'Error occurred while processing agreement request.' },
      { status: 500 }
    );
  }
}
