import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const uuid = uuidv4();

    console.log("Related Parties Update - Request Body:", JSON.stringify(body, null, 2));

    const authHeader = request.headers.get("authorization") || "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authHeader,
      "X-IBM-Client-Id": process.env.NEXT_PUBLIC_IBM_CLIENT_ID || "",
      "X-IBM-Client-Secret": process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET || "",
      "x-fapi-interaction-id": uuid,
      "x-client-certificate": process.env.NEXT_PUBLIC_CLIENT_CERTIFICATE || "",
      "x-user-id": "SFCOMUSR",
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/related-party-details-for-ao/manage-party`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      }
    );

    console.log("Related Parties Update - Response Status:", res.status);

    const responseText = await res.text();
    console.log("Related Parties Update - Response Text:", responseText);

    // Try to parse as JSON, or return success message if empty and status is OK
    let data: any;
    try {
      data = responseText ? JSON.parse(responseText) : { success: true, message: "Related parties updated successfully" };
    } catch (parseError) {
      console.error("Failed to parse response:", responseText);
      // If response is empty and status is 2xx, treat as success
      if (!responseText && res.ok) {
        data = { success: true, message: "Related parties updated successfully" };
      } else {
        data = { rawResponse: responseText, error: "Invalid JSON response" };
      }
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Error updating related parties:", error);
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
