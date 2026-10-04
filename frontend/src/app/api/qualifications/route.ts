import { NextResponse } from 'next/server';
import { OCCUPATIONS } from '@/lib/demoData';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const proxied = await proxyToBackend(`/api/qualifications${url.search}`);
  if (proxied.success) {
    return NextResponse.json(proxied.data);
  }
  const qualifications = OCCUPATIONS.map(o => ({
    qualification_pack_code: `QP-${o.ncoCode.replace('.', '')}`,
    title: o.title,
    nco_code: o.ncoCode,
    sector: o.sector,
    nsqf_level: o.nsqfLevel,
    awarding_body: `National Skill Development Corporation (NSDC) / ${o.sector} SSC`,
    training_duration_hours: o.nsqfLevel >= 5 ? 450 : 300,
    active_candidates: o.stagedSupply.enrolled,
    certified_candidates: o.stagedSupply.certified
  }));

  return NextResponse.json({
    status: 'success',
    data_mode: 'synthetic',
    count: qualifications.length,
    qualifications
  });
}
