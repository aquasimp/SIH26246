import { NextResponse } from 'next/server';
import { OCCUPATIONS, DISTRICTS, ALERTS, RECOMMENDATIONS } from '@/lib/demoData';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const proxied = await proxyToBackend(`/api/overview${url.search}`);
  if (proxied.success) {
    return NextResponse.json(proxied.data);
  }

  const { searchParams } = url;
  const district = searchParams.get('district');
  const state = searchParams.get('state');

  let occs = OCCUPATIONS;
  let dists = DISTRICTS;

  if (district) {
    dists = dists.filter(d => d.name.toLowerCase() === district.toLowerCase() || d.id.toLowerCase() === district.toLowerCase());
  } else if (state) {
    dists = dists.filter(d => d.state.toLowerCase() === state.toLowerCase());
  }

  const totalDemand = occs.reduce((acc, o) => acc + o.currentDemand, 0);
  const totalEffectiveSupply = occs.reduce((acc, o) => acc + o.effectiveSupply, 0);
  const netGap = totalDemand - totalEffectiveSupply;

  const atRiskTrades = occs.filter(o => o.gapScore >= 75 || o.gapScore <= 25);

  return NextResponse.json({
    status: 'success',
    data_mode: 'synthetic',
    is_offline_fixture: true,
    source_badge: 'Offline fixture data',
    pipeline_run_id: 'RUN-2026-10-04-001',
    timestamp: new Date().toISOString(),
    metrics: {
      projected_demand: totalDemand,
      effective_supply: totalEffectiveSupply,
      net_gap: netGap,
      at_risk_trades_count: atRiskTrades.length,
      active_warnings_count: ALERTS.length,
      priority_recommendations_count: RECOMMENDATIONS.length
    },
    planted_scenario: {
      shortage_occupation: 'Solar PV Installer (Gorakhpur)',
      oversupply_occupation: 'Retail Sales Associate (Gorakhpur)',
      gap_scores: {
        solar_pv_installer: 93,
        retail_sales_associate: 66
      }
    }
  }, {
    headers: {
      'X-KaushalYuva-Source': 'offline-fixture'
    }
  });
}
