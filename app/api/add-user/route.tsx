
// Simulating the register function (for hardcoded values)
// const registerData = {
//   username: "chunkee",
//   password: "CKchunkee8181",
//   email: "ck@gmail.com",
//   phoneNumber: "0173538126",
//   userRole: "tenant"
// };
// import { NextResponse } from 'next/server';
import { register } from '../../../backend/services/user-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userData } = await request.json();
    
    // Here, you can handle saving the userData to a database or any other logic.
    // For now, we will just return the received data.

    console.log('Received user data:', userData);
    const result = await register(userData);
    return NextResponse.json({
      status: 'success',
      receivedData: userData, // Return the received data back to the frontend
      message: result,
    });
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to process the request.',
    });
  }
}








