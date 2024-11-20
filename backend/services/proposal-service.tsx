import prisma from "../../lib/prisma";
import {
  Prisma,
  ProposalStatus,
  UserRole,
  PropertyStatus,
} from "@prisma/client";
import {
  chkUserRole,
  chkPropertyExpiration,
  chkPropertyStatus,
} from "./misc-service";

const isProposalStatus = (
  proposalStatus: string
): proposalStatus is ProposalStatus =>
  Object.values(ProposalStatus).includes(proposalStatus as ProposalStatus);

const isUserRole = (role: string): role is UserRole =>
  Object.values(UserRole).includes(role as UserRole);

// async function getAllProposal(userId: number, userRole: string) {
async function getAllProposal(userId: number) {
  // if (!isUserRole(userRole)) {
  //   return { status: 401 };
  // }

  const chkRole = await chkUserRole(userId);
  if (chkRole.status != 200 || !chkRole.userRole) {
    return { status: chkRole.status };
  }

  const tenantFindManyQuery: Prisma.ProposalFindManyArgs = {
    where: {
      tenant_id: userId,
      // property: {
      //   status: "active",
      // },
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
      agreements: true,
    },
    orderBy: [{ status: "asc" }, { created_date: "desc" }],
  };

  const ownerFindManyQuery: Prisma.ProposalFindManyArgs = {
    where: {
      property: {
        owner_id: userId,
        status: "active",
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
      agreements: true,
    },
    orderBy: [{ status: "asc" }, { created_date: "desc" }],
  };

  let currFindManyQuery = null;

  if (chkRole.userRole === UserRole.tenant) {
    currFindManyQuery = tenantFindManyQuery;
  } else if (chkRole.userRole === UserRole.owner) {
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
    console.error("Error in retrieving proposal list from database: ", error);
    return { status: 500 };
  }
}

// async function getSpecTenantProposal(
//   tenantId: number,
//   ownerId: number,
//   userRole: string
// )
async function getSpecTenantProposal(tenantId: number, ownerId: number) {
  // if (!isUserRole(userRole)) {
  //   return { status: 401 };
  // }

  const chkRole = await chkUserRole(ownerId);
  if (chkRole.status != 200 || !chkRole.userRole) {
    return { status: chkRole.status };
  }

  if (chkRole.userRole !== UserRole.owner) {
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
        agreements: true,
      },
      orderBy: [{ status: "asc" }, { created_date: "desc" }],
    });

    if (!specTenantProposal || Object.keys(specTenantProposal).length === 0) {
      return { status: 404 };
    }

    return {
      status: 200,
      specTenantProposal: specTenantProposal,
    };
  } catch (error) {
    console.error(
      "Error in retrieving proposal list of specific tenant from database: ",
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
        agreements: true,
      },
    });

    if (!specProposal) {
      return { status: 404 };
    }

    return { status: 200, specProposal: specProposal };
  } catch (error) {
    console.error(
      "Error in retrieving specified proposal from database: ",
      error
    );
    return { status: 500 };
  }
}

async function createProposal(tenantId: number, propertyId: number) {
  if (!tenantId || !propertyId) {
    return { status: 400 };
  }

  const userRole = await chkUserRole(tenantId);
  if (userRole.status != 200 || !userRole.userRole) {
    return { status: userRole.status };
  }

  if (userRole.userRole !== UserRole.tenant) {
    return { status: 403 };
  }

  const initialStatus = "pending";

  try {
    // check current date and start date of property
    const isPropertyExpired = await chkPropertyExpiration(propertyId);
    if (
      !isPropertyExpired ||
      isPropertyExpired.status !== 200 ||
      isPropertyExpired.isExpired === null
    ) {
      return { status: isPropertyExpired?.status ?? 500 };
    }
    if (isPropertyExpired.isExpired === true) {
      return { status: isPropertyExpired.status };
    }
    // check property status
    const propertyStatus = await chkPropertyStatus(propertyId);
    if (
      !propertyStatus ||
      propertyStatus.status !== 200 ||
      propertyStatus.propertyStatus === null
    ) {
      return { status: propertyStatus?.status ?? 500 };
    }
    // only active property can be proposed
    if (propertyStatus.propertyStatus !== PropertyStatus.active) {
      return { status: isPropertyExpired.status };
    }

    // if current date is <= property start rental date
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
    console.error("Error in creating new proposal: ", error);
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
    const currProposal = await prisma.proposal.findUnique({
      where: {
        proposal_id: proposalId,
      },
      select: {
        status: true,
        property_id: true,
      },
    });

    if (!currProposal) {
      return { status: 404 };
    }
    // if current date is over the rental start date of the property, change the status to cancelled.
    const isPropertyExpired = await chkPropertyExpiration(
      currProposal.property_id
    );
    if (
      !isPropertyExpired ||
      isPropertyExpired.status !== 200 ||
      isPropertyExpired.isExpired === null
    ) {
      return { status: isPropertyExpired?.status ?? 500 };
    }

    if (isPropertyExpired.isExpired === true) {
      const cancelledStatus = "cancelled";
      if (proposalStatus !== ProposalStatus.cancelled) {
        const expiredProposal = await prisma.proposal.update({
          where: {
            proposal_id: proposalId,
          },
          data: {
            status:
              ProposalStatus[cancelledStatus as keyof typeof ProposalStatus],
          },
        });

        return { updatedProposal: expiredProposal, status: 400 };
      }
      // the proposal already cancelled before
      return { updatedProposal: currProposal, status: 400 };
    }
    if (currProposal.status !== ProposalStatus.pending) {
      // tenant and owner cannot modify status anymore if the status is rejected/approved/cancelled
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
      "Error in updating status of specified proposal from database: ",
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