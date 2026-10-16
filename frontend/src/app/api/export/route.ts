import { NextResponse } from 'next/server';
import { OCCUPATIONS, DISTRICTS, RECOMMENDATIONS } from '@/lib/demoData';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const districtName = searchParams.get('district') || 'Gorakhpur';
  const stateName = searchParams.get('state') || 'Uttar Pradesh';
  const ncoFilter = searchParams.get('nco');
  const sectorFilter = searchParams.get('sector');

  // Attempt backend proxy for database-backed canonical export
  const proxied = await proxyToBackend(`/api/export${url.search}`);
  if (proxied.success && proxied.data) {
    return new Response(proxied.data as string, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="KaushalYuva_LabourMarket_${districtName}_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  }

  const headers = [
    'occupation',
    'nco_code',
    'district',
    'state',
    'current_demand',
    'forecast_demand_6m',
    'effective_supply',
    'gap_score',
    'severity',
    'recommended_action',
    'confidence'
  ];

  let list = OCCUPATIONS;
  if (ncoFilter) {
    list = list.filter(o => o.ncoCode === ncoFilter);
  }
  if (sectorFilter) {
    list = list.filter(o => o.sector.toLowerCase().includes(sectorFilter.toLowerCase()));
  }

  const sanitize = (val: string | number) => {
    let s = String(val);
    if (/^[=+\-@\t\r]/.test(s)) {
      s = `'${s}`;
    }
    return `"${s.replace(/"/g, '""')}"`;
  };

  const rows = list.map(o => {
    let severity = 'Balanced';
    if (o.gapScore >= 75) severity = 'Severe Shortage';
    else if (o.gapScore >= 60) severity = 'Moderate Shortage';
    else if (o.gapScore >= 40) severity = 'Balanced';
    else if (o.gapScore >= 25) severity = 'Moderate Oversupply';
    else severity = 'Severe Oversupply';

    const rec = RECOMMENDATIONS.find(r => r.toNco === o.ncoCode || r.fromNco === o.ncoCode);
    const action = rec ? rec.title : (o.gapScore >= 75 ? 'Expand Training Seats' : o.gapScore <= 25 ? 'Rationalize Seats' : 'Maintain Equilibrium');
    const confidence = o.gapScore >= 75 ? 84 : 78;

    return [
      sanitize(o.title),
      sanitize(o.ncoCode),
      sanitize(districtName),
      sanitize(stateName),
      o.currentDemand,
      o.forecastDemand6M,
      o.effectiveSupply,
      o.gapScore,
      sanitize(severity),
      sanitize(action),
      confidence
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="KaushalYuva_LabourMarket_${districtName}_${new Date().toISOString().split('T')[0]}.csv"`
    }
  });
}
