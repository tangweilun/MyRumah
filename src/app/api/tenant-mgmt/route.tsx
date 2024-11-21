import { getAllTenant } from "@backend/services/tenant-mgmt-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // dummy
  // in future will get owner role and id form token passed by frontend using http request
  const userRole = "owner";
  const ownerId = 1;

  try {
    const result = await getAllTenant(ownerId, userRole);

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
