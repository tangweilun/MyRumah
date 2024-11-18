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
  if (
    !ownerId ||
    !address ||
    !image ||
    !description ||
    !occupantNum ||
    !rentalFee ||
    !startDate ||
    !endDate ||
    !status
  ) {
    return { status: 400, message: 'Missing property details.' };
  }

  // Validate the property status against the enum
  const validStatuses = ['active', 'inactive', 'occupied', 'trash'];
  if (!validStatuses.includes(status)) {
    return { status: 400, message: 'Invalid property status.' };
  }

  try {
    const newProperty = await prisma.propertyInfo.create({
      data: {
        owner_id: ownerId,
        address: address,
        image: image,
        description: description,
        occupant_num: occupantNum,
        rental_fee: rentalFee,
        start_date: startDate,
        end_date: endDate,
        status: status as any, // Casting to match Prisma's enum type
      },
    });

    return { status: 200, property: newProperty };
  } catch (error) {
    console.error('Error creating property in database:', error);
    return { status: 500, message: 'Error creating property.' };
  }
}

// Function to fetch all properties from the database
export async function getAllProperties() {
    try {
      // Fetch all properties including related `owner` info (UserInfo relation)
      const properties = await prisma.propertyInfo.findMany({
        include: {
          owner: true, // Include related user info (UserInfo) if needed
        },
      });
  
      // Return the fetched properties
      return properties;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw new Error("Error fetching properties");
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
  