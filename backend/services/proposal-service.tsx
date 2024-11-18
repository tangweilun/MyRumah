import prisma from '../../lib/prisma';
import { Prisma, ProposalStatus, UserRole } from '@prisma/client';

const isProposalStatus = (
  proposalStatus: string
): proposalStatus is ProposalStatus =>
  Object.values(ProposalStatus).includes(proposalStatus as ProposalStatus);

const isUserRole = (role: string): role is UserRole =>
  Object.values(UserRole).includes(role as UserRole);

async function getAllProposal(userId: number, userRole: string) {
  if (!isUserRole(userRole)) {
    return { status: 401 };
  }
  const tenantFindManyQuery: Prisma.ProposalFindManyArgs = {
    where: {
      tenant_id: userId,
      property: {
        status: 'active',
      },
    },
    include: {
      // relation name: property
      property: {
        select: {
          address: true,
          description: true,
          occupant_num: true,
          rental_fee: true,
          // relation name : owner
          owner: {
            select: {
              username: true,
              email: true,
              phone_number: true,
            },
          },
        },
      },
    },
    orderBy: [{ status: 'asc' }, { created_date: 'desc' }],
  };

  const ownerFindManyQuery: Prisma.ProposalFindManyArgs = {
    where: {
      property: {
        owner_id: userId,
        status: 'active',
      },
    },
    include: {
      // relation name: property
      property: {
        select: {
          address: true,
          description: true,
          occupant_num: true,
          rental_fee: true,
          // relation name : owner
          owner: {
            select: {
              username: true,
              email: true,
              phone_number: true,
            },
          },
        },
      },
    },
    orderBy: [{ status: 'asc' }, { created_date: 'desc' }],
  };

  let currFindManyQuery = null;

  if (userRole === UserRole.tenant) {
    currFindManyQuery = tenantFindManyQuery;
  } else if (userRole === UserRole.owner) {
    currFindManyQuery = ownerFindManyQuery;
  }

  // due to not matched user role
  if (!currFindManyQuery) {
    return { status: 401 };
  }

  try {
    const allProposal = await prisma.proposal.findMany(currFindManyQuery);

    if (!allProposal) {
      return { status: 404 };
    }

    return {
      status: 200,
      proposalList: allProposal,
    };
  } catch (error) {
    console.error('Error in retrieving proposal list from database: ', error);
    return { status: 500 };
  }
}

async function getSpecTenantProposal(
  tenantId: number,
  ownerId: number,
  userRole: string
) {
  if (!isUserRole(userRole)) {
    return { status: 401 };
  }

  if (userRole !== UserRole.owner) {
    return { status: 403 };
  }

  try {
    const specTenantProposal = await prisma.proposal.findMany({
      where: {
        tenant_id: tenantId,
        property: {
          owner_id: ownerId,
        },
      },
      include: {
        property: true,
      },
      orderBy: [{ status: 'asc' }, { created_date: 'desc' }],
    });

    if (!specTenantProposal) {
      return { status: 404 };
    }

    return {
      status: 200,
      specTenantProposal: specTenantProposal,
    };
  } catch (error) {
    console.error(
      'Error in retrieving proposal list of specific tenant from database: ',
      error
    );
    return { status: 500 };
  }
}

async function getSpecProposal(proposalId: number) {
  try {
    const specProposal = await prisma.proposal.findUnique({
      where: {
        proposal_id: proposalId,
      },
      include: {
        property: true,
      },
    });

    if (!specProposal) {
      return { status: 404 };
    }

    return { status: 200, specProposal: specProposal };
  } catch (error) {
    console.error(
      'Error in retrieving specified proposal from database: ',
      error
    );
    return { status: 500 };
  }
}

async function createProposal(tenantId: number, propertyId: number) {
  if (!tenantId || !propertyId) {
    return { status: 400 };
  }

  const initialStatus = 'pending';
  try {
    const newProposal = await prisma.proposal.create({
      data: {
        tenant_id: tenantId,
        property_id: propertyId,
        status: ProposalStatus[initialStatus as keyof typeof ProposalStatus],
      },
      include: {
        property: true,
      },
    });

    return { status: 200, newProposal: newProposal };
  } catch (error) {
    console.error('Error in creating new proposal: ', error);
    return { status: 500 };
  }
}

async function updateProposalStatus(
  proposalId: number,
  proposalStatus: string,
  userRole: string
) {
  if (!isUserRole(userRole)) {
    return { status: 401 };
  }

  if (!isProposalStatus) {
    return { status: 400 };
  }

  try {
    // check current of specified proposal
    const currProposalStatus = await prisma.proposal.findUnique({
      where: {
        proposal_id: proposalId,
      },
      select: {
        status: true,
      },
    });

    if (!currProposalStatus) {
      return { status: 404 };
    }
    // tenant and owner cannot modify status anymore if the status is rejected/approved/cancelled
    if (currProposalStatus.status !== ProposalStatus.pending) {
      return { status: 400 };
    }

    if (userRole === UserRole.tenant) {
      if (proposalStatus !== ProposalStatus.cancelled) {
        // tenant can only change status from pending to cancelled, not others
        return { status: 400 };
      }
    } else if (userRole === UserRole.owner) {
      if (
        proposalStatus !== ProposalStatus.approved &&
        proposalStatus !== ProposalStatus.rejected
      ) {
        // owner can only change status from pending to approved/rejected, not others
        return { status: 400 };
      }
    }
    // if update failed such as not found, prisma will throw error
    // if success, by default will returned all fields
    const updatedProposal = await prisma.proposal.update({
      where: {
        proposal_id: proposalId,
      },
      data: {
        status: ProposalStatus[proposalStatus as keyof typeof ProposalStatus],
      },
    });

    return { status: 200, updatedProposal: updatedProposal };
  } catch (error) {
    console.error(
      'Error in updating status of specified proposal from database: ',
      error
    );
    return { status: 500 };
  }
}

export {
  getAllProposal,
  getSpecTenantProposal,
  getSpecProposal,
  createProposal,
  updateProposalStatus,
};
