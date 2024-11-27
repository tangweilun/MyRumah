import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { PropertyInfo } from '@prisma/client';

export async function createProperty(
  ownerId: number,
  address: string,
  image: Buffer,
  description: string,
  occupantNum: number,
  rentalFee: number,
  startDate: Date,
  endDate: Date,
  status: string
) {
  // Validate required fields
  if (!ownerId || typeof ownerId !== "number" || ownerId <= 0) {
    return { status: 400, message: "Invalid or missing ownerId." };
  }

  if (!address || typeof address !== "string" || address.trim().length === 0) {
    return { status: 400, message: "Invalid or missing address." };
  }

  if (!image || !(image instanceof Buffer)) {
    return { status: 400, message: "Invalid or missing image." };
  }

  if (!description || typeof description !== "string" || description.trim().length === 0) {
    return { status: 400, message: "Invalid or missing description." };
  }

  if (
    !occupantNum ||
    typeof occupantNum !== "number" ||
    occupantNum <= 0 ||
    !Number.isInteger(occupantNum)
  ) {
    return { status: 400, message: "Invalid or missing occupant number." };
  }

  if (!rentalFee || typeof rentalFee !== "number" || rentalFee <= 0) {
    return { status: 400, message: "Invalid or missing rental fee." };
  }

  if (!startDate || !(startDate instanceof Date) || isNaN(startDate.getTime())) {
    return { status: 400, message: "Invalid or missing start date." };
  }

  if (!endDate || !(endDate instanceof Date) || isNaN(endDate.getTime())) {
    return { status: 400, message: "Invalid or missing end date." };
  }

  if (startDate >= endDate) {
    return { status: 400, message: "Start date must be before end date." };
  }

  const validStatuses = ["active", "inactive", "occupied", "trash"];
  if (!status || typeof status !== "string" || !validStatuses.includes(status)) {
    return { status: 400, message: "Invalid or missing property status." };
  }

  try {
    // Create the new property in the database
    const newProperty = await prisma.propertyInfo.create({
      data: {
        owner_id: ownerId,
        address,
        image, // The image is passed as a Buffer
        description,
        occupant_num: occupantNum,
        rental_fee: rentalFee,
        start_date: startDate,
        end_date: endDate,
        status: status as any,
      },
    });

    return { status: 200, property: newProperty };
  } catch (error) {
    console.error("Error creating property in database:", error);
    return { status: 500, message: "Error creating property." };
  }
}



// Function to fetch properties based on user role
export async function getPropertiesByUser(userId: number, role: string): Promise<PropertyInfo[]> {
  try {
    if (role === "owner") {
      // Fetch properties owned by the user that are not "trash"
      const properties = await prisma.propertyInfo.findMany({
        where: {
          owner_id: userId,
          status: {
            not: "trash", // Exclude properties with status "trash"
          },
        },
        include: {
          owner: true, // Include owner details if needed
        },
      });
      return properties;
    } else if (role === "tenant") {
      // Fetch properties with status "active"
      const properties = await prisma.propertyInfo.findMany({
        where: {
          status: "active", // Include only active properties
        },
        include: {
          owner: true, // Include owner details if needed
        },
      });
      return properties;
    } else {
      throw new Error("Invalid role specified");
    }
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw new Error("Error fetching properties");
  }
}


export async function getAllProperties(): Promise<PropertyInfo[]> {
  try {
    // Fetch all active properties
    const properties = await prisma.propertyInfo.findMany({
      where: {
        status: 'active', // Filter properties with status "active"
      },
      include: {
        owner: true, // Include owner details if needed
      },
    });
    return properties;
  } catch (error) {
    console.error("Error fetching active properties:", error);
    throw new Error("Error fetching active properties");
  }
}



  //delete/edit
  export async function editProperty(
    propertyId: number,
    deleteProperty: boolean,
    data: {
      ownerId?: number;
      address?: string;
      image?: Buffer;
      description?: string;
      occupantNum?: number;
      rentalFee?: number;
      startDate?: Date;
      endDate?: Date;
      status?: string;
    }
  ) {
    try {
      if (deleteProperty) {
        // Mark the property status as 'trash'
        const updatedProperty = await prisma.propertyInfo.update({
          where: { property_id: propertyId },
          data: { status: 'trash' },
        });
        return { status: 200, property: updatedProperty };
      } else {
        // Validate the status if provided
        if (data.status) {
          const validStatuses = ['active', 'inactive', 'occupied', 'trash'];
          if (!validStatuses.includes(data.status)) {
            return { status: 400, message: 'Invalid property status.' };
          }
        }
  
        // Update the property with provided fields
        const updatedProperty = await prisma.propertyInfo.update({
          where: { property_id: propertyId },
          data: {
            owner_id: data.ownerId,
            address: data.address,
            image: data.image,
            description: data.description,
            occupant_num: data.occupantNum,
            rental_fee: data.rentalFee,
            start_date: data.startDate,
            end_date: data.endDate,
            status: data.status as any, // Casting for Prisma's enum type
            modified_date: new Date(), // Ensure the `@updatedAt` trigger
          },
        });
  
        return { status: 200, property: updatedProperty };
      }
    } catch (error) {
      console.error('Error updating property in database:', error);
      return { status: 500, message: 'Error updating property.' };
    }
  }

  export async function getProperty(propertyId: number) {
    try {
      const property = await prisma.propertyInfo.findUnique({
        where: { property_id: propertyId },
        include: {
          owner: true, // Include owner details
          proposals: true, // Include proposals associated with the property
          wishlists: true, // Include wishlists associated with the property
          WishlistProperty: true, // Include WishlistProperty association
        },
      });
  
      if (!property) {
        return { status: 404, message: 'Property not found.' };
      }
  
      return { status: 200, property };
    } catch (error) {
      console.error('Error fetching property from database:', error);
      return { status: 500, message: 'Error retrieving property.' };
    }
  }
  