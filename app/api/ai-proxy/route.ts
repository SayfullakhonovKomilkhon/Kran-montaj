import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Forward the request to the external API
    const response = await fetch('https://extensions.aitopia.ai/ai/prompts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward any authorization headers if needed
        ...(request.headers.get('authorization') 
          ? { 'Authorization': request.headers.get('authorization')! }
          : {})
      },
      body: JSON.stringify(body)
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error proxying request to AI service:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to AI service' },
      { status: 500 }
    );
  }
} 