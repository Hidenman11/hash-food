import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real app, this would proxy to your backend API
    // For now, we'll use environment variables
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      googleMapsApiKey: apiKey,
      mapId: mapId || null,
    });
  } catch (error) {
    console.error('Maps config error:', error);
    return NextResponse.json(
      { error: 'Failed to load map configuration' },
      { status: 500 }
    );
  }
}