import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../../lib/prisma';

async function topupWallet(userId: number, topupAmount: number) {
  if (!userId || !topupAmount || topupAmount <= 0) {
    return { status: 400 };
  }

  try {
    // Fetch the current wallet amount
    const user = await prisma.userInfo.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        wallet_amount: true,
      },
    });

    if (!user) {
      return { status: 404 };
    }

    const newWalletAmount = new Decimal(user.wallet_amount).add(topupAmount);

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
    console.error('Error in topup wallet amount: ', error);
    return { status: 500 };
  }
}

export { topupWallet };
