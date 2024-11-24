import { updateAgreement } from '@backend/services/agreement-service';
import { getAgreementById } from '@backend/services/agreement-service';
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

export async function GET(req: Request, { params }: { params: { agreementId: string } }) {
  try {
    const agreementId = parseInt(params.agreementId);

    if (!agreementId) {
      return NextResponse.json({
        status: 400,
        message: 'Agreement ID is required.',
      });
    }

    const result = await getAgreementById(agreementId);

    if (result.status !== 200) {
      return NextResponse.json({ status: result.status, message: result.message });
    }

    return NextResponse.json({ status: 200, agreement: result.agreement });
  } catch (error) {
    console.error('Error in GET agreement route:', error);
    return NextResponse.json(
      { message: 'Error occurred while fetching agreement.' },
      { status: 500 }
    );
  }
}
