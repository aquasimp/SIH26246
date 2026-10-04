import { NextResponse } from 'next/server';
import { OCCUPATIONS } from '@/lib/demoData';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const proxied = await proxyToBackend(`/api/demand${url.search}`);
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

  const results = list.map(o => {
    // Demand Pressure Index (0-100) based on volume, growth, and persistence
    const volumeScore = Math.min(100, (o.currentDemand / 1000) * 80);
    const growthScore = Math.min(100, Math.max(0, o.growthRate6M * 3.5));
    const demandPressureIndex = Math.round(Math.min(99, Math.max(10, (volumeScore * 0.5) + (growthScore * 0.5))));

    return {
      nco_code: o.ncoCode,
      occupation_title: o.title,
      sector: o.sector,
      nsqf_level: o.nsqfLevel,
      current_demand: o.currentDemand,
      forecast_demand_6m: o.forecastDemand6M,
      demand_growth_rate_pct: o.growthRate6M,
      demand_pressure_index: demandPressureIndex,
      active_vacancies: o.currentDemand,
      average_wage_inr: o.averageWageINR,
      time_series: o.timeSeries
    };
  });

  return NextResponse.json({
    status: 'success',
    data_mode: 'synthetic',
    count: results.length,
    data: results
  });
}
