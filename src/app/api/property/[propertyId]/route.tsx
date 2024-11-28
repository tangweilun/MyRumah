import { editProperty } from '@backend/services/property-service';
import { getProperty } from '@backend/services/property-service';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { propertyId: string } }
) {
  try {
    const propertyId = parseInt(params.propertyId);
    const body = await req.json();
    const { deleteProperty, ...propertyData } = body;

    if (!propertyId || deleteProperty === undefined) {
      return NextResponse.json({
        status: 400,
        message: 'Missing property ID or deleteProperty flag.',
      });
    }

    // Validate and process images
    let imageBuffers: Buffer[] | undefined = undefined;
    if (propertyData.images) {
      if (
        !Array.isArray(propertyData.images) ||
        propertyData.images.some((img: string) => typeof img !== 'string') // Explicitly type 'img' as string
      ) {
        return NextResponse.json({
          status: 400,
          message: 'Invalid images format. Expecting an array of base64 strings.',
        });
      }
      // Convert base64 images to Buffers
      imageBuffers = propertyData.images.map((imageBase64: string) =>
        Buffer.from(imageBase64.split(',')[1], 'base64') // Explicitly type 'imageBase64' as string
      );
    }

    const result = await editProperty(propertyId, deleteProperty, {
      ownerId: propertyData.ownerId,
      address: propertyData.address,
      images: imageBuffers, // Pass the array of image buffers
      description: propertyData.description,
      occupantNum: propertyData.occupantNum,
      rentalFee: propertyData.rentalFee,
      startDate: propertyData.startDate ? new Date(propertyData.startDate) : undefined,
      endDate: propertyData.endDate ? new Date(propertyData.endDate) : undefined,
      status: propertyData.status,
    });

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        property: result.property,
        message: deleteProperty
          ? 'Property marked as trash successfully!'
          : 'Property updated successfully!',
      });
    } else {
      return NextResponse.json({ status: result.status, message: result.message });
    }
  } catch (error) {
    console.error('Error processing PATCH request:', error);
    return NextResponse.json(
      { message: 'Error occurred while processing request.' },
      { status: 500 }
    );
  }
}


export async function GET(req: Request, { params }: { params: { propertyId: string } }) {
    try {
      const propertyId = parseInt(params.propertyId);
  
      if (!propertyId) {
        return NextResponse.json({
          status: 400,
          message: 'Property ID is required.',
        });
      }
  
      const result = await getProperty(propertyId);
  
      if (result.status === 200) {
        return NextResponse.json({
          status: result.status,
          property: result.property,
        });
      } else if (result.status === 404) {
        return NextResponse.json({
          status: result.status,
          message: result.message,
        });
      } else {
        return NextResponse.json(
          { message: result.message },
          { status: result.status }
        );
      }
    } catch (error) {
      console.error('Error processing GET request:', error);
      return NextResponse.json(
        { message: 'Error occurred while processing request.' },
        { status: 500 }
      );
    }
  }