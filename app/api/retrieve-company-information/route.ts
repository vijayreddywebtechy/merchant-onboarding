import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idNumber = searchParams.get('idNumber');

    if (!idNumber) {
      return NextResponse.json(
        { error: 'idNumber is required' },
        { status: 400 }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_PREAPPLICATION_URL}npextorg/extnonprod/retrieve-company-information/company-id?idNumber=${idNumber}`;

    // Get Authorization token from request header
    const authHeader = request.headers.get('Authorization');

    const headers: HeadersInit = {
      'X-IBM-Client-Id': process.env.NEXT_PUBLIC_IBM_CLIENT_ID || '',
      'X-IBM-Client-Secret': process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET || '',
      'x-sbg-channel': 'SBG',
      'x-fapi-interaction-id': crypto.randomUUID(),
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

    console.log('Fetching company information from:', url);
    console.log('Headers:', { 
      'X-IBM-Client-Id': headers['X-IBM-Client-Id'] ? 'present' : 'missing',
      'X-IBM-Client-Secret': headers['X-IBM-Client-Secret'] ? 'present' : 'missing',
      'X-Client-Certificate': headers['X-Client-Certificate'] ? 'present' : 'missing',
      'Authorization': headers['Authorization'] ? 'present' : 'missing',
      'Cookie': headers['Cookie'],
    });

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    console.log('Company information response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return NextResponse.json(
        { error: `Failed to fetch company information: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error retrieving company information:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
