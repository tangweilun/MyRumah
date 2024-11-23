import {
  topupWallet,
  deductWallet,
  getWallet,
} from "@backend/services/wallet-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId = parseInt((await params).userId, 10);
  // for page that fetch this api, can create enum for walletAction
  try {
    const topupResult = await getWallet(userId);
    if (topupResult.status === 200) {
      return NextResponse.json({
        status: topupResult.status,
        walletAmount: topupResult.walletAmount,
        message: "Wallet is retrieved successfully!",
      });
    } else if (topupResult.status === 404) {
      return NextResponse.json({
        status: topupResult.status,
        message: "Wallet not found.",
      });
    } else if (topupResult.status === 500) {
      return NextResponse.json(
        { message: "Error occurred when get wallet amount." },
        { status: topupResult.status }
      );
    }
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { message: "Error occurred while processing GET request" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const userId = parseInt((await params).userId, 10);
  // for page that fetch this api, can create enum for walletAction
  try {
    const { walletAmount, walletAction } = await req.json();

    if (!walletAmount) {
      return NextResponse.json({
        status: 400,
        message: "Missing wallet amount.",
      });
    }

    if (walletAction === "topup") {
      const topupResult = await topupWallet(userId, walletAmount);
      if (topupResult.status === 200) {
        return NextResponse.json({
          status: topupResult.status,
          updatedUserData: topupResult.updatedUserData,
          message: "Wallet is topped up successfully!",
        });
      } else if (topupResult.status === 400) {
        return NextResponse.json({
          status: topupResult.status,
          message: "Invalid top up amount.",
        });
      } else if (topupResult.status === 404) {
        return NextResponse.json({
          status: topupResult.status,
          message: "User not found.",
        });
      } else if (topupResult.status === 500) {
        return NextResponse.json(
          { message: "Error occurred when topping up wallet." },
          { status: topupResult.status }
        );
      }
    } else if (walletAction === "deduct") {
      const deductResult = await deductWallet(userId, walletAmount);
      if (deductResult.status === 200) {
        return NextResponse.json({
          status: deductResult.status,
          updatedUserData: deductResult.updatedUserData,
          message: "Wallet is topped up successfully!",
        });
      } else if (deductResult.status === 400) {
        return NextResponse.json({
          status: deductResult.status,
          message: "Invalid top up amount.",
        });
      } else if (deductResult.status === 404) {
        return NextResponse.json({
          status: deductResult.status,
          message: "User not found.",
        });
      } else if (deductResult.status === 500) {
        return NextResponse.json(
          { message: "Error occurred when topping up wallet." },
          { status: deductResult.status }
        );
      }
    }
    return NextResponse.json(
      { message: "Invalid wallet action." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { message: "Error occurred while processing PATCH request" },
      { status: 500 }
    );
  }
}
