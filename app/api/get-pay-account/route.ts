import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerGuid = searchParams.get("partnerGuid");
    const offerId = searchParams.get("offerId");

    if (!partnerGuid || !offerId) {
      return NextResponse.json(
        { error: "Missing required parameters: partnerGuid and offerId" },
        { status: 400 }
      );
    }

    const uuid = uuidv4();

    console.log("Get Pay Account - Request:", { partnerGuid, offerId });

    const authHeader = request.headers.get("authorization") || "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: authHeader,
      "X-IBM-Client-Id": process.env.NEXT_PUBLIC_IBM_CLIENT_ID || "",
      "X-IBM-Client-Secret": process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET || "",
      "x-fapi-interaction-id": uuid,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/nominated/partners/${partnerGuid}/pay-account?offerid=${offerId}`,
      {
        method: "GET",
        headers,
      }
    );

    console.log("Get Pay Account - Response Status:", res.status);

    const responseText = await res.text();
    console.log("Get Pay Account - Response Text:", responseText);

    // Try to parse as JSON
    let data: any;
    try {
      data = responseText ? JSON.parse(responseText) : { accounts: [] };
    } catch (parseError) {
      console.error("Failed to parse response:", responseText);
      data = { accounts: [], rawResponse: responseText, error: "Invalid JSON response" };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Error fetching pay account:", error);
    return NextResponse.json(
      { error: error?.message || "Unknown error", accounts: [] },
      { status: 500 }
    );
  }
}
