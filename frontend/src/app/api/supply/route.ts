import { NextResponse } from 'next/server';
import { OCCUPATIONS } from '@/lib/demoData';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const proxied = await proxyToBackend(`/api/supply${url.search}`);
  if (proxied.success) {
    return NextResponse.json(proxied.data);
  }

  const { searchParams } = url;
  const nco = searchParams.get('nco');

  let list = OCCUPATIONS;
  if (nco) {
    list = list.filter(o => o.ncoCode === nco);
  }

  const results = list.map(o => ({
    nco_code: o.ncoCode,
    occupation_title: o.title,
    sector: o.sector,
    staged_supply: {
      stage_1_training_seats: o.stagedSupply.trainingSeats,
      stage_2_enrolled: o.stagedSupply.enrolled,
      stage_3_certified: o.stagedSupply.certified,
      stage_4_available_labour: o.stagedSupply.availableLabour,
      stage_5_effective_employable_supply: o.stagedSupply.effectiveEmployableSupply
    },
    conversion_factors: {
      seat_utilization_rate: o.stagedSupply.seatUtilizationRate,
      certification_rate: o.stagedSupply.certificationRate,
      labor_participation_rate: o.stagedSupply.laborParticipationRate,
      employability_factor: o.stagedSupply.employabilityFactor
    },
    district_concentrations: o.districtConcentrations
  }));

  return NextResponse.json({
    status: 'success',
    data_mode: 'synthetic',
    count: results.length,
    supply_pipelines: results
  });
}
