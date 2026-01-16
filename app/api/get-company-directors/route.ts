import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idNumber = searchParams.get("idNumber");

    if (!idNumber) {
      return NextResponse.json(
        { error: "idNumber is required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization") || "";
    const uuid = uuidv4();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/retrieve-company-information/company-id?idNumber=${encodeURIComponent(idNumber)}`,
      {
        method: "GET",
        headers: {
          "Authorization": authHeader,
          "X-IBM-Client-Id": process.env.NEXT_PUBLIC_IBM_CLIENT_ID!,
          "X-IBM-Client-Secret": process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET!,
          "x-sbg-channel": process.env.NEXT_PUBLIC_SBG_CHANNEL_NAME!,
          "x-fapi-interaction-id": uuid,
          "X-Client-Certificate": process.env.NEXT_PUBLIC_CLIENT_CERTIFICATE!,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching company directors:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch company directors" },
      { status: 500 }
    );
  }
}
