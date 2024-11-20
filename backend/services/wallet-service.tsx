import { Decimal } from "@prisma/client/runtime/library";
import prisma from "../../lib/prisma";

async function topupWallet(userId: number, topupAmount: number) {
  if (!userId || !topupAmount || topupAmount <= 0) {
    return { status: 400 };
  }

  try {
    // Fetch the current wallet amount
    const userWallet = await getWallet(userId);

    if (userWallet.status !== 200 || !userWallet.walletAmount) {
      return { status: userWallet.status };
    }

    const newWalletAmount = new Decimal(userWallet.walletAmount).add(
      topupAmount
    );

    const updatedUserData = await prisma.userInfo.update({
      where: {
        user_id: userId,
      },
      data: {
        wallet_amount: newWalletAmount,
      },
    });

    return { status: 200, updatedUserData: updatedUserData };
  } catch (error) {
    console.error("Error in topup wallet amount: ", error);
    return { status: 500 };
  }
}

async function deductWallet(userId: number, deductAmount: number) {
  if (!userId || !deductAmount || deductAmount <= 0) {
    return { status: 400 };
  }

  try {
    // Fetch the current wallet amount
    const userWallet = await getWallet(userId);

    if (userWallet.status !== 200 || !userWallet.walletAmount) {
      return { status: userWallet.status };
    }

    const newWalletAmount = new Decimal(userWallet.walletAmount).sub(
      deductAmount
    );

    const updatedUserData = await prisma.userInfo.update({
      where: {
        user_id: userId,
      },
      data: {
        wallet_amount: newWalletAmount,
      },
    });

    return { status: 200, updatedUserData: updatedUserData };
  } catch (error) {
    console.error("Error in deduct wallet amount: ", error);
    return { status: 500 };
  }
}

async function getWallet(userId: number) {
  try {
    const userWallet = await prisma.userInfo.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        wallet_amount: true,
      },
    });

    if (!userWallet) {
      return { status: 404 };
    }

    return { status: 200, walletAmount: userWallet.wallet_amount };
  } catch (error) {
    console.error("Error in getting user wallet amount: ", error);
    return { status: 500 };
  }
}

export { topupWallet, deductWallet, getWallet };
