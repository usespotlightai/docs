'use client';

import posthog from 'posthog-js';
import { useEffect } from 'react';
import { trafficSource } from '@/lib/traffic-source';

function startAnalytics() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (process.env.NODE_ENV !== 'production' || !key || posthog.__loaded) return;

  posthog.init(key, {
    api_host: '/ingest',
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-08-30',
    cookieless_mode: 'always',
    person_profiles: 'identified_only',
    capture_performance: { web_vitals: true },
  });
  posthog.register({
    source: trafficSource(new URL(window.location.href), document.referrer),
  });
}

export function Analytics() {
  useEffect(startAnalytics, []);

  return null;
}
