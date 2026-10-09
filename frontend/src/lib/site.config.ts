/**
 * KaushalYuva Site & Event Configuration (§5.1)
 * Central configuration for brand, event, ministry, model, and contact links.
 */

export const siteConfig = {
  name: 'KaushalYuva',
  nameHi: 'कौशलयुवा',
  mark: 'KY',
  title: 'KaushalYuva — Labour Market Intelligence | MSDE',
  tagline: "Skills for India's youth, planned before the shortage.",
  taglineHi: 'देश के युवाओं के कौशल की योजना, कमी आने से पहले।',
  description: 'AI-Enabled Labour Market Intelligence and Skill Demand-Supply Forecasting Engine for Ministry of Skill Development & Entrepreneurship.',
  
  event: {
    name: 'Smart India Hackathon 2026',
    problemStatement: 'PS 26242',
    ministry: 'Ministry of Skill Development & Entrepreneurship (MSDE)',
    datasetVersion: 'Official SIH Dataset v2.1',
    runId: 'RUN-SIH-001',
    modelVersion: 'Ensemble Model v2.1.0'
  },

  urls: {
    live: 'https://kaushalyuva.vercel.app',
    github: 'https://github.com/aquasimp/SIH26242',
    msde: 'https://www.msde.gov.in',
    sih: 'https://www.sih.gov.in'
  },

  footerLinks: [
    { label: 'Overview', labelHi: 'अवलोकन', href: '/overview' },
    { label: 'Forecasts', labelHi: 'पूर्वानुमान', href: '/forecasts' },
    { label: 'Skill Gaps', labelHi: 'कौशल अंतराल', href: '/gaps' },
    { label: 'Scenario Studio', labelHi: 'परिदृश्य स्टूडियो', href: '/scenarios' },
    { label: 'Recommendations', labelHi: 'सिफ़ारिशें', href: '/recommendations' },
    { label: 'API & Exports', labelHi: 'API एवं निर्यात', href: '/api' },
    { label: 'Data & Model Health', labelHi: 'डेटा स्वास्थ्य', href: '/data-health' }
  ]
};
