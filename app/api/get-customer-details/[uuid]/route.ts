import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

    if (!uuid) {
      return NextResponse.json(
        { error: "UUID parameter is required" },
        { status: 400 }
      );
    }

    // Get access token from authorization header (this will be passed from the client)
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: 401 }
      );
    }

    // Generate unique interaction ID
    const interactionId = uuidv4();

    const headers: HeadersInit = {
      "X-IBM-Client-Id": process.env.NEXT_PUBLIC_IBM_CLIENT_ID!,
      "X-IBM-Client-Secret": process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET!,
      "x-fapi-interaction-id": interactionId,
      "ChannelId": process.env.NEXT_PUBLIC_SBG_CHANNEL_NAME!,
      "x-client-certificate": process.env.NEXT_PUBLIC_CLIENT_CERTIFICATE!,
      "Authorization": authHeader,
      "Content-Type": "application/json",
    };

    // Construct the API URL with the correct path
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/external-partners/customers/${uuid}`;

    console.log("Fetching customer details from:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Customer details API error:", response.status, errorText);
      return NextResponse.json(
        { error: `Failed to fetch customer details: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in customer details API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}