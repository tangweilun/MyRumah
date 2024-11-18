import { getAllProperties } from "@backend/services/property-service";

export async function GET(req: Request) {
  try {
    // Fetch all properties from the service
    const properties = await getAllProperties();

    // Return the properties as a JSON response
    return new Response(JSON.stringify({ properties }), { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response(JSON.stringify({ message: "Internal server error." }), { status: 500 });
  }
}
