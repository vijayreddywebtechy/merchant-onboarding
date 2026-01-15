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

    console.log("Retrieve Document Request:", JSON.stringify(body, null, 2));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/retrieve/documents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-IBM-Client-Id": process.env.NEXT_PUBLIC_IBM_CLIENT_ID || "",
          "X-IBM-Client-Secret": process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET || "",
          "x-sbg-channel": "SBG",
          "x-fapi-interaction-id": uuidv4(),
          Authorization: authToken,
        },
        body: JSON.stringify(body),
      }
    );

    console.log("Retrieve Document Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Retrieve Document Error:", errorText);

      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(errorData, { status: response.status });
      } catch {
        return NextResponse.json(
          { error: errorText || "Failed to retrieve document" },
          { status: response.status }
        );
      }
    }

    // Get the PDF blob
    const blob = await response.blob();

    // Convert blob to array buffer
    const arrayBuffer = await blob.arrayBuffer();

    // Return the PDF as a response
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=contract.pdf",
      },
    });
  } catch (error: any) {
    console.error("Retrieve Document API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
