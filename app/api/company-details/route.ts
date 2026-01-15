import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const uuid = uuidv4();

    console.log("Company Details Update - Request Body:", JSON.stringify(body, null, 2));

    const authHeader = request.headers.get("authorization") || "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authHeader,
      "X-IBM-Client-Id": process.env.NEXT_PUBLIC_IBM_CLIENT_ID || "",
      "X-IBM-Client-Secret": process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET || "",
      "x-fapi-interaction-id": uuid,
      "X-Client-Certificate": process.env.NEXT_PUBLIC_CLIENT_CERTIFICATE || "",
      "x-user-id": "SFCOMUSR",
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/company-details-for-ao/company`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      }
    );

    console.log("Company Details Update - Response Status:", res.status);

    const responseText = await res.text();
    console.log("Company Details Update - Response Text:", responseText);

    // Try to parse as JSON
    let data: any;
    try {
      data = responseText ? JSON.parse(responseText) : { message: "Success - No response body" };
    } catch (parseError) {
      console.error("Failed to parse response:", responseText);
      data = { rawResponse: responseText, error: "Invalid JSON response" };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Error updating company details:", error);
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
