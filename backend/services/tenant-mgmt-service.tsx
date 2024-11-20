import prisma from "../../lib/prisma"; // Ensure Prisma is set up properly
import { UserRole } from "@prisma/client";

// All function with no export is set as private function by default

// a Type Guard to check the role match with Enum value or not
const isUserRole = (role: string): role is UserRole =>
  Object.values(UserRole).includes(role as UserRole);

async function getAllTenant(ownerId: number, userRole: string) {
  if (userRole != UserRole.owner) {
    return { status: 401 };
  }

  try {
    const allTenant = await prisma.userInfo.findMany({
      where: {
        role: "tenant",
        proposals: {
          // choose those with at least one proposal done with passed ownerId and related to active property published by that ownerId.
          some: {
            property: {
              owner_id: ownerId,
              // status: "active",
            },
          },
        },
      },
      include: {
        proposals: {
          where: {
            property: {
              owner_id: ownerId,
              // status: "active",
            },
          },
          include: { property: true },
        },
      },
    });

    if (!allTenant) {
      return { status: 404 };
    }

    return {
      status: 200,
      tenantList: allTenant,
    };
  } catch (error) {
    console.error("Error in retrieving tenant list from database: ", error);
    return { status: 500 };
  }
}

async function checkAccExist(email: string, role: UserRole) {
  try {
    const count = await prisma.userInfo.count({
      where: { email: email, role: role },
    });
    return count > 0 ? { exist: true } : { exist: false };
  } catch (error) {
    // console.error("Database error");
    // throw new Error("Database error");
    console.error("Database error");
    return { status: 500 };
  }
}

export { getAllTenant };
