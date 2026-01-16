import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const uuid = uuidv4();

    console.log("Pre-application request body:", JSON.stringify(body, null, 2));

    const authHeader = request.headers.get("authorization") || "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: authHeader,
      "X-IBM-Client-Id": process.env.NEXT_PUBLIC_IBM_CLIENT_ID!,
      "X-IBM-Client-Secret": process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET!,
      "x-fapi-interaction-id": uuid,
      "x-sbg-channel": process.env.NEXT_PUBLIC_SBG_CHANNEL_NAME!,
    };

    console.log("Pre-application request headers:", headers);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PREAPPLICATION_URL}npextorg/extnonprod/business-lending-mymobiz/pre-application`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    
    console.log("Pre-application response status:", res.status);
    console.log("Pre-application response data:", JSON.stringify(data, null, 2));

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in pre-application:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
