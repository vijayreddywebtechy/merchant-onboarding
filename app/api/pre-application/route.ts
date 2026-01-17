import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const url = `${process.env.NEXT_PUBLIC_PREAPPLICATION_URL}npextorg/extnonprod/business-lending-mymobiz/pre-application`;

    // Get Authorization token from request header
    const authHeader = request.headers.get('Authorization');

    const headers: HeadersInit = {
      'X-IBM-Client-Id': process.env.NEXT_PUBLIC_IBM_CLIENT_ID || '',
      'X-IBM-Client-Secret': process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET || '',
      'x-sbg-channel': 'SBG',
      'x-fapi-interaction-id': crypto.randomUUID(),
      'Content-Type': 'application/json',
      'Cookie': 'sap-usercontext=sap-client=700',
    };

    // Add Authorization header if provided
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Add client certificate if available
    if (process.env.NEXT_PUBLIC_CLIENT_CERTIFICATE) {
      headers['X-Client-Certificate'] = process.env.NEXT_PUBLIC_CLIENT_CERTIFICATE;
    }

    console.log('Calling pre-application API:', url);
    console.log('Headers:', { 
      'X-IBM-Client-Id': headers['X-IBM-Client-Id'] ? 'present' : 'missing',
      'X-IBM-Client-Secret': headers['X-IBM-Client-Secret'] ? 'present' : 'missing',
      'X-Client-Certificate': headers['X-Client-Certificate'] ? 'present' : 'missing',
      'Authorization': headers['Authorization'] ? 'present' : 'missing',
    });
    console.log('Request body:', JSON.stringify(body, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    console.log('Pre-application response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pre-application error response:', errorText);
      return NextResponse.json(
        { error: `Failed to submit pre-application: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Pre-application success:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error submitting pre-application:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
