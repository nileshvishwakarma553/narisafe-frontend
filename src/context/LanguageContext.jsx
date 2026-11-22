// NariSafe Complete Bilingual Translations (English & Hindi)
import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  en: {
    // Brand
    brandName: "NariSafe",
    tagline: "Women Safety Analytics & Real-Time Emergency Support System",
    shieldVersion: "SHIELD 2.0",
    
    // Languages
    langEn: "English",
    langHi: "हिंदी (Hindi)",
    languageSwitch: "Language / भाषा",
    
    // Navbar & Status
    statusSafe: "STATUS: SAFE",
    statusMonitoring: "MONITORING ON",
    statusEmergency: "EMERGENCY ACTIVE",
    logout: "Sign Out",
    profile: "Profile Settings",
    workspace: "Active Workspace",
    console: "Console",
    notifications: "Notifications",
    noNotifications: "No new notifications",
    
    // Navigation items
    navOverview: "Dashboard Overview",
    navContacts: "Emergency Contacts",
    navLiveLocation: "Live Location Sharing",
    navSaferRoutes: "Safer Route Finder",
    navSafePlaces: "Nearby Safe Places",
    navReportIncident: "Report Incident",
    navHelplines: "Helpline Directory",
    navGuardianDashboard: "Guardian Dashboard",
    navGuardianInvites: "Manage Invitations",
    navAdminDashboard: "Admin Dashboard",
    navIncidentPipeline: "Incident Review Pipeline",
    navSafetyAnalytics: "Safety Analytics & Heatmap",
    navUserDirectory: "User Directory",
    navManageHelplines: "Manage Helplines",

    // Dashboard Overview
    welcomeBack: "Welcome back",
    dashboardSubtitle: "Your personal security grid is active. 24x7 monitoring and emergency dispatch ready.",
    safetyStatusHeading: "Current Safety Status",
    currentLocation: "Current Detected Location",
    accuracy: "Accuracy",
    quickActions: "Quick Safety Actions",
    btnShareLive: "Share Live GPS",
    btnFindSaferRoute: "Find Safer Route",
    btnReportIncident: "Report Incident",
    btnSafeHavens: "Find Safe Havens",
    recentSafetyActivity: "Nearby Verified Incidents",
    noRecentIncidents: "No critical incidents reported in your immediate vicinity. Area is currently secure.",
    nearbyHavensTitle: "Nearby Safe Havens (Within 5 km)",
    viewAllSafePlaces: "View All Safe Havens",
    primaryContact: "Primary Emergency Lifeline",
    noPrimaryContact: "No primary emergency contact configured yet.",
    setupContact: "Set Up Contact",

    // SOS Component
    sosTitle: "One-Tap Emergency SOS",
    sosSubtitle: "Press or hold to trigger real-time dispatch to guardians & local emergency services",
    sosTriggeringIn: "DISPATCHING SOS IN",
    sosCancelBtn: "Cancel SOS",
    sosPressText: "TAP OR HOLD FOR SOS",
    sosActiveAlert: "🚨 EMERGENCY DISPATCH ACTIVE",
    sosActiveDesc: "Your live coordinates have been broadcast to your registered guardians and emergency services.",
    sosResolvedBtn: "Mark as Safe / Resolve Emergency",
    callPolice112: "Call Police (112)",
    callWomenHelpline: "Women Helpline (1091)",

    // Emergency Contacts Page
    contactsTitle: "Emergency Contacts & Guardian Network",
    contactsSubtitle: "Manage your personal lifeline. These contacts receive immediate SOS notifications and live coordinates.",
    btnInviteGuardian: "Invite App Guardian",
    btnAddContact: "Add Emergency Contact",
    directContactsCount: "Direct Emergency Contacts",
    accessibleForCalling: "Accessible for 1-Tap Calling & SMS",
    noContactsYet: "No emergency contacts configured yet",
    noContactsSub: "Add at least one trusted primary contact who can be reached immediately during emergencies.",
    addFirstContact: "Add First Contact",
    btnCall: "Call",
    btnSendAlertSMS: "SMS / Alert",
    primaryBadge: "Primary",
    editContact: "Edit",
    deleteContact: "Delete",
    appGuardiansTitle: "Connected App Guardians",
    appGuardiansSubtitle: "Users registered on NariSafe who have live dashboard monitoring access to your emergency alerts",
    noGuardiansYet: "No registered guardians linked yet. Invite a family member who has a NariSafe account.",
    authorizedGuardian: "Authorized Guardian",
    pendingAcceptance: "Pending Acceptance",
    revokeAccess: "Revoke Access",

    // Safer Route Page
    saferRouteTitle: "Safer Route Finder & Corridor Analytics",
    saferRouteSubtitle: "Analyzes street illumination, police checkpoint frequency, and crowdsourced incident clusters to surface safer commuting paths.",
    startingOrigin: "Starting Location (Origin)",
    destination: "Destination",
    useCurrentLocation: "Use Current Location",
    evaluatingCorridors: "Evaluating Corridors...",
    findSaferRoutes: "Find Safer Routes",
    recommendedRoute: "RECOMMENDED",
    alternateRoute: "ALTERNATE",
    safetyScore: "Safety Score",
    routeTrajectory: "Route Trajectory Visualization",
    safetyDisclaimerTitle: "Safety Disclaimer",
    safetyDisclaimerText: "Safety scores are based on available incident reports and do not guarantee personal safety. Always trust your intuition and stay in well-lit public zones.",

    // Nearby Safe Places
    safePlacesTitle: "Nearby Safe Havens & Emergency Support",
    safePlacesSubtitle: "Discover 24x7 verified police stations, trauma hospitals, late-night pharmacies, and Sakhi crisis centers near your real-time coordinates.",
    filterAll: "All Havens",
    filterPolice: "Police Stations",
    filterHospitals: "Hospitals & Trauma",
    filterPharmacies: "Late-Night Pharmacies",
    filterCrisis: "Crisis Centers",
    directionsBtn: "Get Directions",
    callCenterBtn: "Direct Call",

    // Helplines Page
    helplineTitle: "Emergency Helpline Directory",
    helplineSubtitle: "Toll-free 24x7 national and state women safety helplines across India.",
    nationalHelplines: "National Toll-Free Helplines",

    // SMS & SOS Emergency Message templates
    smsEmergencyBody: (name, mapsUrl, address) =>
      `🚨 EMERGENCY ALERT from NariSafe!\n${name || 'I'} need urgent assistance.\nMy live location: ${mapsUrl} (${address || 'GPS coordinates'})\nPlease assist immediately or alert police.`,
    
    // Status update labels
    statusSafeDesc: "You are in a safe, secure environment.",
    statusMonitoringDesc: "Guardians receive continuous live location pings.",
    statusEmergencyDesc: "Immediate threat detected. High priority alert.",
  },

  hi: {
    // Brand
    brandName: "नारीसेफ (NariSafe)",
    tagline: "महिला सुरक्षा एनालिटिक्स एवं त्वरित आपातकालीन सहायता प्रणाली",
    shieldVersion: "कवच 2.0",
    
    // Languages
    langEn: "English",
    langHi: "हिंदी (Hindi)",
    languageSwitch: "भाषा / Language",
    
    // Navbar & Status
    statusSafe: "स्थिति: सुरक्षित",
    statusMonitoring: "निगरानी चालू",
    statusEmergency: "आपातकाल सक्रिय",
    logout: "लॉगआउट करें",
    profile: "प्रोफ़ाइल सेटिंग्स",
    workspace: "सक्रिय कंसोल",
    console: "कंसोल",
    notifications: "सूचनाएं",
    noNotifications: "कोई नई सूचना नहीं है",
    
    // Navigation items
    navOverview: "डैशबोर्ड विवरण",
    navContacts: "आपातकालीन संपर्क",
    navLiveLocation: "लाइव लोकेशन शेयरिंग",
    navSaferRoutes: "सुरक्षित मार्ग खोजें",
    navSafePlaces: "निकटतम सुरक्षित स्थान",
    navReportIncident: "घटना रिपोर्ट करें",
    navHelplines: "हेल्पलाइन डायरेक्टरी",
    navGuardianDashboard: "अभिभावक डैशबोर्ड",
    navGuardianInvites: "निमंत्रण प्रबंधन",
    navAdminDashboard: "एडमिन डैशबोर्ड",
    navIncidentPipeline: "घटना समीक्षा पाइपलाइन",
    navSafetyAnalytics: "सुरक्षा विश्लेषण एवं हीटमैप",
    navUserDirectory: "उपयोगकर्ता सूची",
    navManageHelplines: "हेल्पलाइन प्रबंधन",

    // Dashboard Overview
    welcomeBack: "स्वागत है",
    dashboardSubtitle: "आपका व्यक्तिगत सुरक्षा कवच सक्रिय है। 24x7 आपातकालीन सहायता व निगरानी तैयार है।",
    safetyStatusHeading: "वर्तमान सुरक्षा स्थिति",
    currentLocation: "वर्तमान पहचानी गई लोकेशन",
    accuracy: "सटीकता",
    quickActions: "त्वरित सुरक्षा कार्य",
    btnShareLive: "लाइव GPS शेयर करें",
    btnFindSaferRoute: "सुरक्षित मार्ग खोजें",
    btnReportIncident: "घटना दर्ज करें",
    btnSafeHavens: "सुरक्षित स्थान खोजें",
    recentSafetyActivity: "आस-पास की हालिया घटनाएं",
    noRecentIncidents: "आपके निकटतम क्षेत्र में कोई अप्रिय घटना रिपोर्ट नहीं है। क्षेत्र सुरक्षित है।",
    nearbyHavensTitle: "निकटतम सुरक्षित ठिकाने (5 किमी के भीतर)",
    viewAllSafePlaces: "सभी सुरक्षित स्थान देखें",
    primaryContact: "प्राथमिक आपातकालीन जीवनरेखा",
    noPrimaryContact: "कोई प्राथमिक संपर्क अभी सेट नहीं है।",
    setupContact: "संपर्क जोड़ें",

    // SOS Component
    sosTitle: "एक-टैप आपातकालीन SOS",
    sosSubtitle: "अभिभावकों और स्थानीय आपातकालीन सेवाओं को त्वरित अलर्ट भेजने हेतु टैप करें या दबाकर रखें",
    sosTriggeringIn: "SOS अलर्ट भेजा जा रहा है:",
    sosCancelBtn: "रद्द करें",
    sosPressText: "SOS के लिए टैप करें या दबाकर रखें",
    sosActiveAlert: "🚨 आपातकालीन अलर्ट सक्रिय है",
    sosActiveDesc: "आपकी लाइव लोकेशन पंजीकृत अभिभावकों और आपातकालीन सेवाओं को भेज दी गई है।",
    sosResolvedBtn: "सुरक्षित चिह्नित करें / अलर्ट समाप्त करें",
    callPolice112: "पुलिस को कॉल करें (112)",
    callWomenHelpline: "महिला हेल्पलाइन (1091)",

    // Emergency Contacts Page
    contactsTitle: "आपातकालीन संपर्क एवं अभिभावक नेटवर्क",
    contactsSubtitle: "अपनी व्यक्तिगत जीवनरेखा का प्रबंधन करें। SOS सक्रिय होने पर इन संपर्कों को तुरंत लाइव लोकेशन और सूचना मिलती है।",
    btnInviteGuardian: "अभिभावक आमंत्रित करें",
    btnAddContact: "आपातकालीन संपर्क जोड़ें",
    directContactsCount: "प्रत्यक्ष आपातकालीन संपर्क",
    accessibleForCalling: "1-टैप कॉलिंग और SMS हेतु उपलब्ध",
    noContactsYet: "कोई आपातकालीन संपर्क अभी नहीं जोड़ा गया",
    noContactsSub: "कम से कम एक विश्वसनीय प्राथमिक संपर्क जोड़ें जिसे संकट के समय तुरंत संपर्क किया जा सके।",
    addFirstContact: "पहला संपर्क जोड़ें",
    btnCall: "कॉल करें",
    btnSendAlertSMS: "SMS / अलर्ट भेजें",
    primaryBadge: "मुख्य संपर्क",
    editContact: "संपादित करें",
    deleteContact: "हटाएं",
    appGuardiansTitle: "जुड़े हुए ऐप अभिभावक",
    appGuardiansSubtitle: "नारीसेफ पर पंजीकृत अभिभावक जिन्हें आपके आपातकालीन अलर्ट्स की लाइव मॉनिटरिंग अनुमति प्राप्त है",
    noGuardiansYet: "कोई पंजीकृत अभिभावक अभी नहीं जुड़ा है। अपने परिवार के सदस्य को आमंत्रित करें जिनका नारीसेफ खाता है।",
    authorizedGuardian: "अधिकृत अभिभावक",
    pendingAcceptance: "स्वीकृति लंबित",
    revokeAccess: "अनुमति हटाएं",

    // Safer Route Page
    saferRouteTitle: "सुरक्षित मार्ग खोजक एवं कॉरिडोर विश्लेषण",
    saferRouteSubtitle: "सड़कों की रोशनी (स्ट्रीट लाइट), पुलिस चौकियों और पिछली घटनाओं के आधार पर सबसे सुरक्षित आवागमन मार्ग बताता है।",
    startingOrigin: "प्रारंभिक स्थान (कहाँ से)",
    destination: "गंतव्य स्थान (कहाँ तक)",
    useCurrentLocation: "मेरी वर्तमान लोकेशन लें",
    evaluatingCorridors: "सुरक्षित मार्गों का विश्लेषण हो रहा है...",
    findSaferRoutes: "सुरक्षित मार्ग खोजें",
    recommendedRoute: "अनुशंसित (सबसे सुरक्षित)",
    alternateRoute: "वैकल्पिक मार्ग",
    safetyScore: "सुरक्षा स्कोर",
    routeTrajectory: "मार्ग रेखाचित्र एवं नक्शा",
    safetyDisclaimerTitle: "सुरक्षा अस्वीकरण",
    safetyDisclaimerText: "सुरक्षा स्कोर उपलब्ध रिपोर्टों पर आधारित है। हमेशा अपनी समझदारी पर भरोसा रखें और अच्छी रोशनी वाले सार्वजनिक क्षेत्रों में ही रहें।",

    // Nearby Safe Places
    safePlacesTitle: "निकटतम सुरक्षित स्थान एवं आपातकालीन सहायता",
    safePlacesSubtitle: "अपनी लाइव लोकेशन के पास 24x7 सत्यापित पुलिस स्टेशन, ट्रॉमा अस्पताल, देर रात खुली फ़ार्मेसी और सखी संकट केंद्र खोजें।",
    filterAll: "सभी स्थान",
    filterPolice: "पुलिस स्टेशन",
    filterHospitals: "अस्पताल व ट्रॉमा",
    filterPharmacies: "24/7 दवा दुकानें",
    filterCrisis: "सखी संकट केंद्र",
    directionsBtn: "रास्ता देखें",
    callCenterBtn: "कॉल करें",

    // Helplines Page
    helplineTitle: "आपातकालीन हेल्पलाइन डायरेक्टरी",
    helplineSubtitle: "भारत भर में 24x7 टोल-फ्री राष्ट्रीय और राज्य महिला सुरक्षा हेल्पलाइन नंबर।",
    nationalHelplines: "राष्ट्रीय टोल-फ्री हेल्पलाइन",

    // SMS & SOS Emergency Message templates (In Hindi!)
    smsEmergencyBody: (name, mapsUrl, address) =>
      `🚨 नारीसेफ (NariSafe) से आपातकालीन अलर्ट!\n${name || 'मुझे'} तत्काल सहायता की आवश्यकता है।\nमेरी लाइव लोकेशन: ${mapsUrl} (${address || 'GPS स्थान'})\nकृपया तुरंत सहायता करें या पुलिस (112) को सूचित करें।`,

    // Status update labels
    statusSafeDesc: "आप एक सुरक्षित वातावरण में हैं।",
    statusMonitoringDesc: "अभिभावकों को लगातार लाइव लोकेशन पिंग्स मिल रहे हैं।",
    statusEmergencyDesc: "तात्कालिक खतरे की संभावना। उच्च प्राथमिकता अलर्ट।",
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('narisafe_language') || 'en';
  });

  const changeLanguage = (lang) => {
    if (lang === 'en' || lang === 'hi') {
      setLanguage(lang);
      localStorage.setItem('narisafe_language', lang);
    }
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
