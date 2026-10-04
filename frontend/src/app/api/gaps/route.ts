import { NextResponse } from 'next/server';
import { OCCUPATIONS } from '@/lib/demoData';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const proxied = await proxyToBackend(`/api/gaps${url.search}`);
  if (proxied.success) {
    return NextResponse.json(proxied.data);
  }

  const { searchParams } = url;
  const nco = searchParams.get('nco');
  const severityFilter = searchParams.get('severity');

  let list = OCCUPATIONS;
  if (nco) {
    list = list.filter(o => o.ncoCode === nco);
  }

  const results = list.map(o => {
    let classification = 'Balanced';
    if (o.gapScore >= 75) classification = 'Severe Shortage';
    else if (o.gapScore >= 60) classification = 'Moderate Shortage';
    else if (o.gapScore >= 40) classification = 'Balanced';
    else if (o.gapScore >= 25) classification = 'Moderate Oversupply';
    else classification = 'Severe Oversupply';

    return {
      nco_code: o.ncoCode,
      occupation_title: o.title,
      sector: o.sector,
      current_demand: o.currentDemand,
      effective_supply: o.effectiveSupply,
      net_gap: o.currentDemand - o.effectiveSupply,
      gap_score: o.gapScore,
      severity: classification,
      shortage_probability_6m: o.shortageProbability6M,
      intervention_priority: o.gapScore >= 75 ? 'P1_CRITICAL' : o.gapScore <= 25 ? 'P2_OPTIMIZE' : 'P3_STABLE'
    };
  });

  const filtered = severityFilter
    ? results.filter(r => r.severity.toLowerCase().includes(severityFilter.toLowerCase()))
    : results;

  return NextResponse.json({
    status: 'success',
    data_mode: 'synthetic',
    count: filtered.length,
    thresholds: {
      severe_shortage: '>= 75',
      moderate_shortage: '60 - 74',
      balanced: '40 - 59',
      moderate_oversupply: '25 - 39',
      severe_oversupply: '< 25'
    },
    gaps: filtered
  });
}
