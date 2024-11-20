import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createAgreement(proposalId: number) {
    try {
      // Fetch the proposal and its related data (property, owner, and tenant info)
      const proposal = await prisma.proposal.findUnique({
        where: { proposal_id: proposalId },
        include: {
          property: {
            include: {
              owner: true, // Include the owner details
            },
          },
          tenant: true, // Assuming 'tenant' is the relation name for the tenant in the Proposal model
        },
      });
  
      if (!proposal) {
        return { status: 404, message: 'Proposal not found.' };
      }
  
      // Check if the proposal is approved
      if (proposal.status !== 'approved') {
        return { status: 400, message: 'Proposal is not approved.' };
      }
  
      // Extract necessary details
      const { property } = proposal;
      const owner = property.owner;
      const tenant = proposal.tenant;
  
      if (!tenant || !owner) {
        return { status: 404, message: 'Owner or tenant details not found.' };
      }
  
      // Calculate deposit (1.5 - 2 months of rental fee)
      const deposit = parseFloat(property.rental_fee.toString()) * 1.5;
  
      // Calculate the duration of the renting process in months
      const startDate = new Date(property.start_date);
      const endDate = new Date(property.end_date);
  
      const durationInMonths = Math.ceil(
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth())
      );
  
      // Generate agreement content
      const content = `Agreement between owner (${owner.username}) and tenant (${tenant.username}) for the property at ${property.address}. The rental duration is ${durationInMonths} month(s).`;
  
      // Create agreement
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
  
      return { status: 200, agreement };
    } catch (error) {
      console.error('Error creating agreement:', error);
      return { status: 500, message: 'Error occurred while creating agreement.' };
    }
  }
  

  export async function updateAgreement(
    agreementId: number,
    action: 'sign' | 'approve' | 'editDeposit',
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
  
      if (action === 'sign') {
        if (!userType) {
          return { status: 400, message: 'User type is required for signing.' };
        }
  
        const updateData = userType === 'owner'
          ? { owner_signature: true }
          : { tenant_signature: true };
  
        await prisma.agreement.update({
          where: { agreement_id: agreementId },
          data: updateData,
        });
  
        return {
          status: 200,
          message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} has signed the agreement.`,
        };
      } else if (action === 'approve') {
        if (!agreement.owner_signature || !agreement.tenant_signature) {
          return { status: 400, message: 'Both owner and tenant must sign the agreement before approval.' };
        }
  
        let agreementStatus = agreement.agreement_status;
        let depositStatus = agreement.deposit_status;
  
        // Determine the agreement status
        if (currentDate > end_date) {
          agreementStatus = 'completed';
          depositStatus = 'pending_returned'; // Status changes to `pending_returned`
        } else if (currentDate >= start_date && currentDate <= end_date) {
          agreementStatus = 'ongoing';
        } else if (currentDate < start_date) {
          agreementStatus = 'expired';
        }
  
        // Update agreement status and deposit status if needed
        await prisma.agreement.update({
          where: { agreement_id: agreementId },
          data: { agreement_status: agreementStatus, deposit_status: depositStatus },
        });
  
        return {
          status: 200,
          message: `Agreement has been updated to status: ${agreementStatus}.`,
        };
      } else if (action === 'editDeposit') {
        if (!newDepositStatus) {
          return { status: 400, message: 'New deposit status is required for editing deposit.' };
        }
  
        // Validate that the new deposit status is within the enum values
        const validDepositStatuses = ['pending', 'submitted', 'pending_returned', 'returned'];
        if (!validDepositStatuses.includes(newDepositStatus)) {
          return { status: 400, message: `Invalid deposit status. Allowed values are: ${validDepositStatuses.join(', ')}.` };
        }
  
        await prisma.agreement.update({
          where: { agreement_id: agreementId },
          data: { deposit_status: newDepositStatus },
        });
  
        return {
          status: 200,
          message: `Deposit status updated to ${newDepositStatus}.`,
        };
      } else {
        return { status: 400, message: 'Invalid action. Valid actions are "sign", "approve", or "editDeposit".' };
      }
    } catch (error) {
      console.error('Error updating agreement:', error);
      return { status: 500, message: 'Error updating agreement.' };
    }
  }
  
  