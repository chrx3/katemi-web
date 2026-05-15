import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;
  const actualToken = request.cookies.get('admin-session')?.value;

  if (!sessionToken || actualToken !== sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ auth: true });
}