import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get payload from the request
    const payload = await request.json();
    const { chat_id, text, bot_token } = payload;

    console.log('Telegram API request received with chat_id:', chat_id);

    if (!chat_id || !text || !bot_token) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Forward to Telegram API
    const telegramApiUrl = `https://api.telegram.org/bot${bot_token}/sendMessage`;
    console.log('Sending request to Telegram API:', telegramApiUrl);
    
    const requestBody = {
      chat_id,
      text,
      parse_mode: 'HTML'
    };
    
    console.log('Request body:', JSON.stringify(requestBody));

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log('Telegram API raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Telegram API parsed response:', data);
    } catch (e) {
      console.error('Failed to parse Telegram API response:', e);
      return NextResponse.json(
        { error: 'Invalid response from Telegram API' },
        { status: 500 }
      );
    }

    if (!data.ok) {
      console.error('Telegram API error:', data);
      
      // Special handling for "chat not found" error
      if (data.description && data.description.includes('chat not found')) {
        return NextResponse.json(
          { 
            error: 'Chat ID not found. Make sure you have started a conversation with the bot.',
            detail: data.description,
            suggestion: 'Send a message to your bot first to activate the chat.'
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: data.description || 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in Telegram proxy:', error);
    return NextResponse.json(
      { error: 'Internal server error', detail: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 