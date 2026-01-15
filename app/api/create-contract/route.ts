import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authToken = request.headers.get("authorization");

    console.log("Authorization Header:", authToken ? "Present" : "Missing");

    if (!authToken) {
      return NextResponse.json(
        { error: "Authorization token is required" },
        { status: 401 }
      );
    }

    const offerId = body.createContractRequest?.offerId;

    console.log("Create Contract Request:", JSON.stringify(body, null, 2));
    console.log("Offer ID:", offerId);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/application/offer/${offerId}/contract`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-IBM-Client-Id": process.env.NEXT_PUBLIC_IBM_CLIENT_ID || "",
          "X-IBM-Client-Secret": process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET || "",
          "x-sbg-channel": "SBG",
          "x-fapi-interaction-id": uuidv4(),
          Authorization: authToken,
          "x-client-certificate": process.env.NEXT_PUBLIC_CLIENT_CERTIFICATE || "",
        },
        body: JSON.stringify(body),
      }
    );

    const responseText = await response.text();
    console.log("Create Contract Response Status:", response.status);
    console.log("Create Contract Response:", responseText);

    // Handle empty or non-JSON responses
    if (!responseText) {
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: "Contract created successfully",
        });
      } else {
        return NextResponse.json(
          { error: "Empty response from server" },
          { status: response.status }
        );
      }
    }

    // Try to parse as JSON
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      // If not JSON, return as text
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: responseText,
        });
      } else {
        return NextResponse.json(
          { error: responseText },
          { status: response.status }
        );
      }
    }

    if (!response.ok) {
      console.error("Create Contract Error:", {
        status: response.status,
        errorDetail: data,
      });

      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Create Contract API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
