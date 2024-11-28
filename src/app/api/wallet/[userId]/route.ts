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

    const walletResult =
      walletAction === "topup"
        ? await topupWallet(userId, walletAmount)
        : walletAction === "deduct"
        ? await deductWallet(userId, walletAmount)
        : null;

    if (!walletResult) {
      return NextResponse.json(
        { message: "Invalid wallet action." },
        { status: 400 }
      );
    }

    if (walletResult.status === 200) {
      return NextResponse.json({
        status: walletResult.status,
        updatedUserData: walletResult.updatedUserData,
        message: `Wallet is ${
          walletAction === "topup"
            ? "topped up"
            : walletAction === "deduct"
            ? "deducted"
            : null
        } successfully!`,
      });
    } else if (walletResult.status === 400) {
      return NextResponse.json({
        status: walletResult.status,
        message: "Invalid amount.",
      });
    } else if (walletResult.status === 404) {
      return NextResponse.json({
        status: walletResult.status,
        message: "User not found.",
      });
    } else if (walletResult.status === 500) {
      return NextResponse.json(
        {
          message: `Error occurred when ${
            walletAction === "topup"
              ? "topping up"
              : walletAction === "deduct"
              ? "deducting"
              : null
          } wallet.`,
        },
        { status: walletResult.status }
      );
    }
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { message: "Error occurred while processing PATCH request" },
      { status: 500 }
    );
  }
}
