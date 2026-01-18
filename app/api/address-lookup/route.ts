import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { streetValue, province } = body;

    if (!streetValue) {
      return NextResponse.json(
        { error: "streetValue is required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: 401 }
      );
    }

    const uuid = uuidv4();

    console.log("Address Search Request:", { streetValue, province });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/prosource-lookup/streets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-IBM-Client-Id": process.env.NEXT_PUBLIC_IBM_CLIENT_ID!,
          "X-IBM-Client-Secret": process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET!,
          "x-fapi-interaction-id": uuid,
          "Authorization": authHeader,
          "x-client-certificate": process.env.NEXT_PUBLIC_CLIENT_CERTIFICATE || "",
        },
        body: JSON.stringify({
          province: province || "",
          streetValue: streetValue,
        }),
      }
    );

    const data = await response.json();
    console.log("Address Search Response:", JSON.stringify(data, null, 2));
    
    return NextResponse.json(data, { status: response.status });

  } catch (error: any) {
    console.error("Error searching address:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search address" },
      { status: 500 }
    );
  }
}
