// /proposals/[proposalId]

import {
  getSpecProposal,
  updateProposalStatus,
} from "@backend/services/proposal-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ proposalId: string }> }
) {
  const proposalId = parseInt((await params).proposalId, 10);

  try {
    const result = await getSpecProposal(proposalId);

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        tenantList: result.specProposal,
        message: "Proposal is retrieved successfully!",
      });
    } else if (result.status === 404) {
      return NextResponse.json(
        { message: "Proposal not found." },
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

// update proposal status only
export async function PATCH(
  req: NextRequest,
  { params }: { params: { proposalId: string } }
) {
  const proposalId = parseInt(params.proposalId, 10);

  // dummy
  // in future will get owner role and id form token passed by frontend using http request
  const userRole = "owner";
  const ownerId = 8; // Henry, got property 6,7
  // will pass in

  try {
    // assume the passed data is {status: "???"}
    const { status } = await req.json();

    const result = await updateProposalStatus(proposalId, status, userRole);

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        updatedProposal: result.updatedProposal,
        message: "Proposal status is changed successfully!",
      });
    } else if (result.status === 400) {
      // will return the proposal data as a result of change status to "cancelled" if the proposal is expired
      // if not, then it is empty string
      const updatedProposal = result.updatedProposal
        ? result.updatedProposal
        : "";
      return NextResponse.json({
        status: result.status,
        updatedProposal: updatedProposal,
        message:
          "Invalid action for proposal status change. It may due to current login role cannot modify certain status or the proposal is expired.",
      });
    } else if (result.status === 401) {
      return NextResponse.json({
        status: result.status,
        message: "You are unauthorized to change proposal status.",
      });
    } else if (result.status === 404) {
      return NextResponse.json({
        status: result.status,
        message: "Specified proposal not found.",
      });
    } else if (result.status === 500) {
      return NextResponse.json(
        { message: "Error occurred when changing proposal status." },
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