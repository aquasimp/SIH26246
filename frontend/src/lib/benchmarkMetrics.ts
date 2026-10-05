/**
 * Verified Out-Of-Sample Benchmark Metrics (§4.1, §6.2)
 * Sourced directly from ml/model_artifacts/out_of_sample_metrics.json
 * Evaluated on Origins 4-6 without temporal leakage.
 */

export interface HorizonMetric {
  primaryModel: string;
  wape: number;
  mae: number;
  rmse: number;
  mase: number;
  coverage80: number;
  coverage95: number;
  sampleCount: number;
  naiveWape: number;
  naiveMae: number;
  naiveRmse: number;
  naiveMase: number;
}

export const OUT_OF_SAMPLE_BENCHMARKS: Record<'3M' | '6M' | '12M', HorizonMetric> = {
  '3M': {
    primaryModel: 'LightGBM Regressor',
    wape: 3.71,
    mae: 16.63,
    rmse: 20.80,
    mase: 0.536,
    coverage80: 80.1,
    coverage95: 95.1,
    sampleCount: 768,
    naiveWape: 6.49,
    naiveMae: 29.08,
    naiveRmse: 35.83,
    naiveMase: 0.937
  },
  '6M': {
    primaryModel: 'LightGBM Regressor',
    wape: 3.58,
    mae: 17.17,
    rmse: 21.23,
    mase: 0.553,
    coverage80: 80.6,
    coverage95: 95.1,
    sampleCount: 768,
    naiveWape: 6.05,
    naiveMae: 29.03,
    naiveRmse: 35.82,
    naiveMase: 0.935
  },
  '12M': {
    primaryModel: 'Tri-Model Ensemble Blend',
    wape: 3.41,
    mae: 16.26,
    rmse: 20.30,
    mase: 0.524,
    coverage80: 78.9,
    coverage95: 94.5,
    sampleCount: 768,
    naiveWape: 6.93,
    naiveMae: 33.08,
    naiveRmse: 40.81,
    naiveMase: 1.066
  }
};
