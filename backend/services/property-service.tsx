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