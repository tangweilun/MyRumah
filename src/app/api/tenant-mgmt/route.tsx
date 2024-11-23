import { getAllTenant } from "@backend/services/tenant-mgmt-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ownerId = req.headers.get("User-Id");
  if (!ownerId) {
    return NextResponse.json(
      {
        message: "You are unauthorized to retrieve tenant list.",
      },
      { status: 401 }
    );
  }

  try {
    const result = await getAllTenant(parseInt(ownerId));

    if (result.status === 200) {
      return NextResponse.json({
        status: result.status,
        tenantList: result.tenantList,
        message: "Tenant list is retrieved successfully!",
      });
    } else if (result.status === 401) {
      return NextResponse.json(
        { message: "You are unauthorized to retrieve tenant list." },
        { status: result.status }
      );
    } else if (result.status === 403) {
      return NextResponse.json(
        { message: "You are forbidden to retrieve tenant list." },
        { status: result.status }
      );
    } else if (result.status === 404) {
      return NextResponse.json(
        { message: "Tenant list not found." },
        { status: result.status }
      );
    } else if (result.status === 500) {
      return NextResponse.json(
        { message: "Error occured when retrieving tenant list." },
        { status: result.status }
      );
    }
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json(
      { message: "Error occurred while processing GET request" },
      { status: 500 }
    );
  }
}
