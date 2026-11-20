import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Endpoint deprecated and secured: returns 404 to prevent unauthorized mock testing
export async function POST() {
  return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
}

export async function GET() {
  return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
}
