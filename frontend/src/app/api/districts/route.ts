import { NextResponse } from 'next/server';
import { DISTRICTS } from '@/lib/demoData';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const proxied = await proxyToBackend(`/api/districts${url.search}`);
  if (proxied.success) {
    return NextResponse.json(proxied.data);
  }

  const { searchParams } = url;
  const state = searchParams.get('state');

  let list = DISTRICTS;
  if (state) {
    list = list.filter(d => d.state.toLowerCase() === state.toLowerCase());
  }

  return NextResponse.json({
    status: 'success',
    count: list.length,
    districts: list
  });
}
