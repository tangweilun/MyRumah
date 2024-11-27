import { PrismaClient } from '@prisma/client';
import { ethers } from "ethers";
import { parseUnits } from "ethers";
import { AgreementContractAddress } from "../../src/utils/smartContractAddress";
import agreementAbi from "../../src/abi/agreementContract.json";
const prisma = new PrismaClient();
const getContract = async () => {
  const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // Local blockchain (e.g., Hardhat)
  const signer = await provider.getSigner();
  const contractAddress = AgreementContractAddress; // Replace with actual deployed contract address
  console.log(contractAddress);
  if (!contractAddress) {
    throw new Error(
      "Contract address (NEXT_PUBLIC_AGREEMENT_CONTRACT_ADDRESS) is missing."
    );
  }
  const agreementContract = new ethers.Contract(
    contractAddress,
    agreementAbi.abi,
    signer
  );

  return agreementContract;
};

export async function createAgreement(proposalId: number) {
  try {
    // Fetch the proposal and related data
    const proposal = await prisma.proposal.findUnique({
      where: { proposal_id: proposalId },
      include: {
        property: {
          include: {
            owner: true, // Include the owner details
          },
        },
        tenant: true, // Include tenant details
      },
    });

    if (!proposal) {
      return { status: 404, message: 'Proposal not found.' };
    }

    if (proposal.status !== 'approved') {
      return { status: 400, message: 'Proposal is not approved.' };
    }

    const { property } = proposal;
    const owner = property.owner;
    const tenant = proposal.tenant;

    if (!tenant || !owner) {
      return { status: 404, message: 'Owner or tenant details not found.' };
    }

    const deposit = parseFloat(property.rental_fee.toString()) * 1.5;
    const startDate = new Date(property.start_date);
    const endDate = new Date(property.end_date);

    const durationInMonths = Math.ceil(
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth())
    );

    const content = `Agreement between owner (${owner.username}) and tenant (${tenant.username}) for the property at ${property.address}. The rental duration is ${durationInMonths} month(s).`;

    // Create agreement in Prisma database
    const agreement = await prisma.agreement.create({
      data: {
        proposal_id: proposalId,
        content: content,
        deposit: deposit,
        deposit_status: 'pending',
        init_rental_fee: property.rental_fee,
        initial_fee_status: 'pending',
        tenant_signature: false,
        owner_signature: false,
        agreement_status: 'pending',
      },
    });

    // Call the createAgreement function in the smart contract
    const agreementContract = await getContract();

    const agreementTx = await agreementContract.createAgreement(
      proposalId, // proposalId
      content, // content
      parseUnits(deposit.toString(), "ether"), // deposit in wei
      parseUnits(property.rental_fee.toString(), "ether"), // rentalFee in wei
      'pending', // depositStatus
      'pending' // agreementStatus
    );

    // Wait for transaction to be mined
    const receipt = await agreementTx.wait();

    console.log('Transaction receipt:', receipt);

    return { status: 200, agreement, transactionHash: receipt.transactionHash };
  } catch (error) {
    console.error('Error creating agreement:', error);
    return { status: 500, message: 'Error occurred while creating agreement.' };
  }
}


export async function updateAgreement(
  agreementId: number,
  action: 'sign' | 'approve' | 'editDeposit' | 'resetSignatures',
  userType?: 'owner' | 'tenant',
  newDepositStatus?: 'pending' | 'submitted' | 'pending_returned' | 'returned' // Strict type for deposit statuses
) {
  try {
    // Fetch the agreement along with related details
    const agreement = await prisma.agreement.findUnique({
      where: { agreement_id: agreementId },
      include: {
        proposal: {
          include: {
            property: true, // Include property details
          },
        },
      },
    });

    if (!agreement) {
      return { status: 404, message: 'Agreement not found.' };
    }

    const currentDate = new Date();
    const { start_date, end_date } = agreement.proposal.property;

    // Get the smart contract instance
    const agreementContract = await getContract();

    if (action === 'sign') {
      if (!userType) {
        return { status: 400, message: 'User type is required for signing.' };
      }

      // Determine the signature update based on user type
      const updatedTenantSignature = userType === 'tenant' ? true : agreement.tenant_signature;
      const updatedOwnerSignature = userType === 'owner' ? true : agreement.owner_signature;

      // Call the smart contract to update the agreement
      const tx = await agreementContract.updateAgreement(
        agreementId,
        agreement.deposit_status,
        agreement.agreement_status,
        updatedTenantSignature,
        updatedOwnerSignature
      );

      await tx.wait(); // Wait for the transaction to be confirmed

      // Update the local database with the new signatures
      await prisma.agreement.update({
        where: { agreement_id: agreementId },
        data: {
          tenant_signature: updatedTenantSignature,
          owner_signature: updatedOwnerSignature,
        },
      });

      return {
        status: 200,
        message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} has signed the agreement.`,
      };
    } else if (action === 'approve') {
      if (!agreement.owner_signature || !agreement.tenant_signature) {
        return { status: 400, message: 'Both owner and tenant must sign the agreement before approval.' };
      }

      // Determine the agreement and deposit statuses
      let agreementStatus = agreement.agreement_status;
      let depositStatus = agreement.deposit_status;

      if (currentDate > end_date) {
        agreementStatus = 'completed';
        depositStatus = 'pending_returned';
      } else if (currentDate >= start_date && currentDate <= end_date) {
        agreementStatus = 'ongoing';
      } else if (currentDate < start_date) {
        agreementStatus = 'expired';
      }

      // Call the smart contract to update the agreement
      const tx = await agreementContract.updateAgreement(
        agreementId,
        depositStatus,
        agreementStatus,
        agreement.tenant_signature,
        agreement.owner_signature
      );

      await tx.wait(); // Wait for the transaction to be confirmed

      // Update the local database with the new statuses
      await prisma.agreement.update({
        where: { agreement_id: agreementId },
        data: {
          agreement_status: agreementStatus,
          deposit_status: depositStatus,
        },
      });

      return {
        status: 200,
        message: `Agreement has been updated to status: ${agreementStatus}.`,
      };
    } else if (action === 'editDeposit') {
      if (!newDepositStatus) {
        return { status: 400, message: 'New deposit status is required for editing deposit.' };
      }

      // Validate the new deposit status
      const validDepositStatuses = ['pending', 'submitted', 'pending_returned', 'returned'];
      if (!validDepositStatuses.includes(newDepositStatus)) {
        return { status: 400, message: `Invalid deposit status. Allowed values are: ${validDepositStatuses.join(', ')}.` };
      }

      // Call the smart contract to update the deposit status
      const tx = await agreementContract.updateAgreement(
        agreementId,
        newDepositStatus,
        agreement.agreement_status,
        agreement.tenant_signature,
        agreement.owner_signature
      );

      await tx.wait(); // Wait for the transaction to be confirmed

      // Update the local database with the new deposit status
      await prisma.agreement.update({
        where: { agreement_id: agreementId },
        data: {
          deposit_status: newDepositStatus,
        },
      });

      return {
        status: 200,
        message: `Deposit status updated to ${newDepositStatus}.`,
      };
    } else if (action === 'resetSignatures') {
      // Reset both owner and tenant signatures to false
      const tx = await agreementContract.updateAgreement(
        agreementId,
        agreement.deposit_status,
        agreement.agreement_status,
        false, // Reset tenant signature
        false  // Reset owner signature
      );

      await tx.wait(); // Wait for the transaction to be confirmed

      // Reset signatures in the local database
      await prisma.agreement.update({
        where: { agreement_id: agreementId },
        data: {
          tenant_signature: false,
          owner_signature: false,
        },
      });

      return {
        status: 200,
        message: 'Owner and tenant signatures have been reset to false.',
      };
    } else {
      return { status: 400, message: 'Invalid action. Valid actions are "sign", "approve", "editDeposit", or "resetSignatures".' };
    }
  } catch (error) {
    console.error('Error updating agreement:', error);
    return { status: 500, message: 'Error updating agreement.' };
  }
}

  
export async function getAgreementsByUserId(userId: number, userType: 'tenant' | 'owner') {
  try {
    // Step 1: Fetch agreements based on the user ID and role from the database
    const agreements = await prisma.agreement.findMany({
      where: {
        proposal: {
          OR: [
            userType === 'tenant' ? { tenant_id: userId } : {},
            userType === 'owner' ? { property: { owner_id: userId } } : {},
          ],
        },
      },
      include: {
        proposal: {
          include: {
            tenant: true,
            property: {
              include: {
                owner: true,
              },
            },
          },
        },
      },
    });

    if (!agreements.length) {
      return { status: 404, message: 'No agreements found for the provided userId.' };
    }

    // Step 2: Call the smart contract to fetch hashed agreement details
    // const agreementContract = await getContract(); // Assume this function initializes the contract
    // const hashedAgreements = await Promise.all(
    //   agreements.map(async (agreement) => {
    //     const hashedDetails = await agreementContract.getAgreement(agreement.agreement_id);
    //     return {
    //       ...agreement,
    //       hashedAgreement: {
    //         agreementId: hashedDetails[0].toNumber(),
    //         proposalId: hashedDetails[1].toNumber(),
    //         content: hashedDetails[2],
    //         deposit: hashedDetails[3].toNumber(),
    //         depositStatus: hashedDetails[4],
    //         rentalFee: hashedDetails[5].toNumber(),
    //         agreementStatus: hashedDetails[6],
    //         tenantSignature: hashedDetails[7],
    //         ownerSignature: hashedDetails[8],
    //         agreementHash: hashedDetails[9],
    //       },
    //     };
    //   })
    // );

    return { status: 200, agreements: agreements };
  } catch (error) {
    console.error('Error fetching agreements:', error);
    return { status: 500, message: 'Error occurred while fetching agreements.' };
  }
}

export async function getAgreementById(agreementId: number) {
  try {
    // Step 1: Fetch the agreement from the database based on the agreement ID
    const agreement = await prisma.agreement.findUnique({
      where: { agreement_id: agreementId },
      include: {
        proposal: {
          include: {
            tenant: true,
            property: {
              include: {
                owner: true,
              },
            },
          },
        },
      },
    });

    if (!agreement) {
      return { status: 404, message: 'Agreement not found for the provided agreementId.' };
    }

    return { status: 200, agreement };
  } catch (error) {
    console.error('Error fetching agreement:', error);
    return { status: 500, message: 'Error occurred while fetching the agreement.' };
  }
}



