export async function POST(request: Request): Promise<Response> {
    try {
        // Validate environment variables
        const grantType = process.env.NEXT_PUBLIC_GRANT_TYPE;
        const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
        const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
        const tokenUrl = process.env.NEXT_PUBLIC_ACCESS_TOKEN_URL;

        if (!grantType || !clientId || !clientSecret || !tokenUrl) {
            console.error("Missing required environment variables", {
                grantType: !!grantType,
                clientId: !!clientId,
                clientSecret: !!clientSecret,
                tokenUrl: !!tokenUrl,
            });
            return new Response(
                JSON.stringify({
                    error: "configuration_error",
                    error_description: "Missing required environment variables for token generation",
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Build the request body for client_credentials grant
        const body = new URLSearchParams();
        body.append("grant_type", grantType);
        body.append("client_id", clientId);
        body.append("client_secret", clientSecret);

        console.log("Requesting token from:", tokenUrl);

        const res = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Token generation failed:", {
                status: res.status,
                statusText: res.statusText,
                data,
            });
            return new Response(
                JSON.stringify({
                    error: data.error || "Token generation failed",
                    error_description: data.error_description || "Unable to generate access token",
                    details: data,
                }),
                {
                    status: res.status,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        console.log("✅ Token generated successfully");
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error generating token:", {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
        });
        return new Response(
            JSON.stringify({
                error: "internal_error",
                error_description: "Unable to generate access token. Please check server logs for details.",
                details: errorMessage,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
