// /proposals
// tenant portal: show all proposal created by that tenant

import { getAllFee, createFee } from "@backend/services/fee-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // simulate retrieve the current login role from token
  // simulate retrieve the user id of current login role from token

  // Authorization (check has token or not) will be done here
  // if unauthorized (no token) return status 401

  const userRole = "tenant";
  // id of curr login user (tenant)
  const tenantId = 1;
  // id of curr login user (owner)
  const ownerId = 8;

  const currId = tenantId;

  try {
    // const result = await getAllFee(currId, userRole);
    const result = await getAllFee(currId);

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        feeList: result.feeList,
        message: "Rental fee list is retrieved successfully!",
      });
    } else if (result.status === 401) {
      return NextResponse.json(
        { message: "You are unauthorized to retrieve rental fee list." },
        { status: result.status }
      );
    } else if (result.status === 404) {
      return NextResponse.json(
        { message: "Rental fee list not found." },
        { status: result.status }
      );
    } else if (result.status === 500) {
      return NextResponse.json(
        { message: "Error occured when retrieving rental fee list." },
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
  // simulate retrieve the current login role from token
  // simulate retrieve the user id of current login role from token
  const userRole = "tenant";
  const tenantId = 1;
  try {
    const { agreementId } = await req.json();
    if (!agreementId) {
      return NextResponse.json({
        status: 400,
        message: "Missing agreement ID.",
      });
    }

    const result = await createFee(agreementId);

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        newRentalFee: result.newRentalFee,
        message: "Rental fee(s) is created!",
      });
    } else if (result.status === 400) {
      return NextResponse.json(
        {
          message:
            "Missing fee creation information or agreement is not ongoing.",
        },
        { status: result.status }
      );
    } else if (result.status === 404) {
      return NextResponse.json(
        { message: "Agreement not found." },
        { status: result.status }
      );
    } else if (result.status === 409) {
      return NextResponse.json(
        { message: "The fee(s) for the current agreement has been created." },
        { status: result.status }
      );
    } else if (result.status === 500) {
      return NextResponse.json(
        { message: "Error occured when creating rental fee." },
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
