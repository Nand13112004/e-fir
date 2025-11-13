import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'E-Court System',
      login: 'Login',
      police: 'Police',
      judge: 'Judge',
      admin: 'Admin',
      selectRoleToLogin: 'Select your role to login',
      logout: 'Logout'
    }
  },
  hi: {
    translation: {
      appName: 'ई-कोर्ट प्रणाली',
      login: 'लॉगिन',
      police: 'पुलिस',
      judge: 'न्यायाधीश',
      admin: 'प्रशासक',
      selectRoleToLogin: 'लॉगिन के लिए अपनी भूमिका चुनें',
      logout: 'लॉगआउट'
    }
  },
  gu: {
    translation: {
      appName: 'ઇ-કોર્ટ સિસ્ટમ',
      login: 'લૉગિન',
      police: 'પોલીસ',
      judge: 'ન્યાયાધીશ',
      admin: 'એડમિન',
      selectRoleToLogin: 'લૉગિન માટે તમારી ભૂમિકા પસંદ કરો',
      logout: 'લૉગઆઉટ'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;


