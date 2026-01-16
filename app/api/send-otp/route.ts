import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();
    const { code = "27", number } = mobile;

    if (!number) {
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization") || "";

    const xmlBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ver="http://www.VERSIONR.VBOTPBRI.Request.com">
      <soapenv:Header/>
        <soapenv:Body>
          <ver:VERSIONROperation>
              <ver:vers_v_version_data>
                  <ver:vers_v_trancode>VBOB</ver:vers_v_trancode>
                  <ver:vers_v_version>5</ver:vers_v_version>
                  <ver:vers_v_token> </ver:vers_v_token>
                  <ver:vers_v_cardno>0</ver:vers_v_cardno>
                  <ver:vers_v_channel_id>MAPP</ver:vers_v_channel_id>
                  <ver:vers_v_user_id>0026</ver:vers_v_user_id>
                  <ver:vers_v_user_ibt>4586</ver:vers_v_user_ibt>
                  <ver:vers_v_response_code>0000</ver:vers_v_response_code>
                  <ver:vers_v_digital_uid> </ver:vers_v_digital_uid>
              </ver:vers_v_version_data>
              <ver:otp_data>
                  <ver:otp_function_id>GEN</ver:otp_function_id>
                  <ver:otp_otp></ver:otp_otp>
                  <ver:otp_delivery_type>S</ver:otp_delivery_type>
                  <ver:otp_country_code>${code}</ver:otp_country_code>
                  <ver:otp_cell_no>${number}</ver:otp_cell_no>
                  <ver:otp_email_address></ver:otp_email_address>
                  <ver:otp_qname></ver:otp_qname>
                  <ver:otp_msg_type>SIGNCD</ver:otp_msg_type>
                  <ver:otp_msg_content>Business Account</ver:otp_msg_content>
              </ver:otp_data>
          </ver:VERSIONROperation>
      </soapenv:Body>
    </soapenv:Envelope>`;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/unsecured-lending/otp`,
      {
        method: "POST",
        headers: {
          "x-fapi-interaction-id": uuidv4(),
          Accept: "text/xml",
          "Content-Type": "text/xml",
          "x-client-certificate": process.env.NEXT_PUBLIC_CLIENT_CERTIFICATE!,
          Authorization: authHeader,
        },
        body: xmlBody,
      }
    );

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}
