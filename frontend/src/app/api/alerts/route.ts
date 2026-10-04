import { NextResponse } from 'next/server';
import { ALERTS } from '@/lib/demoData';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const proxied = await proxyToBackend(`/api/alerts${url.search}`);
  if (proxied.success) {
    return NextResponse.json(proxied.data);
  }

  const { searchParams } = url;
  const severity = searchParams.get('severity');
  const type = searchParams.get('type');

  let list = ALERTS;
  if (severity) {
    list = list.filter(a => a.severity.toLowerCase() === severity.toLowerCase());
  }
  if (type) {
    list = list.filter(a => a.type.toLowerCase().includes(type.toLowerCase()));
  }

  return NextResponse.json({
    status: 'success',
    data_mode: 'synthetic',
    count: list.length,
    categories_monitored: [
      'Emerging Shortage',
      'Emerging Oversupply',
      'Saturation Risk',
      'Geographic Imbalance',
      'Skill Obsolescence',
      'Emerging Occupation'
    ],
    alerts: list
  });
}
