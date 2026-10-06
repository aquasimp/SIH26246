/**
 * KaushalYuva Internationalization (i18n) Engine (§3)
 * Full bilingual support (English + 100% Hindi) backed by JSON dictionaries and reference taxonomy.
 */

import enDict from '../../messages/en.json';
import hiDict from '../../messages/hi.json';
import hiRef from '../../messages/hi.reference.json';

export type Language = 'en' | 'hi';

export interface ReferenceData {
  states: Record<string, string>;
  districts: Record<string, string>;
  sectors: Record<string, string>;
  occupations: Record<string, string>;
  severityBands: Record<string, string>;
  alertTypes: Record<string, string>;
}

export const referenceData: ReferenceData = hiRef;

export const translations = {
  en: {
    ...enDict,
    // Backward compatibility mappings for existing components
    appTitle: enDict.brand.name,
    appSubtitle: enDict.brand.descriptor,
    nationalIntelligence: enDict.overview.title,
    heroSubtitle: enDict.hero.subhead,
    metrics: {
      demand: enDict.glossary.demand,
      effectiveSupply: enDict.glossary.effectiveSupply,
      netGap: enDict.overview.kpis.netDeficit,
      atRiskTrades: 'At-Risk Trades',
      earlyWarnings: enDict.overview.kpis.activeAlerts,
      recommendations: 'Priority Actions',
      gapScore: enDict.glossary.gapScore,
      confidence: enDict.glossary.confidence,
      shortageProb: '6M Shortage Probability'
    },
    status: {
      severeShortage: enDict.glossary.severeShortage,
      moderateShortage: enDict.glossary.moderateShortage,
      balanced: enDict.glossary.balanced,
      moderateOversupply: enDict.glossary.moderateOversupply,
      severeOversupply: enDict.glossary.severeOversupply,
      demoDataset: enDict.glossary.demoDataset,
      publicAggregate: 'Public Aggregate',
      plannedFeed: 'Planned Government Feed'
    },
    actions: {
      simulate: enDict.glossary.simulate,
      viewEvidence: enDict.common.viewEvidence,
      exportAction: 'Export Action',
      approveDraft: 'Approve Draft',
      acknowledge: enDict.common.acknowledge,
      investigate: enDict.common.investigate,
      downloadCsv: enDict.common.downloadCsv,
      downloadXlsx: enDict.common.downloadXlsx,
      copyEndpoint: enDict.common.copyEndpoint,
      askCopilot: 'Ask Kaushal Copilot'
    }
  },
  hi: {
    ...hiDict,
    // Backward compatibility mappings for existing components
    appTitle: hiDict.brand.name,
    appSubtitle: hiDict.brand.descriptor,
    nationalIntelligence: hiDict.overview.title,
    heroSubtitle: hiDict.hero.subhead,
    metrics: {
      demand: hiDict.glossary.demand,
      effectiveSupply: hiDict.glossary.effectiveSupply,
      netGap: hiDict.overview.kpis.netDeficit,
      atRiskTrades: 'जोखिम में ट्रेड्स',
      earlyWarnings: hiDict.overview.kpis.activeAlerts,
      recommendations: 'प्राथमिक कार्य',
      gapScore: hiDict.glossary.gapScore,
      confidence: hiDict.glossary.confidence,
      shortageProb: '6-माह कमी संभावना'
    },
    status: {
      severeShortage: hiDict.glossary.severeShortage,
      moderateShortage: hiDict.glossary.moderateShortage,
      balanced: hiDict.glossary.balanced,
      moderateOversupply: hiDict.glossary.moderateOversupply,
      severeOversupply: hiDict.glossary.severeOversupply,
      demoDataset: hiDict.glossary.demoDataset,
      publicAggregate: 'सार्वजनिक संकलन',
      plannedFeed: 'प्रस्तावित सरकारी फीड'
    },
    actions: {
      simulate: hiDict.glossary.simulate,
      viewEvidence: hiDict.common.viewEvidence,
      exportAction: 'कार्रवाई निर्यात करें',
      approveDraft: 'प्रारूप स्वीकृत करें',
      acknowledge: hiDict.common.acknowledge,
      investigate: hiDict.common.investigate,
      downloadCsv: hiDict.common.downloadCsv,
      downloadXlsx: hiDict.common.downloadXlsx,
      copyEndpoint: hiDict.common.copyEndpoint,
      askCopilot: 'कौशल कोपायलट से पूछें'
    }
  }
};

/**
 * Resolves localized name for state, district, sector, occupation, or severity band
 */
export function getLocalizedEntityName(
  type: keyof ReferenceData, 
  key: string | number, 
  lang: Language = 'en', 
  fallback?: string
): string {
  const strKey = String(key);
  if (lang === 'hi') {
    const hiMap = referenceData[type];
    if (hiMap && hiMap[strKey]) {
      return hiMap[strKey];
    }
  }
  return fallback || strKey;
}

/**
 * Normalizes entity display string based on current language
 */
export function resolveDisplayName(
  item: { title?: string; name?: string; titleHi?: string; nameHi?: string; ncoCode?: string; lgdCode?: number },
  lang: Language = 'en'
): string {
  if (lang === 'hi') {
    if (item.titleHi) return item.titleHi;
    if (item.nameHi) return item.nameHi;
    if (item.ncoCode && referenceData.occupations[item.ncoCode]) {
      return referenceData.occupations[item.ncoCode];
    }
    if (item.lgdCode && referenceData.districts[String(item.lgdCode)]) {
      return referenceData.districts[String(item.lgdCode)];
    }
  }
  return item.title || item.name || '';
}
