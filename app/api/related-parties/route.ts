import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerUUID = searchParams.get("customerUUID");

    if (!customerUUID) {
      return NextResponse.json(
        { error: "customerUUID is required" },
        { status: 400 }
      );
    }

    const uuid = uuidv4();
    const authHeader = request.headers.get("authorization") || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authHeader,
      "X-IBM-Client-Id": process.env.NEXT_PUBLIC_IBM_CLIENT_ID || "",
      "X-IBM-Client-Secret": process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET || "",
      "x-fapi-interaction-id": uuid,
      "x-client-certificate": process.env.NEXT_PUBLIC_CLIENT_CERTIFICATE || "",
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/related-parties/retrieve-party?customerUUID=${customerUUID}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("Error fetching related parties:", error);
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
