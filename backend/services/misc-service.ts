import prisma from "../../lib/prisma";

async function chkUserRole(
  userId: number
): Promise<{ status: number; userRole: string | null }> {
  try {
    const user = await prisma.userInfo.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        role: true,
      },
    });
    if (!user) {
      return { status: 404, userRole: null };
    }
    return { status: 200, userRole: user.role };
  } catch (error) {
    console.error("Error in retrieving user role from database: ", error);
    return { status: 500, userRole: null };
  }
}

async function chkPropertyExpiration(
  propertyId: number
): Promise<{ status: number; isExpired: boolean | null }> {
  try {
    const property = await prisma.propertyInfo.findUnique({
      where: {
        property_id: propertyId,
      },
      select: {
        start_date: true,
      },
    });

    if (!property) {
      return { status: 404, isExpired: null };
    }

    if (new Date() > property.start_date) {
      return { status: 400, isExpired: true };
    }
    return { status: 200, isExpired: false };
  } catch (error) {
    console.error("Error in retrieving property from database: ", error);
    return { status: 500, isExpired: null };
  }
}

async function chkPropertyStatus(
  propertyId: number
): Promise<{ status: number; propertyStatus: string | null }> {
  try {
    const property = await prisma.propertyInfo.findUnique({
      where: {
        property_id: propertyId,
      },
      select: {
        status: true,
      },
    });

    if (!property) {
      return { status: 404, propertyStatus: null };
    }

    return { status: 200, propertyStatus: property.status };
  } catch (error) {
    console.error("Error in retrieving property from database: ", error);
    return { status: 500, propertyStatus: null };
  }
}

export { chkUserRole, chkPropertyExpiration, chkPropertyStatus };
