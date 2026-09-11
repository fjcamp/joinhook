import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    service: 'joinops',
    status: 'ok',
    environment: process.env.JOINOPS_ENV ?? 'development',
    timestamp: new Date().toISOString()
  });
}
