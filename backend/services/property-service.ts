import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { PropertyInfo } from '@prisma/client';

export async function createProperty(
  ownerId: number,
  address: string,
  images: Buffer[], // Accept multiple images as an array of Buffers
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

  if (
    !images ||
    !Array.isArray(images) ||
    images.length === 0 ||
    images.some((image) => !(image instanceof Buffer))
  ) {
    return { status: 400, message: "Invalid or missing images." };
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
        images, // Store multiple images as an array of Buffers
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


export async function getAllProperties(address?: string): Promise<PropertyInfo[]> {
  try {
    // Fetch all active properties with optional address filtering
    const properties = await prisma.propertyInfo.findMany({
      where: {
        status: 'active', // Filter properties with status "active"
        ...(address && { address: { contains: address, mode: 'insensitive' } }), // Filter by address if provided
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
      images?: Buffer[]; // Changed from `image` to `images`
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
  
        // Validate images if provided
        if (
          data.images &&
          (!Array.isArray(data.images) ||
            data.images.some((image) => !(image instanceof Buffer)))
        ) {
          return { status: 400, message: 'Invalid images provided.' };
        }
  
        // Update the property with provided fields
        const updatedProperty = await prisma.propertyInfo.update({
          where: { property_id: propertyId },
          data: {
            owner_id: data.ownerId,
            address: data.address,
            images: data.images, // Update images array
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
  