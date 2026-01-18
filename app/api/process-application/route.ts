import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { step, processId } = body;

    // Infer step if not explicitly provided (handles "dont send step to api")
    if (!step) {
        if (body.webFacialRecognitionStatus) {
            step = 2;
        } else if (body.processIdentifier || processId) {
            step = 1;
        }
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/applications`;
    
    const authToken = req.headers.get('Authorization');

    // Headers configuration
    // Fallback to IBM_CLIENT_SECRET if APPLICATIONS_CLIENT_SECRET is missing
    const headers: any = {
      'Content-Type': 'application/json',
      'X-IBM-Client-Id': process.env.NEXT_PUBLIC_IBM_CLIENT_ID || '',
      'X-IBM-Client-Secret': process.env.NEXT_PUBLIC_APPLICATIONS_CLIENT_SECRET || process.env.NEXT_PUBLIC_IBM_CLIENT_SECRET || '', 
      'Accept': 'application/json',
      'Authorization': authToken,
      'x-client-certificate': process.env.NEXT_PUBLIC_CLIENT_CERTIFICATE || ''
    };

    let fetchBody;

    // Use processId from destructure OR body.processIdentifier
    const pId = processId || body.processIdentifier;

    if (step === 1) {
        headers['x-fapi-interaction-id'] = 'e62ba66e-cd20-413d-9e8e-ada47f9af91b';
        fetchBody = JSON.stringify({ "processIdentifier": pId });
    } else if (step === 2) {
        headers['x-fapi-interaction-id'] = '610bf1c5-cf83-4bbd-97b1-cc2d68eca485';
        headers['Cookie'] = 'sap-usercontext=sap-client=700';
        fetchBody = JSON.stringify({
           "webFacialRecognitionStatus": "SUCCESS",
           "webFacialRecognitionRetryAllowed": null,
           "webFacialRecognitionFailureReason": null,
           "taskIdentifier": null, 
           "processIdentifier": pId
        });
    } else {
        return NextResponse.json({ error: 'Invalid step or payload structure' }, { status: 400 });
    }

    console.log(`Processing step ${step} for processId ${pId}`);
    console.log(`Using Authorization: ${authToken ? 'Present' : 'Missing'}`);

    const response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: fetchBody
    });
    
    // Return response or error
    if (!response.ok) {
        const text = await response.text();
        console.error('API Error:', text);
        // Pass the upstream status code (e.g. 401)
        return NextResponse.json({ error: text }, { status: response.status });
    }

    const data = await response.json();
    console.warn('API Success:', data);
    return NextResponse.json(data);

  } catch (error) {
     console.error('Internal Server Error:', error);
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
