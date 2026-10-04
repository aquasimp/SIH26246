import { NextResponse } from 'next/server';
import { runScenarioSimulation } from '@/lib/scenarioEngine';
import { ScenarioParams } from '@/lib/types';
import { proxyToBackend } from '@/lib/apiProxy';

export async function POST(request: Request) {
  try {
    const body: ScenarioParams = await request.json();

    const proxied = await proxyToBackend('/api/scenarios', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    if (proxied.success) {
      return NextResponse.json(proxied.data);
    }

    const result = runScenarioSimulation(body);

    return NextResponse.json({
      status: 'success',
      inputs: body,
      result
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: err.message || 'Invalid simulation parameters' },
      { status: 400 }
    );
  }
}
