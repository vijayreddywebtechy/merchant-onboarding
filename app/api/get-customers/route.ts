import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nidNumber = searchParams.get("nidNumber");
    const nidType = searchParams.get("nidType") || "01";

    if (!nidNumber) {
      return NextResponse.json(
        { error: "nidNumber is required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization") || "";
    const uuid = uuidv4();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/external-partners/customers?nidType=${nidType}&nidNumber=${nidNumber}&startPageNumber=1&pageLimit=1`,
      {
        method: "GET",
        headers: {
          "Authorization": authHeader,
          "X-IBM-Client-Id": process.env.NEXT_PUBLIC_IBM_CLIENT_ID!,
          "X-IBM-Client-Secret": process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET!,
          "x-fapi-interaction-id": uuid,
          "ChannelId": process.env.NEXT_PUBLIC_SBG_CHANNEL_NAME!,
          "x-client-certificate": process.env.NEXT_PUBLIC_CLIENT_CERTIFICATE!,
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
