import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idNumber, clientReference: providedClientReference } = body;

    // iIdentifii credentials
    const key = process.env.NEXT_PUBLIC_IIDENTIFII_KEY || '1883A5EF-847B-4C1B-AE65-6B91E574A5B9';
    const secret = process.env.NEXT_PUBLIC_IIDENTIFII_SECRET || '8A93B248-1632-4E36-BE6F-0815B31A125C';

    // Helper functions
    function newGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16).toUpperCase();
      });
    }

    function epochTime() {
      const d = new Date();
      const t = d.getTime();
      const o = t.toString();
      return o.substring(0, 10);
    }

    // Generate auth components
    const time = epochTime();
    const nonce = newGuid().replace(/-/g, ''); // Remove dashes for nonce
    const method = 'POST';
    const encodedUri = 'https://alphawebapi.iidentifii.com/init';

    // Use provided clientReference or generate random one
    const clientReference = providedClientReference || `a6h9M${Date.now().toString().substring(0, 13)}QAO`;

    // Build request body with exact payload structure
    const requestBody = JSON.stringify({
      verify: 0,
      ShowLanding: 0,
      livenessMethod: 0,
      IDValidationDisabled: 0,
      idNumber: idNumber,
      DocumentCaptureDisabled: 1,
      DHACheckDisabled: 0,
      clientReference: clientReference,
      applicationID: "731DF29E-BED3-49F6-A6E5-416EA51D5A8E"
    });

    // MD5 hash and convert to base64
    const bodyMd5 = crypto.createHash('md5').update(requestBody).digest('base64');

    // Build signature
    const rawSignature = key + method + encodedUri + time + nonce + bodyMd5;

    // HMAC-SHA256 signature
    const signature = crypto
      .createHmac('sha256', secret)
      .update(rawSignature, 'utf8')
      .digest('base64');

    // Build AMX header
    const amx = `${key}:${signature}:${nonce}:${time}`;

    console.log('iIdentifii Init - AMX:', amx);
    console.log('iIdentifii Init - Request body:', requestBody);

    // Call iIdentifii API
    const response = await fetch('https://alphawebapi.iidentifii.com/init', {
      method: 'POST',
      headers: {
        'Authorization': `amx ${amx}`,
        'Content-Type': 'application/json',
      },
      body: requestBody
    });

    // Handle response - try to parse as JSON, fallback to text
    let data;
    const responseText = await response.text();
    console.log('iIdentifii Init - Raw response:', responseText);

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.log('iIdentifii Init - Response is not JSON, using text');
      data = { message: responseText };
    }

    console.log('iIdentifii Init - Response status:', response.status);
    console.log('iIdentifii Init - Response data:', data);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to initialize verification', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('iIdentifii Init - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
