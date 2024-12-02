import { createAgreement } from "@backend/services/agreement-service";
import { getAgreementsByUserId } from "@backend/services/agreement-service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { proposalId } = await req.json(); // Parse JSON body

    if (!proposalId) {
      return NextResponse.json({
        status: 400,
        message: "Proposal ID is required.",
      });
    }

    const result = await createAgreement(proposalId);

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        agreement: result.agreement,
        message: "Agreement created successfully!",
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
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { message: "Error occurred while processing request." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = parseInt(searchParams.get("userId") || "");
    const userType = searchParams.get("userType");

    if (!userId || !userType) {
      return NextResponse.json({
        status: 400,
        message: "Both userId and userType are required.",
      });
    }

    const result = await getAgreementsByUserId(
      userId,
      userType as "tenant" | "owner"
    );

    if (!result) {
      return NextResponse.json({
        status: 404,
        message: "No agreements found.",
      });
    }

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        agreements: result.agreements,
      });
    } else {
      return NextResponse.json({
        status: result.status,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in GET /api/agreements:", error);
    return NextResponse.json(
      { message: "Error occurred while processing the request." },
      { status: 500 }
    );
  }
}
