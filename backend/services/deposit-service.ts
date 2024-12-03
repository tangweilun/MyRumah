import { updateAgreement } from "../services/agreement-service";
import { topupWallet } from "../services/wallet-service";
import { deductWallet } from "../services/wallet-service";
import { Decimal } from "@prisma/client/runtime/library";
import { PrismaClient } from "@prisma/client"; // Adjust based on your project structure
// import { Decimal } from "@prisma/client/runtime"; // For handling decimals
const prisma = new PrismaClient();
async function processDeposit(agreementId: number) {
  try {
    // Fetch the agreement, including related proposal and property details
    const agreement = await prisma.agreement.findUnique({
      where: { agreement_id: agreementId },
      include: {
        rental_fees: true,
        proposal: {
          include: {
            property: true, // Include property details to access `end_date`
            tenant: true, // Include tenant details
          },
        },
      },
    });

    if (!agreement) {
      return { status: 404, message: "Agreement not found." };
    }

    // Check if all rental fees are paid
    const allFeesPaid = agreement.rental_fees.every(
      (fee) => fee.status === "paid" // Using RentalFeeStatus Enum value directly if available
    );

    if (!allFeesPaid) {
      return { status: 400, message: "Not all rental fees are paid." };
    }

    const currentDate = new Date();
    const endDate = new Date(agreement.proposal.property.end_date);

    // If the end date is reached and deposit_status is not already pending_returned
    if (
      currentDate >= endDate &&
      agreement.deposit_status !== "pending_returned"
    ) {
      const updateResponse = await updateAgreement(
        agreementId,
        "editDeposit",
        undefined,
        "pending_returned"
      );

      if (updateResponse.status !== 200) {
        return {
          status: 500,
          message: "Failed to update deposit status to pending_returned.",
        };
      }
    }

    return {
      status: 200,
      message: "Deposit processing completed successfully.",
    };
  } catch (error) {
    console.error("Error processing deposit:", error);
    return {
      status: 500,
      message: "Internal server error while processing deposit.",
    };
  }
}

export { processDeposit };

export async function getDepositData(agreementId: number) {
  try {
    // Fetch deposit details for the given agreement ID
    const depositDetails = await prisma.agreement.findUnique({
      where: { agreement_id: agreementId },
      select: {
        deposit_status: true,
        deposit: true,
        tenant_signature: true,
        owner_signature: true,
        proposal: {
          select: {
            property: {
              select: {
                end_date: true,
              },
            },
          },
        },
      },
    });

    // Handle case where the agreement is not found
    if (!depositDetails) {
      return {
        status: 404,
        message: "Agreement not found.",
      };
    }

    // Return deposit details
    return {
      status: 200,
      depositDetails,
    };
  } catch (error) {
    console.error("Error fetching deposit data:", error);

    return {
      status: 500,
      message: "An error occurred while fetching deposit data.",
    };
  }
}

async function payDeposit(
  agreementId: number,
  userId: number,
  userRole: "tenant" | "owner"
) {
  try {
    // Fetch the agreement details
    const agreement = await prisma.agreement.findUnique({
      where: { agreement_id: agreementId },
      include: {
        proposal: {
          include: {
            property: true,
            tenant: true,
          },
        },
      },
    });

    if (!agreement) {
      return { status: 404, message: "Agreement not found." };
    }

    const depositAmount: Decimal = agreement.deposit;

    // Convert Decimal to number for comparison
    const depositAmountValue = depositAmount.toNumber();

    if (!depositAmountValue || depositAmountValue <= 0) {
      return { status: 400, message: "Invalid deposit amount." };
    }

    // Tenant pays the deposit
    if (userRole === "tenant") {
      if (agreement.proposal.tenant_id != userId) {
        return {
          status: 403,
          message: "Unauthorized access. Only the tenant can pay the deposit.",
        };
      }

      if (agreement.deposit_status !== "pending") {
        return { status: 400, message: "Deposit is not in a pending state." };
      }

      // Deduct tenant wallet
      const deductResponse = await deductWallet(userId, depositAmountValue);

      if (deductResponse.status !== 200) {
        return {
          status: 500,
          message: "Failed to deduct from tenant's wallet.",
        };
      }

      // Top up owner's wallet
      const ownerId = agreement.proposal.property.owner_id;
      const topupResponse = await topupWallet(ownerId, depositAmountValue);

      if (topupResponse.status !== 200) {
        // Rollback deduction if top-up fails
        await topupWallet(userId, depositAmountValue);
        return {
          status: 500,
          message: "Failed to top up owner's wallet. Transaction rolled back.",
        };
      }

      // Update agreement deposit status to 'submitted'
      const updateResult = await updateAgreement(
        agreementId,
        "editDeposit",
        undefined,
        "submitted"
      );

      if (updateResult.status !== 200) {
        return {
          status: updateResult.status,
          message: `Failed to update agreement deposit status: ${updateResult.message}`,
        };
      }

      return { status: 200, message: "Deposit successfully paid by tenant." };
    }

    // Owner returns the deposit
    if (userRole === "owner") {
      if (agreement.proposal.property.owner_id !== userId) {
        return {
          status: 403,
          message:
            "Unauthorized access. Only the owner can return the deposit.",
        };
      }

      if (agreement.deposit_status !== "pending_returned") {
        return {
          status: 400,
          message: "Deposit is not in a pending_returned state.",
        };
      }

      // Deduct owner wallet
      const deductResponse = await deductWallet(userId, depositAmountValue);

      if (deductResponse.status !== 200) {
        return {
          status: 500,
          message: "Failed to deduct from owner's wallet.",
        };
      }

      // Top up tenant's wallet
      const tenantId = agreement.proposal.tenant_id;
      const topupResponse = await topupWallet(tenantId, depositAmountValue);

      if (topupResponse.status !== 200) {
        // Rollback deduction if top-up fails
        await topupWallet(userId, depositAmountValue);
        return {
          status: 500,
          message: "Failed to top up tenant's wallet. Transaction rolled back.",
        };
      }

      // Update agreement deposit status to 'returned'
      const updateDepositResult = await updateAgreement(
        agreementId,
        "editDeposit",
        undefined,
        "returned"
      );

      if (updateDepositResult.status !== 200) {
        return {
          status: updateDepositResult.status,
          message: `Failed to update agreement deposit status: ${updateDepositResult.message}`,
        };
      }

      // Mark agreement as completed
      const updateCompleteResult = await updateAgreement(
        agreementId,
        "complete"
      );

      if (updateCompleteResult.status !== 200) {
        return {
          status: updateCompleteResult.status,
          message: `Failed to mark agreement as completed: ${updateCompleteResult.message}`,
        };
      }

      return {
        status: 200,
        message:
          "Deposit successfully returned by owner, and agreement marked as completed.",
      };
    }

    return { status: 400, message: "Invalid user role." };
  } catch (error) {
    console.error("Error in payDeposit function:", error);
    return {
      status: 500,
      message: "Internal server error while processing deposit payment.",
    };
  }
}

export { payDeposit };
