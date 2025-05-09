import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the bot token from the request
    const payload = await request.json();
    const { bot_token } = payload;

    if (!bot_token) {
      return NextResponse.json(
        { error: 'Missing bot_token parameter' },
        { status: 400 }
      );
    }

    // Call the Telegram API to get bot information
    const response = await fetch(`https://api.telegram.org/bot${bot_token}/getMe`);
    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json(
        { error: data.description || 'Failed to get bot information' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bot_info: data.result
    });
  } catch (error) {
    console.error('Error getting bot info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 