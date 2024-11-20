// /proposals/spec-tenant/[tenantId]
// owner portal: show all proposal created by selected tenant, where the filtered proposal only related to that owner

import { getSpecTenantProposal } from "@backend/services/proposal-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  // simulate retrieve the current login role from token
  // simulate retrieve the user id of current login role from token

  // Authorization (check has token or not) will be done here
  // if unauthorized (no token) return status 401

  // const userRole = "owner";
  // id of specific tenant
  const tenantId = parseInt((await params).tenantId, 10);
  // id of curr login user (owner)
  const ownerId = 8;

  try {
    // const result = await getSpecTenantProposal(tenantId, ownerId, userRole);
    const result = await getSpecTenantProposal(tenantId, ownerId);

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        specTenantProposal: result.specTenantProposal,
        message: "Proposal list of chosen tenant is retrieved successfully!",
      });
    } else if (result.status === 401) {
      return NextResponse.json(
        {
          message:
            "You are unauthorized to retrieve proposal list of specific tenant.",
        },
        { status: result.status }
      );
    } else if (result.status === 403) {
      return NextResponse.json(
        {
          message:
            "You are forbidden to retrieve proposal list of specific tenant.",
        },
        { status: result.status }
      );
    } else if (result.status === 404) {
      return NextResponse.json(
        { message: "Proposal list of specific tenant not found." },
        { status: result.status }
      );
    } else if (result.status === 500) {
      return NextResponse.json(
        {
          message:
            "Error occured when retrieving proposal list of specific tenant.",
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
