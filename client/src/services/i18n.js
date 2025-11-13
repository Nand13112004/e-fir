import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // App Common
      appName: 'E-Court System',
      governmentOfIndia: 'Government of India',
      courtManagementSystem: 'Court Management System',
      
      // Navigation & Auth
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      createAccount: 'Create Account',
      selectLanguage: 'Select Language',
      rememberMe: 'Remember Me',
      forgotPassword: 'Forgot Password?',
      createNewAccount: 'Create New Account',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      
      // Roles
      police: 'Police',
      judge: 'Judge',
      admin: 'Administrator',
      selectRoleToLogin: 'Select your role to login',
      
      // Role Descriptions
      policeDesc: 'File complaints, track cases, forward to judge',
      judgeDesc: 'Review cases, schedule hearings, pass judgment',
      adminDesc: 'Manage users, view system statistics',
      
      // Dashboard Common
      dashboard: 'Dashboard',
      totalCases: 'Total Cases',
      pendingCases: 'Pending Cases',
      completedToday: 'Completed Today',
      upcomingHearings: 'Upcoming Hearings',
      
      // Judge Dashboard
      judgeDashboard: 'Judge Dashboard',
      hearingsToday: "Today's Hearings",
      courtComplaints: 'Court Complaints',
      noHearingsToday: 'No hearings scheduled for today.',
      noComplaints: 'No complaints currently routed to this court.',
      quickActions: 'Quick Actions',
      viewAllCases: 'View All Cases',
      scheduleHearing: 'Schedule Hearing',
      viewReports: 'View Reports',
      
      // Landing Page
      modernSystem: 'Modern Court Management System by Government of India',
      secure: 'Secure',
      secureDesc: 'High-level security with data protection',
      fast: 'Fast',
      fastDesc: 'Quick case processing and tracking',
      transparent: 'Transparent',
      transparentDesc: 'Complete transparency in all processes',
      needHelp: 'Need Help?',
      helpDesc: 'If you have any issues using the system, please contact the help center',
      userGuide: 'User Guide',
      contactUs: 'Contact Us',
      
      // Form Fields
      email: 'Email Address',
      password: 'Password',
      name: 'Full Name',
      department: 'Department',
      emailPlaceholder: 'Example: user@example.com',
      passwordPlaceholder: 'Enter your password',
      namePlaceholder: 'Enter your full name',
      
      // Status
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      inProgress: 'In Progress',
      completed: 'Completed',
      
      // Actions
      viewDetails: 'View Details',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      loading: 'Loading...',
      
      // Security
      securityNotice: 'Security Notice',
      securityDesc: 'This is a secure government portal. Please do not share your login information with anyone.',
      
      // Footer
      allRightsReserved: 'All Rights Reserved',
      help: 'Help',
      privacyPolicy: 'Privacy Policy',
      termsOfUse: 'Terms of Use',
      securityPolicy: 'Security Policy',
      technicalSupport: 'Technical Support',
      
      // Breadcrumbs
      home: 'Home',
      policeDashboard: 'Police Dashboard',
      judgeDashboard: 'Judge Dashboard',
      adminDashboard: 'Admin Dashboard',
      
      // Messages
      // Auth page content
      loginFailed: 'Login failed',
      allFieldsRequired: 'All fields are required',
      pleaseSelectCourt: 'Please select a court',
      registrationFailed: 'Registration failed',
      createAccount: 'Create Account',
      fullName: 'Full Name',
      adminOnlyNote: 'Note: In production, only Admin can create new users.',
      court: 'Court',
      creating: 'Creating...',
      register: 'Register',
      newComplaint: 'New Complaint',
      trackComplaints: 'Track Complaints',
      helpFaq: 'Help & FAQ',
      dashboardOverview: 'Dashboard Overview',
      roleMismatch: 'Role mismatch for this account',
      loggingIn: 'Logging in...',
      dashboardLoading: 'Loading dashboard...',
      
      // Time & Date
      today: 'Today',
      date: 'Date',
      time: 'Time',
      courtroom: 'Courtroom',
      notScheduled: 'Not Scheduled',
      
      // Complaints
      complaintNumber: 'Complaint Number',
      title: 'Title',
      description: 'Description',
      status: 'Status',
      createdAt: 'Created At',
      hearing: 'Hearing',
      newDate: 'New Date',
      detailedList: 'Detailed List',
      monthlySummary: 'Monthly Summary',
      
      // Court Names
      courtName: 'Ahmedabad Central Court'
    }
  },
  hi: {
    translation: {
      // App Common
      appName: 'ई-न्यायालय प्रणाली',
      governmentOfIndia: 'भारत सरकार',
      courtManagementSystem: 'न्यायालयीन प्रबंधन प्रणाली',
      
      // Navigation & Auth
      login: 'लॉगिन',
      logout: 'लॉगआउट',
      register: 'पंजीकरण',
      createAccount: 'खाता बनाएं',
      selectLanguage: 'भाषा चुनें',
      rememberMe: 'मुझे याद रखें',
      forgotPassword: 'पासवर्ड भूल गए?',
      createNewAccount: 'नया खाता बनाएं',
      dontHaveAccount: 'क्या आपका खाता नहीं है?',
      alreadyHaveAccount: 'क्या आपका पहले से खाता है?',
      
      // Roles
      police: 'पुलिस',
      judge: 'न्यायाधीश',
      admin: 'प्रशासक',
      selectRoleToLogin: 'लॉगिन के लिए अपनी भूमिका चुनें',
      
      // Role Descriptions
      policeDesc: 'शिकायत दर्ज करें, ट्रैक करें और न्यायाधीश को भेजें',
      judgeDesc: 'मामलों की समीक्षा, सुनवाई निर्धारण और न्याय',
      adminDesc: 'उपयोगकर्ता प्रबंधन और सिस्टम आँकड़े',
      
      // Dashboard Common
      dashboard: 'डैशबोर्ड',
      totalCases: 'कुल मामले',
      pendingCases: 'लंबित मामले',
      completedToday: 'आज पूर्ण',
      upcomingHearings: 'आगामी सुनवाई',
      
      // Judge Dashboard
      judgeDashboard: 'न्यायाधीश डैशबोर्ड',
      hearingsToday: 'आज की सुनवाई',
      courtComplaints: 'न्यायालयीन शिकायतें',
      noHearingsToday: 'आज कोई सुनवाई निर्धारित नहीं है।',
      noComplaints: 'वर्तमान में कोई शिकायत निर्धारित नहीं है।',
      quickActions: 'त्वरित कार्य',
      viewAllCases: 'सभी मामले देखें',
      scheduleHearing: 'सुनवाई निर्धारित करें',
      viewReports: 'रिपोर्ट देखें',
      
      // Landing Page
      modernSystem: 'भारत सरकार का आधुनिक न्यायालयीन प्रबंधन प्रणाली',
      secure: 'सुरक्षित',
      secureDesc: 'उच्च स्तरीय सुरक्षा के साथ डेटा संरक्षण',
      fast: 'तीव्र',
      fastDesc: 'त्वरित केस प्रोसेसिंग और ट्रैकिंग',
      transparent: 'पारदर्शी',
      transparentDesc: 'सभी प्रक्रियाओं में पूर्ण पारदर्शिता',
      needHelp: 'सहायता चाहिए?',
      helpDesc: 'यदि आपको सिस्टम का उपयोग करने में कोई समस्या है तो कृपया सहायता केंद्र से संपर्क करें',
      userGuide: 'उपयोग गाइड',
      contactUs: 'संपर्क करें',
      
      // Form Fields
      email: 'ईमेल पता',
      password: 'पासवर्ड',
      name: 'पूरा नाम',
      department: 'विभाग',
      emailPlaceholder: 'उदाहरण: user@example.com',
      passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
      namePlaceholder: 'अपना पूरा नाम दर्ज करें',
      
      // Status
      pending: 'लंबित',
      approved: 'स्वीकृत',
      rejected: 'अस्वीकृत',
      inProgress: 'प्रगति में',
      completed: 'पूर्ण',
      
      // Actions
      viewDetails: 'विवरण देखें',
      submit: 'जमा करें',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      loading: 'लोड हो रहा है...',
      
      // Security
      securityNotice: 'सुरक्षा सूचना',
      securityDesc: 'यह एक सुरक्षित सरकारी पोर्टल है। कृपया अपनी लॉगिन जानकारी किसी के साथ साझा न करें।',
      
      // Footer
      allRightsReserved: 'सभी अधिकार सुरक्षित',
      help: 'सहायता',
      privacyPolicy: 'गोपनीयता नीति',
      termsOfUse: 'उपयोग की शर्तें',
      securityPolicy: 'सुरक्षा नीति',
      technicalSupport: 'तकनीकी सहायता',
      
      // Breadcrumbs
      home: 'होम',
      policeDashboard: 'पुलिस डैशबोर्ड',
      judgeDashboard: 'न्यायाधीश डैशबोर्ड',
      adminDashboard: 'प्रशासन डैशबोर्ड',
      
      // Messages
      loginFailed: 'लॉगिन असफल',
      allFieldsRequired: 'सभी फ़ील्ड आवश्यक हैं',
      pleaseSelectCourt: 'कृपया न्यायालय चुनें',
      registrationFailed: 'पंजीकरण असफल',
      createAccount: 'खाता बनाएं',
      fullName: 'पूरा नाम',
      adminOnlyNote: 'नोट: उत्पादन में, केवल एडमिन नए उपयोगकर्ता बना सकते हैं।',
      court: 'न्यायालय',
      creating: 'बनाया जा रहा है...',
      register: 'पंजीकरण',
      newComplaint: 'नई शिकायत',
      trackComplaints: 'शिकायतों को ट्रैक करें',
      helpFaq: 'सहायता और FAQ',
      roleMismatch: 'इस खाते के लिए भूमिका मेल नहीं खाती',
      loggingIn: 'लॉगिन हो रहा है...',
      dashboardLoading: 'डैशबोर्ड लोड हो रहा है...',
      
      // Time & Date
      today: 'आज',
      date: 'दिनांक',
      time: 'समय',
      courtroom: 'कक्ष',
      notScheduled: 'निर्धारित नहीं',
      
      // Complaints
      complaintNumber: 'शिकायत संख्या',
      title: 'शीर्षक',
      description: 'विवरण',
      status: 'स्थिति',
      createdAt: 'निर्मित',
      hearing: 'सुनवाई',
      newDate: 'नई तारीख',
      detailedList: 'विस्तृत सूची',
      monthlySummary: 'मासिक सारांश',
      
      // Court Names
      courtName: 'अहमदाबाद केंद्रीय न्यायालय'
    }
  },
  gu: {
    translation: {
      // App Common
      appName: 'ઇ-કોર્ટ સિસ્ટમ',
      governmentOfIndia: 'ભારત સરકાર',
      courtManagementSystem: 'કોર્ટ મેનેજમેન્ટ સિસ્ટમ',
      
      // Navigation & Auth
      login: 'લૉગિન',
      logout: 'લૉગઆઉટ',
      register: 'નોંધણી',
      createAccount: 'ખાતું બનાવો',
      selectLanguage: 'ભાષા પસંદ કરો',
      rememberMe: 'મને યાદ રાખો',
      forgotPassword: 'પાસવર્ડ ભૂલી ગયા?',
      createNewAccount: 'નવું ખાતું બનાવો',
      dontHaveAccount: 'શું તમારું ખાતું નથી?',
      alreadyHaveAccount: 'શું તમારું પહેલેથી ખાતું છે?',
      
      // Roles
      police: 'પોલીસ',
      judge: 'ન્યાયાધીશ',
      admin: 'એડમિનિસ્ટ્રેટર',
      selectRoleToLogin: 'લૉગિન માટે તમારી ભૂમિકા પસંદ કરો',
      
      // Role Descriptions
      policeDesc: 'ફરિયાદ દાખલ કરો, ટ્રેક કરો અને ન્યાયાધીશને મોકલો',
      judgeDesc: 'કેસોની સમીક્ષા કરો, સુનાવણી નક્કી કરો અને ચુકાદો આપો',
      adminDesc: 'વપરાશકર્તા વ્યવસ્થાપન અને સિસ્ટમ આંકડા',
      
      // Dashboard Common
      dashboard: 'ડેશબોર્ડ',
      totalCases: 'કુલ કેસો',
      pendingCases: 'બાકી કેસો',
      completedToday: 'આજે પૂર્ણ',
      upcomingHearings: 'આગામી સુનાવણી',
      
      // Judge Dashboard
      judgeDashboard: 'ન્યાયાધીશ ડેશબોર્ડ',
      hearingsToday: 'આજની સુનાવણી',
      courtComplaints: 'કોર્ટ ફરિયાદો',
      noHearingsToday: 'આજે કોઈ સુનાવણી નિર્ધારિત નથી.',
      noComplaints: 'હાલમાં કોઈ ફરિયાદ નિર્ધારિત નથી.',
      quickActions: 'ઝડપી ક્રિયાઓ',
      viewAllCases: 'બધા કેસ જુઓ',
      scheduleHearing: 'સુનાવણી નક્કી કરો',
      viewReports: 'રિપોર્ટ જુઓ',
      
      // Landing Page
      modernSystem: 'ભારત સરકારનું આધુનિક કોર્ટ મેનેજમેન્ટ સિસ્ટમ',
      secure: 'સુરક્ષિત',
      secureDesc: 'ડેટા સુરક્ષા સાથે ઉચ્ચ સ્તરની સુરક્ષા',
      fast: 'ઝડપી',
      fastDesc: 'ઝડપી કેસ પ્રોસેસિંગ અને ટ્રેકિંગ',
      transparent: 'પારદર્શક',
      transparentDesc: 'બધી પ્રક્રિયાઓમાં સંપૂર્ણ પારદર્શિતા',
      needHelp: 'મદદ જોઈએ છે?',
      helpDesc: 'જો તમને સિસ્ટમનો ઉપયોગ કરવામાં કોઈ સમસ્યા હોય તો કૃપા કરીને સહાય કેન્દ્રનો સંપર્ક કરો',
      userGuide: 'વપરાશકર્તા માર્ગદર્શિકા',
      contactUs: 'અમારો સંપર્ક કરો',
      
      // Form Fields
      email: 'ઇમેઇલ સરનામું',
      password: 'પાસવર્ડ',
      name: 'પૂરું નામ',
      department: 'વિભાગ',
      emailPlaceholder: 'ઉદાહરણ: user@example.com',
      passwordPlaceholder: 'તમારો પાસવર્ડ દાખલ કરો',
      namePlaceholder: 'તમારું પૂરું નામ દાખલ કરો',
      
      // Status
      pending: 'બાકી',
      approved: 'મંજૂર',
      rejected: 'નકારાયેલ',
      inProgress: 'પ્રગતિમાં',
      completed: 'પૂર્ણ',
      
      // Actions
      viewDetails: 'વિગતો જુઓ',
      submit: 'સબમિટ કરો',
      cancel: 'રદ કરો',
      save: 'સેવ કરો',
      delete: 'ડિલીટ કરો',
      edit: 'એડિટ કરો',
      loading: 'લોડ થઈ રહ્યું છે...',
      
      // Security
      securityNotice: 'સુરક્ષા સૂચના',
      securityDesc: 'આ એક સુરક્ષિત સરકારી પોર્ટલ છે. કૃપા કરીને તમારી લૉગિન માહિતી કોઈ સાથે શેર કરશો નહીં.',
      
      // Footer
      allRightsReserved: 'બધા અધિકારો અનામત',
      help: 'મદદ',
      privacyPolicy: 'ગોપનીયતા નીતિ',
      termsOfUse: 'ઉપયોગની શરતો',
      securityPolicy: 'સુરક્ષા નીતિ',
      technicalSupport: 'ટેકનિકલ સપોર્ટ',
      
      // Breadcrumbs
      home: 'હોમ',
      policeDashboard: 'પોલીસ ડેશબોર્ડ',
      judgeDashboard: 'ન્યાયાધીશ ડેશબોર્ડ',
      adminDashboard: 'એડમિન ડેશબોર્ડ',
      
      // Messages
      loginFailed: 'લૉગિન નિષ્ફળ',
      allFieldsRequired: 'બધા ફીલ્ડ આવશ્યક છે',
      pleaseSelectCourt: 'કૃપા કરીને કોર્ટ પસંદ કરો',
      registrationFailed: 'નોંધણી નિષ્ફળ',
      createAccount: 'ખાતું બનાવો',
      fullName: 'પૂરું નામ',
      adminOnlyNote: 'નોંધ: પ્રોડક્શનમાં, ફક્ત એડમિન નવા યુઝર બનાવી શકે છે.',
      court: 'કોર્ટ',
      creating: 'બનાવી રહ્યું છે...',
      register: 'નોંધણી',
      newComplaint: 'નવી ફરિયાદ',
      trackComplaints: 'ફરિયાદો ટ્રેક કરો',
      helpFaq: 'સહાય અને FAQ',
      roleMismatch: 'આ ખાતા માટે ભૂમિકા મેળ ખાતી નથી',
      loggingIn: 'લૉગિન થઈ રહ્યું છે...',
      dashboardLoading: 'ડેશબોર્ડ લોડ થઈ રહ્યું છે...',
      
      // Time & Date
      today: 'આજે',
      date: 'તારીખ',
      time: 'સમય',
      courtroom: 'કોર્ટરૂમ',
      notScheduled: 'નિર્ધારિત નથી',
      
      // Complaints
      complaintNumber: 'ફરિયાદ નંબર',
      title: 'શીર્ષક',
      description: 'વર્ણન',
      status: 'સ્થિતિ',
      createdAt: 'બનાવવામાં આવ્યું',
      hearing: 'સુનાવણી',
      newDate: 'નવી તારીખ',
      detailedList: 'વિગતવાર યાદી',
      monthlySummary: 'માસિક સારાંશ',
      
      // Court Names
      courtName: 'અમદાવાદ સેન્ટ્રલ કોર્ટ'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'hi', // Default to Hindi as per Indian government preference
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage']
  }
});

export default i18n;


