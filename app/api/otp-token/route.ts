import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("scope", "prod write customer");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sysauth/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "x-ibm-client-id": process.env.NEXT_PUBLIC_IBM_CLIENT_ID!,
          "x-ibm-client-secret": process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET!,
        },
        body: params.toString(),
      }
    );

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error generating OTP token:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate OTP token" },
      { status: 500 }
    );
  }
}
