// /proposals/[proposalId]

import { getSpecFee, payFee } from "@backend/services/fee-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { feeId: string } }
) {
  const feeId = parseInt(params.feeId, 10);

  try {
    const result = await getSpecFee(feeId);

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        specFee: result.specFee,
        message: "Rental fee is retrieved successfully!",
      });
    } else if (result.status === 404) {
      return NextResponse.json(
        { message: "Rental fee not found." },
        { status: result.status }
      );
    } else if (result.status === 500) {
      return NextResponse.json(
        { message: "Error occured when retrieving rental fee." },
        { status: result.status }
      );
    }
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { message: "Error occurred while processing GET request." },
      { status: 500 }
    );
  }
}

// update proposal status only
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ feeId: string }> }
) {
  const feeId = parseInt((await params).feeId, 10);

  // dummy
  // in future will get owner role and id form token passed by frontend using http request
  const userRole = "tenant";

  try {
    // assume the passed data is {status: "???"}
    const { status } = await req.json();

    const result = await payFee(feeId, userRole);

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        paidFee: result.paidFee,
        message: "Rental fee is paid successfully!",
      });
    } else if (result.status === 401) {
      return NextResponse.json({
        status: result.status,
        message: "You are unauthorized to pay rental fee.",
      });
    } else if (result.status === 403) {
      return NextResponse.json({
        status: result.status,
        message: "You are forbidden to pay rental fee.",
      });
    } else if (result.status === 404) {
      return NextResponse.json({
        status: result.status,
        message: "Rental fee not found.",
      });
    } else if (result.status === 500) {
      return NextResponse.json(
        { message: "Error occurred when paying rental fee." },
        { status: result.status }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error occurred while processing PATCH request." },
      { status: 500 }
    );
  }
}
