import { NextResponse } from 'next/server';
import { DATA_HEALTH_METRIC } from '@/lib/demoData';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET() {
  const proxied = await proxyToBackend('/api/model-health');
  if (proxied.success) {
    return NextResponse.json(proxied.data);
  }
  return NextResponse.json({
    status: 'success',
    data_mode: 'Demo Dataset (Synthetic Canonical v1.0)',
    is_synthetic: true,
    last_pipeline_run: {
      run_id: DATA_HEALTH_METRIC.lastRunId,
      timestamp: DATA_HEALTH_METRIC.lastRunTimestamp,
      status: 'SUCCESS'
    },
    dataset_version: 'Canonical-v1.0-60M-16Districts',
    walk_forward_backtest: {
      split_date: '2025-11-01',
      training_rows: 18432,
      validation_rows: 6144,
      total_observations: 24576
    },
    models: {
      production_model: {
        name: 'Global LightGBM Multi-District Multi-Trade Regressor',
        version: 'v3.2',
        wape: 5.0,
        mae: 36.17,
        rmse: 66.83,
        confidence_percent: 78,
        hyperparameters: {
          n_estimators: 250,
          learning_rate: 0.05,
          num_leaves: 31,
          objective: 'regression_l1'
        },
        status: 'OPTIMAL'
      },
      baseline_model: {
        name: 'Seasonal Naive Lag-12 Benchmark',
        wape: 16.59,
        mae: 120.01,
        rmse: 162.28,
        relative_improvement_achieved: '+69.9% error reduction'
      }
    },
    governance_metrics: {
      data_freshness_pct: DATA_HEALTH_METRIC.freshnessPercent,
      mapping_confidence_pct: DATA_HEALTH_METRIC.mappingConfidencePercent,
      data_quality_pct: DATA_HEALTH_METRIC.dataQualityPercent,
      sources_connected: DATA_HEALTH_METRIC.sourcesConnected,
      sources_total: DATA_HEALTH_METRIC.sourcesTotal
    },
    data_sources: DATA_HEALTH_METRIC.sources
  });
}
