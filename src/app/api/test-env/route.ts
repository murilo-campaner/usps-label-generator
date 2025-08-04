import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    hasEasyPostKey: !!process.env.EASYPOST_API_KEY,
    easyPostKeyLength: process.env.EASYPOST_API_KEY?.length || 0,
    easyPostKeyPrefix: process.env.EASYPOST_API_KEY?.substring(0, 8) || 'N/A',
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('EASYPOST')),
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(envCheck);
} 