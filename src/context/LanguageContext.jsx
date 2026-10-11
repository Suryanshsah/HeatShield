import { createContext, useContext, useState } from 'react';

const TRANSLATIONS = {
  en: {
    appTitle: 'HeatShield',
    subTitle: 'Delhi Heat & Water Risk Platform',
    dashboard: 'Dashboard',
    reportProblem: 'Report a Problem',
    adminPortal: 'Admin Portal',
    coolingShelters: 'Cooling & Tankers',
    demoMode: 'Offline Local Store Ready',
    heatRiskLevel: 'Heat Risk Level',
    waterPoints: 'Water Points',
    openIncidents: 'Open Incidents',
    heatAdvisory: 'Heat Advisory',
    waterStatus: 'Water Status',
    recentReports: 'Recent Reports',
    searchPlaceholder: 'Search reports or locations...',
    allStatus: 'All Status',
    open: 'Open',
    inReview: 'In Review',
    resolved: 'Resolved',
    brokenTap: 'Broken Water Tap',
    waterUnavailable: 'Water Unavailable',
    leakingPipe: 'Leaking Pipe',
    coolingUnavailable: 'Cooling Facility Unavailable',
    issueType: 'Issue Type',
    description: 'Description',
    location: 'Location',
    latitude: 'Latitude',
    longitude: 'Longitude',
    pickOnMap: 'Pick on Map',
    detectLocation: 'Detect My Location',
    submitting: 'Submitting...',
    submitReport: 'Submit Report',
    upvote: 'Upvote',
    upvotes: 'Upvotes',
    operational: 'Operational',
    lowSupply: 'Low Supply',
    broken: 'Broken',
    address: 'Address / Area Landmark',
    photoOptional: 'Photo (Optional)',
    clickToAttach: 'Click to attach photo',
    officialResponse: 'Official Authority Response',
  },
  hi: {
    appTitle: 'हीटशील्ड (HeatShield)',
    subTitle: 'दिल्ली गर्मी एवं जल संकट डैशबोर्ड',
    dashboard: 'डैशबोर्ड (Dashboard)',
    reportProblem: 'समस्या रिपोर्ट करें',
    adminPortal: 'प्रशासन पोर्टल',
    coolingShelters: 'शीतल केंद्र व टैंकर',
    demoMode: 'स्थानीय डाटा मोड सक्रिय',
    heatRiskLevel: 'गर्मी जोखिम स्तर',
    waterPoints: 'जल सुविधा बिंदु',
    openIncidents: 'लंबित शिकायतें',
    heatAdvisory: 'गर्मी परामर्श सलाह',
    waterStatus: 'जल आपूर्ति स्थिति',
    recentReports: 'हाल की शिकायतें',
    searchPlaceholder: 'शिकायतें या क्षेत्र खोजें...',
    allStatus: 'सभी स्थिति',
    open: 'लंबित (Open)',
    inReview: 'समीक्षाधीन (In Review)',
    resolved: 'समाधान (Resolved)',
    brokenTap: 'टूटा हुआ नल/टैप',
    waterUnavailable: 'पानी उपलब्ध नहीं',
    leakingPipe: 'पाइप से पानी रिसाव',
    coolingUnavailable: 'कूलिंग सेंटर बंद',
    issueType: 'समस्या का प्रकार',
    description: 'समस्या का विवरण',
    location: 'स्थान (Location)',
    latitude: 'अक्षांश (Lat)',
    longitude: 'रेखांश (Lng)',
    pickOnMap: 'मानचित्र पर चुनें',
    detectLocation: 'मेरा स्थान पहचानें',
    submitting: 'भेजा जा रहा है...',
    submitReport: 'रिपोर्ट दर्ज करें',
    upvote: 'समर्थन दें (Upvote)',
    upvotes: 'समर्थन',
    operational: 'चालू (Operational)',
    lowSupply: 'कम आपूर्ति (Low Supply)',
    broken: 'खराब (Broken)',
    address: 'पता / लैंडमार्क',
    photoOptional: 'फोटो (वैकल्पिक)',
    clickToAttach: 'फोटो संलग्न करने के लिए क्लिक करें',
    officialResponse: 'प्रशासनिक जवाब',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
