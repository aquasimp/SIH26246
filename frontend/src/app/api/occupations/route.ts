import { NextResponse } from 'next/server';
import { OCCUPATIONS } from '@/lib/demoData';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const proxied = await proxyToBackend(`/api/occupations${url.search}`);
  if (proxied.success) {
    return NextResponse.json(proxied.data);
  }

  const { searchParams } = url;
  const nco = searchParams.get('nco');
  const sector = searchParams.get('sector');

  let list = OCCUPATIONS;
  if (nco) {
    list = list.filter(o => o.ncoCode === nco);
  }
  if (sector) {
    list = list.filter(o => o.sector.toLowerCase().includes(sector.toLowerCase()));
  }

  return NextResponse.json({
    status: 'success',
    data_mode: 'synthetic',
    count: list.length,
    occupations: list
  });
}
