import { updateAgreement } from "../services/agreement-service";
import { topupWallet } from "../services/wallet-service";
import { PrismaClient } from '@prisma/client'; // Adjust based on your project structure
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
              tenant: true,   // Include tenant details for wallet operations
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
      if (currentDate >= endDate && agreement.deposit_status !== "pending_returned") {
        const updateResponse = await updateAgreement(
          agreementId,
          "editDeposit",
          undefined,
          "pending_returned"
        );
  
        if (updateResponse.status !== 200) {
          return { status: 500, message: "Failed to update deposit status to pending_returned." };
        }
  
        // Reset owner and tenant signatures using the updateAgreement function
        const resetSignaturesResponse = await updateAgreement(
          agreementId,
          "resetSignatures"
        );
  
        if (resetSignaturesResponse.status !== 200) {
          return { status: 500, message: "Failed to reset signatures." };
        }
      }
  
      // Check if the deposit status is `pending_returned`
      if (agreement.deposit_status === "pending_returned") {
        // Ensure both owner and tenant have signed
        if (agreement.owner_signature && agreement.tenant_signature) {
          // Top up the tenant's wallet with the deposit amount
          const topUpResponse = await topupWallet(
            agreement.proposal.tenant.user_id,
            parseFloat(agreement.deposit.toString())
          );
  
          if (topUpResponse.status !== 200) {
            return { status: 500, message: "Failed to top up tenant's wallet." };
          }
  
          // Update deposit status to `returned` using the updateAgreement function
          const returnResponse = await updateAgreement(
            agreementId,
            "editDeposit",
            undefined,
            "returned"
          );
  
          if (returnResponse.status !== 200) {
            return { status: 500, message: "Failed to update deposit status to returned." };
          } else {
            return { status: 200, message: "Deposit successfully returned." };
          }
        } else {
          return {
            status: 400,
            message: "Both owner and tenant must sign before returning the deposit.",
          };
        }
      }
  
      return { status: 200, message: "Deposit processing completed successfully." };
    } catch (error) {
      console.error("Error processing deposit:", error);
      return { status: 500, message: "Internal server error while processing deposit." };
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
          message: 'Agreement not found.',
        };
      }
  
      // Return deposit details
      return {
        status: 200,
        depositDetails,
      };
    } catch (error) {
      console.error('Error fetching deposit data:', error);
  
      return {
        status: 500,
        message: 'An error occurred while fetching deposit data.',
      };
    }
  }
