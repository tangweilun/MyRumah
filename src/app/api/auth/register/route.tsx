// app/api/add-user/route.tsx

import { register } from "@backend/services/auth-service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const userData = await req.json(); // Parse JSON body
    // console.log("Received data:", userData);

    if (!userData) {
      return NextResponse.json({
        status: 400,
        message: "Missing registration information.",
      });
    }

    const result = await register(
      userData.username,
      userData.password,
      userData.email,
      userData.phoneNumber,
      userData.userRole
    );

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        newUser: result.newUser,
        message: "Registered successfully!",
      });
    } else if (result.status === 400) {
      return NextResponse.json({
        status: result.status,
        message: "Incomplete registration information!",
      });
    } else if (result.status === 401) {
      return NextResponse.json({
        status: result.status,
        message: "Invalid registration credential!",
      });
    } else if (result.status === 409) {
      return NextResponse.json({
        status: result.status,
        message: "Account exist. Please use another email or role to register.",
      });
    } else if (result.status === 500) {
      return NextResponse.json(
        { message: "Error occurred when registering user." },
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
