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
  

//sign agreement
export async function signAgreement(agreementId: number, userType: 'owner' | 'tenant') {
    try {
      // Fetch the agreement and related proposal and property details
      const agreement = await prisma.agreement.findUnique({
        where: { agreement_id: agreementId },
        include: {
          proposal: {
            include: {
              property: true, // Include property for owner details
            },
          },
        },
      });
  
      if (!agreement) {
        return { status: 404, message: 'Agreement not found.' };
      }
  
      // Update the respective signature field
      if (userType === 'owner') {
        await prisma.agreement.update({
          where: { agreement_id: agreementId },
          data: { owner_signature: true },
        });
        return { status: 200, message: 'Owner has signed the agreement.' };
      } else if (userType === 'tenant') {
        await prisma.agreement.update({
          where: { agreement_id: agreementId },
          data: { tenant_signature: true },
        });
        return { status: 200, message: 'Tenant has signed the agreement.' };
      } else {
        return { status: 400, message: 'Invalid user type.' };
      }
    } catch (error) {
      console.error('Error signing agreement:', error);
      return { status: 500, message: 'Error signing agreement.' };
    }
  }

  //approve or confirm agreement
  export async function approveAgreement(agreementId: number) {
    try {
      // Fetch the agreement to verify signatures
      const agreement = await prisma.agreement.findUnique({
        where: { agreement_id: agreementId },
      });
  
      if (!agreement) {
        return { status: 404, message: 'Agreement not found.' };
      }
  
      // Check if both signatures are present
      if (!agreement.owner_signature || !agreement.tenant_signature) {
        return { status: 400, message: 'Both owner and tenant must sign the agreement before approval.' };
      }
  
      // Approve the agreement
      await prisma.agreement.update({
        where: { agreement_id: agreementId },
        data: { agreement_status: 'completed' },
      });
  
      return { status: 200, message: 'Agreement has been approved successfully.' };
    } catch (error) {
      console.error('Error approving agreement:', error);
      return { status: 500, message: 'Error approving agreement.' };
    }
  }
  