export type Language = 'en' | 'hi';

export const translations = {
  en: {
    appTitle: 'KaushalPulse',
    appSubtitle: 'Labour Market Intelligence',
    nationalIntelligence: 'National Labour Market Intelligence',
    heroSubtitle: 'See where demand is rising, where training capacity is falling behind, and what MSDE should act on next.',
    nav: {
      overview: 'Overview',
      intelligence: 'Labour Intelligence',
      forecasts: 'Forecasts',
      gaps: 'Skill Gaps',
      alerts: 'Early Warnings',
      recommendations: 'Recommendations',
      scenarios: 'Scenario Studio',
      districts: 'Districts',
      occupations: 'Occupations',
      qualifications: 'Qualifications',
      dataHealth: 'Data & Model Health',
      apiExports: 'API & Exports',
      settings: 'Settings'
    },
    metrics: {
      demand: 'Projected Demand',
      effectiveSupply: 'Effective Supply',
      netGap: 'Net Labour Gap',
      atRiskTrades: 'At-Risk Trades',
      earlyWarnings: 'Active Alerts',
      recommendations: 'Priority Actions',
      gapScore: 'Gap Score',
      confidence: 'Confidence',
      shortageProb: '6M Shortage Probability'
    },
    status: {
      severeShortage: 'Severe Shortage',
      moderateShortage: 'Moderate Shortage',
      balanced: 'Balanced',
      moderateOversupply: 'Moderate Oversupply',
      severeOversupply: 'Severe Oversupply',
      demoDataset: 'Demo Dataset',
      publicAggregate: 'Public Aggregate',
      plannedFeed: 'Planned Government Feed'
    },
    actions: {
      simulate: 'Simulate',
      viewEvidence: 'View Evidence',
      exportAction: 'Export Action',
      approveDraft: 'Approve Draft',
      acknowledge: 'Acknowledge',
      investigate: 'Investigate',
      downloadCsv: 'Download CSV',
      downloadXlsx: 'Download XLSX',
      copyEndpoint: 'Copy API Endpoint',
      askCopilot: 'Ask Kaushal Copilot'
    },
    copilot: {
      title: 'Kaushal Copilot',
      subtitle: 'MSDE Policy & Forecasting Intelligence Assistant',
      placeholder: 'Ask about district shortages, seat reallocations, or forecasting drivers...',
      prompt1: 'Which occupations are likely to face shortages in Gorakhpur in next 6 months?',
      prompt2: 'Why is Solar PV Installer showing a severe shortage?',
      prompt3: 'Where should Uttar Pradesh increase training capacity?',
      prompt4: 'What happens if we move 500 seats from retail to solar?'
    }
  },
  hi: {
    appTitle: 'कौशलपल्स',
    appSubtitle: 'श्रम बाजार बुद्धिमत्ता मंच',
    nationalIntelligence: 'राष्ट्रीय श्रम बाजार बुद्धिमत्ता',
    heroSubtitle: 'देखें कि मांग कहाँ बढ़ रही है, प्रशिक्षण क्षमता कहाँ पिछड़ रही है, और एमएसडीई को आगे क्या कदम उठाना चाहिए।',
    nav: {
      overview: 'सिंहावलोकन',
      intelligence: 'श्रम बुद्धिमत्ता',
      forecasts: 'मांग-आपूर्ति पूर्वानुमान',
      gaps: 'कौशल अंतराल',
      alerts: 'प्रारंभिक चेतावनी केंद्र',
      recommendations: 'अनुशंसित नीतियां',
      scenarios: 'सिनेरियो स्टूडियो',
      districts: 'जिला बुद्धिमत्ता',
      occupations: 'व्यवसाय एवं ट्रेड्स',
      qualifications: 'योग्यता (NSQF)',
      dataHealth: 'डेटा एवं मॉडल स्वास्थ्य',
      apiExports: 'एपीआई और निर्यात',
      settings: 'सेटिंग्स'
    },
    metrics: {
      demand: 'प्रत्याशित मांग',
      effectiveSupply: 'प्रभावी आपूर्ति',
      netGap: 'शुद्ध श्रम अंतराल',
      atRiskTrades: 'जोखिम में ट्रेड्स',
      earlyWarnings: 'सक्रिय चेतावनियाँ',
      recommendations: 'प्राथमिक कार्य',
      gapScore: 'गैप स्कोर',
      confidence: 'विश्वसनीयता',
      shortageProb: '6-माह कमी संभावना'
    },
    status: {
      severeShortage: 'गंभीर कमी',
      moderateShortage: 'मध्यम कमी',
      balanced: 'संतुलित',
      moderateOversupply: 'मध्यम अतिआपूर्ति',
      severeOversupply: 'अत्यधिक अतिआपूर्ति',
      demoDataset: 'डेमो डेटासेट',
      publicAggregate: 'सार्वजनिक संकलन',
      plannedFeed: 'प्रस्तावित सरकारी फीड'
    },
    actions: {
      simulate: 'सिम्युलेट करें',
      viewEvidence: 'साक्ष्य देखें',
      exportAction: 'कार्रवाई निर्यात करें',
      approveDraft: 'प्रारूप स्वीकृत करें',
      acknowledge: 'स्वीकार करें',
      investigate: 'जांच करें',
      downloadCsv: 'सीएसवी डाउनलोड करें',
      downloadXlsx: 'एक्सेल डाउनलोड करें',
      copyEndpoint: 'एपीआई कॉपी करें',
      askCopilot: 'कौशल कोपायलट से पूछें'
    },
    copilot: {
      title: 'कौशल कोपायलट',
      subtitle: 'एमएसडीई नीति एवं पूर्वानुमान सहायक',
      placeholder: 'जिले में कमी, सीट पुनर्वितरण, या पूर्वानुमान के बारे में पूछें...',
      prompt1: 'गोरखपुर में अगले 6 महीनों में किन व्यवसायों में कमी आने की संभावना है?',
      prompt2: 'गोरखपुर में सोलर इंस्टॉलर की कमी क्यों है?',
      prompt3: 'उत्तर प्रदेश को प्रशिक्षण क्षमता कहाँ बढ़ानी चाहिए?',
      prompt4: 'यदि हम रिटेल से 500 सीटें सोलर में स्थानांतरित करें तो क्या होगा?'
    }
  }
};
