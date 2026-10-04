import { NextResponse } from 'next/server';
import { RECOMMENDATIONS } from '@/lib/demoData';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const proxied = await proxyToBackend(`/api/recommendations${url.search}`);
  if (proxied.success) {
    return NextResponse.json(proxied.data);
  }

  const { searchParams } = url;
  const district = searchParams.get('district');
  const type = searchParams.get('type');

  let list = RECOMMENDATIONS;
  if (district) {
    list = list.filter(r => r.district.toLowerCase() === district.toLowerCase());
  }
  if (type) {
    list = list.filter(r => r.type.toLowerCase().includes(type.toLowerCase()));
  }

  return NextResponse.json({
    status: 'success',
    data_mode: 'synthetic',
    count: list.length,
    recommendations: list
  });
}
