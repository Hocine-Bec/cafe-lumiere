import { useTranslation } from 'react-i18next';

export function useLanguage() {
  const { t, i18n } = useTranslation();

  const language = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const isRtl = language === 'ar';

  const setLanguage = (lang: 'en' | 'ar') => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  return { language, setLanguage, isRtl, t };
}
