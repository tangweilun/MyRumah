import { createProperty } from '@backend/services/property-service';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const propertyData = await req.json(); // Parse JSON body
    console.log('Received property data:', propertyData);

    if (!propertyData) {
      return NextResponse.json({
        status: 400,
        message: 'Missing property information.',
      });
    }

    const result = await createProperty(
      propertyData.ownerId,
      propertyData.address,
      Buffer.from(propertyData.image, 'base64'), // Assuming the image is sent as a base64 string
      propertyData.description,
      propertyData.occupantNum,
      propertyData.rentalFee,
      new Date(propertyData.startDate),
      new Date(propertyData.endDate),
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
