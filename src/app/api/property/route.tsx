import { createProperty } from "@backend/services/property-service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON body instead of FormData

    // Extract the property data from the parsed JSON body
    const propertyData = {
      ownerId: body.ownerId,
      address: body.address,
      images: body.images, // Array of base64 image strings
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
        message: "Missing property information.",
      });
    }

    // Validate the images field
    if (
      !Array.isArray(propertyData.images) ||
      propertyData.images.some((img) => typeof img !== "string")
    ) {
      return NextResponse.json({
        status: 400,
        message: "Invalid or missing images.",
      });
    }

    // Convert the base64 images to an array of Buffers
    const imageBuffers = propertyData.images.map((imageBase64) =>
      Buffer.from(imageBase64.split(",")[1], "base64")
    );

    const result = await createProperty(
      propertyData.ownerId,
      propertyData.address,
      imageBuffers, // Use the array of image buffers
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
        message: "Property created successfully!",
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
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error occurred while processing POST request" },
      { status: 500 }
    );
  }
}

import { getPropertiesByUser } from "@backend/services/property-service";
import { getAllProperties } from "@backend/services/property-service";
import { PropertyInfo } from "@prisma/client";

export async function GET(req: Request) {
  try {
    // Extract user info from the request (e.g., token or query params)
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const role = url.searchParams.get("role"); // 'owner' or 'tenant'
    const location = url.searchParams.get("location");
    console.log(userId);
    console.log(role);

    let properties: PropertyInfo[];

    if (!userId && !role) {
      // Guest: Fetch all properties
      properties = await getAllProperties(location ? location : undefined);
    } else if (!userId || !role) {
      // Invalid combination of userId or role
      return new Response(
        JSON.stringify({ message: "Invalid userId or role." }),
        { status: 400 }
      );
    } else {
      // Fetch properties based on user role
      properties = await getPropertiesByUser(parseInt(userId), role);
    }

    console.log(properties);

    // Return the properties as a JSON response
    return new Response(JSON.stringify({ properties }), { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
    });
  }
}
