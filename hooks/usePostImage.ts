"use server";

export async function postImage(base64: string): Promise<any> {
  try {
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
      throw new Error(`Roboflow API error: ${response.status} - ${errorText}`);
    }
 

    return await response.json();
  } catch (err) {
    console.error("postImage error:", err);
    throw err;
  }
}
