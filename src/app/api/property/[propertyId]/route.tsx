import { editProperty } from '@backend/services/property-service';
import { getProperty } from '@backend/services/property-service';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { propertyId: string } }) {
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

    const result = await editProperty(propertyId, deleteProperty, {
      ownerId: propertyData.ownerId,
      address: propertyData.address,
      image: propertyData.image ? Buffer.from(propertyData.image, 'base64') : undefined,
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