/**
 * KaushalPulse API Proxy Helper
 * Ministry of Skill Development & Entrepreneurship (MSDE) — PS 26246
 * 
 * Provides single-source-of-truth proxying to the Python FastAPI analytical backend
 * (port 8000) with automatic zero-downtime graceful fallback to deterministic local datasets.
 */

export async function proxyToBackend(endpointAndQuery: string, options?: RequestInit) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    const backendUrl = `http://127.0.0.1:8000${endpointAndQuery}`;
    const response = await fetch(backendUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });

    clearTimeout(timeout);

    if (response.ok) {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/csv')) {
        const textData = await response.text();
        return { success: true, isText: true, data: textData };
      }
      const jsonData = await response.json();
      return { success: true, isText: false, data: jsonData };
    }
  } catch (err) {
    // Backend offline or timeout -> use local deterministic fallback
  }

  return { success: false, isText: false, data: null };
}
