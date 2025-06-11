import { NextResponse } from 'next/server';
export const dynamic = 'force-static'
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const base64 = body.base64;

    if (!base64) {
      return NextResponse.json({ error: 'Missing base64 image data' }, { status: 400 });
    }

    const response = await fetch(process.env.ROBOFLOW_WORKFLOW_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.ROBOFLOW_API_KEY,
        inputs: {
          image: {
            type: 'base64',
            value: base64,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Roboflow API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API /post-image error:', error);
    return NextResponse.json(
      { error: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
