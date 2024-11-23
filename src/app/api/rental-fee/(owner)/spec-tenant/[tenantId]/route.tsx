// /proposals/spec-tenant/[tenantId]
// owner portal: show all proposal created by selected tenant, where the filtered proposal only related to that owner

import { getSpecTenantFee } from "@backend/services/fee-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const tenantId = parseInt((await params).tenantId, 10);
  const ownerId = req.headers.get("User-Id");
  // const userRole = req.headers.get("User-Role");
  if (!ownerId) {
    return NextResponse.json(
      {
        message:
          "You are unauthorized to retrieve fee list of specific tenant.",
      },
      { status: 401 }
    );
  }

  try {
    // const result = await getSpecTenantFee(tenantId, ownerId, userRole);
    const result = await getSpecTenantFee(tenantId, parseInt(ownerId));

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        specTenantFee: result.specTenantFee,
        message: "Rental fee list of chosen tenant is retrieved successfully!",
      });
    } else if (result.status === 401) {
      return NextResponse.json(
        {
          message:
            "You are unauthorized to retrieve rental fee list of specific tenant.",
        },
        { status: result.status }
      );
    } else if (result.status === 403) {
      return NextResponse.json(
        {
          message:
            "You are forbidden to retrieve rental fee list of specific tenant.",
        },
        { status: result.status }
      );
    } else if (result.status === 404) {
      return NextResponse.json(
        { message: "Rental fee list of specific tenant not found." },
        { status: result.status }
      );
    } else if (result.status === 500) {
      return NextResponse.json(
        {
          message:
            "Error occured when retrieving rental fee list of specific tenant.",
        },
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
