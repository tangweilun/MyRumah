// /proposals
// tenant portal: show all proposal created by that tenant

import {
  getAllProposal,
  createProposal,
} from "@backend/services/proposal-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("User-Id");
  // const userRole = req.headers.get("User-Role");
  if (!userId) {
    return NextResponse.json(
      {
        message:
          "You are unauthorized to retrieve proposal list of specific tenant.",
      },
      { status: 401 }
    );
  }

  try {
    // const result = await getAllProposal(currId, userRole);
    const result = await getAllProposal(parseInt(userId));

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        proposalList: result.proposalList,
        message: "Proposal list is retrieved successfully!",
      });
    } else if (result.status === 401) {
      return NextResponse.json(
        { message: "You are unauthorized to retrieve proposal list." },
        { status: result.status }
      );
    } else if (result.status === 404) {
      return NextResponse.json(
        { message: "Proposal list not found." },
        { status: result.status }
      );
    } else if (result.status === 500) {
      return NextResponse.json(
        { message: "Error occured when retrieving proposal list." },
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

export async function POST(req: NextRequest) {
  const tenantId = req.headers.get("User-Id");
  if (!tenantId) {
    return NextResponse.json(
      {
        message: "You are unauthorized to create proposal.",
      },
      { status: 401 }
    );
  }

  try {
    const newProposalData = await req.json();
    if (!newProposalData) {
      return NextResponse.json({
        status: 400,
        message: "Missing proposal creation information.",
      });
    }

    const result = await createProposal(
      parseInt(tenantId),
      newProposalData.propertyId
    );

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        newProposal: result.newProposal,
        message: "Proposal is created!",
      });
    } else if (result.status === 400) {
      return NextResponse.json(
        {
          message:
            "Missing proposal creation information, or proposal is invalid due to exceeding property rental start date, or property not open for rental.",
        },
        { status: result.status }
      );
    } else if (result.status === 401) {
      return NextResponse.json(
        { message: "You are unauthorized to create proposal." },
        { status: result.status }
      );
    } else if (result.status === 403) {
      return NextResponse.json(
        { message: "You are forbidden to create proposal." },
        { status: result.status }
      );
    } else if (result.status === 404) {
      return NextResponse.json(
        { message: "Property not found." },
        { status: result.status }
      );
    }
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { message: "Error occurred while processing POST request." },
      { status: 500 }
    );
  }
}
