import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { applicationId } = await params;

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    const authToken = request.headers.get("authorization");

    console.log("Authorization Header:", authToken ? "Present" : "Missing");

    if (!authToken) {
      return NextResponse.json(
        { error: "Authorization token is required" },
        { status: 401 }
      );
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/business-lending-mymobiz/application-process-data/${applicationId}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-IBM-Client-Id': process.env.NEXT_PUBLIC_IBM_CLIENT_ID!,
        'X-IBM-Client-Secret': process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET!,
        'x-sbg-channel': process.env.NEXT_PUBLIC_SBG_CHANNEL_NAME!,
        'x-fapi-interaction-id': 'b5f662bf-269b-4eab-954b-7d418bc8600b',
        'Authorization': authToken,
        'Cookie': 'LtpaToken2=CQGmKkmP71b+kzcZkzJNp2VoEee1EljTdGoZgu/a9UnUxX0IOGdDtjPFRYd1IUrhSkqYM253evGlf2xEhOupzwsZENZcKiTjKpI5qsOaV7H+A5IZ6IiJwr41R7FEDZDAXZPq5ZMh/9RgTK2iz8TV1zXLdNhc5GbZlrNCuu0yrU5kIMrUwsL98D4UlLP9LT4xbEzcEECFkbGOzPyzXQYMBi9uQ0rlsEzpypymWJlEQOxCKlpQlFm9DYiZL62+KCuz/pY/SZLjbpE4pF2ENzHJgYY+18bEkH0B+ZEd9Rl4ykYTBdoE0K/GS5TmVSAVX9m5mtXcOCUJD0s+zaZe4BopHdvUrjncWBA0M8Z4nHglpQQ9KzJSHG+UwpiVw2sidxwSG4AKtq7sccv+wUFS4SYwNHfrW1HSEYdbQ9Mgf4Bcjza0TZAL5H6UuK1PmTuj9Cf0wAxThSkYXY6uFc+9bjhI05lsIkQBvu2ygIM0WVVkHgj6GIvnas7i3J4l9acqM50FV6xLIR4Lrc8VDFq8qWivzK2TuRvI6xtOZJ9qIlz7JbYtnyscoSGhrKnvkp/ye6R8mQJwYT4/Zz0kw1wHKlAD/3QleftXQrxFrlhuAzmymBPbva7SbVmsItD9mLcP9uuV3itAfLSFpZB6sJKmlXtIvYh5TiFiuI9TRtng99+CpGF0+oMGgxuKt6KWVE1JQhlY+YD1z9Fj0Pu4g49LizzekZApi7pnBCyML1qhIT4khUKlSsizuq1Lv7YJIG/OKJvIMAH01Jj8feLxJRRN7h0vS/g27JhJdtAC3S+YtjwZ9i0=; JSESSIONID=0000Wf_zG8tiCpn5tHoCd_z4o7kFNwXGfQDrPq2:1bfjm5d7u; XSRF-TOKEN=8a0d9c7b9bc14fd0d0080e492a18405db141d9d11a73bc898592e29a9b32f25b; sap-usercontext=sap-client=700',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Application process data API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Failed to fetch application process data: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Application process data response:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Application process data API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}