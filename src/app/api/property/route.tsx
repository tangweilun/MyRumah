import { createProperty } from '@backend/services/property-service';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON body instead of FormData
    
    // Extract the property data from the parsed JSON body
    const propertyData = {
      ownerId: body.ownerId,
      address: body.address,
      image: body.image, // base64 image string
      description: body.description,
      occupantNum: body.occupantNum,
      rentalFee: body.rentalFee,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      status: body.status,
    };
    console.log(propertyData);

    if (!propertyData) {
      return NextResponse.json({
        status: 400,
        message: 'Missing property information.',
      });
    }

    // Convert the base64 image to a Buffer
    const imageBuffer = Buffer.from(propertyData.image.split(',')[1], 'base64');

    const result = await createProperty(
      propertyData.ownerId,
      propertyData.address,
      imageBuffer, // Use the image buffer created from base64
      propertyData.description,
      propertyData.occupantNum,
      propertyData.rentalFee,
      propertyData.startDate,
      propertyData.endDate,
      propertyData.status
    );

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        property: result.property,
        message: 'Property created successfully!',
      });
    } else if (result.status === 400) {
      return NextResponse.json({
        status: result.status,
        message: result.message,
      });
    } else if (result.status === 500) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Error occurred while processing POST request' },
      { status: 500 }
    );
  }
}



import { getPropertiesByUser } from "@backend/services/property-service";
import { PropertyInfo } from "@prisma/client";

export async function GET(req: Request) {
  try {
    // Extract user info from the request (e.g., token or query params)
    const url = new URL(req.url);
    const userId = parseInt(url.searchParams.get("userId") || "0");
    const role = url.searchParams.get("role"); // 'owner' or 'tenant'

    if (!userId || !role) {
      return new Response(JSON.stringify({ message: "Invalid userId or role." }), { status: 400 });
    }

    // Fetch properties based on user role
    const properties: PropertyInfo[] = await getPropertiesByUser(userId, role);
    console.log(properties);

    // Return the properties as a JSON response
    return new Response(JSON.stringify({ properties }), { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response(JSON.stringify({ message: "Internal server error." }), { status: 500 });
  }
}




