// /proposals/spec-tenant/[tenantId]
// owner portal: show all proposal created by selected tenant, where the filtered proposal only related to that owner

import { getSpecTenantProposal } from "@backend/services/proposal-service";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/getSession";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const tenantId = parseInt((await params).tenantId, 10);
  // id of curr login user (owner)
  // Note: for using useSession(),
  // Client Side: Yes; Server Side: No
  // can check session in forntend first, then pass through header
  // example of header should be like:
  // headers: {
  //   'Content-Type': 'application/json',
  //   'User_Id': userId,
  //   'User-role': userRole,
  // },
  // user id and user role should be owner, the role will be checked in the function one more time
  const ownerId = req.headers.get("User-Id");
  // const userRole = req.headers.get("User-Role");
  if (!ownerId) {
    return NextResponse.json(
      {
        message:
          "You are unauthorized to retrieve proposal list of specific tenant.",
      },
      { status: 401 }
    );
  }
  // if (userRole !== "owner") {
  //   return NextResponse.json(
  //     {
  //       message:
  //         "You are forbidden to retrieve proposal list of specific tenant.",
  //     },
  //     { status: 403 }
  //   );
  // }
  try {
    // const result = await getSpecTenantProposal(tenantId, ownerId, userRole);
    const result = await getSpecTenantProposal(tenantId, parseInt(ownerId));
    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        specTenantProposal: result.specTenantProposal,
        message: "Proposal list of chosen tenant is retrieved successfully!",
      });
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
