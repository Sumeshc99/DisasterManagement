import React, { useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ApiManager from '../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../store/RootReducer';

i18n.use(initReactI18next).init({
  resources: {},
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const language = useSelector((state: RootState) => state.language.language);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const res = await ApiManager.language();
        const langData = res.data?.data || [];

        const enObj: Record<string, string> = {};
        const hiObj: Record<string, string> = {};
        const mrObj: Record<string, string> = {};

        langData.forEach((item: any) => {
          const code = item.language_code?.trim();
          const key = item.key_name?.trim();
          const value = item.value?.trim();

          if (!code || !key || !value) return;

          switch (code) {
            case 'en':
              enObj[key] = value;
              break;
            case 'hi':
              hiObj[key] = value;
              break;
            case 'mr':
              mrObj[key] = value;
              break;
            default:
              console.warn('⚠️ Unknown language code:', code);
          }
        });

        // Log what we built
        // console.log('🇬🇧 EN Object:', enObj);
        // console.log('🇮🇳 HI Object:', hiObj);
        // console.log('🇲🇾 MR Object:', mrObj);

        // Add to i18next
        i18n.addResourceBundle('en', 'translation', enObj, true, true);
        i18n.addResourceBundle('hi', 'translation', hiObj, true, true);
        i18n.addResourceBundle('mr', 'translation', mrObj, true, true);

        console.log('✅ Translations loaded into i18n successfully!');
      } catch (error) {
        console.error('❌ Error loading language data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLanguages();
  }, []);

  if (loading) {
    // console.log('⏳ Loading translations...');
    i18n.changeLanguage(language);
    return null;
  }

  // console.log('🚀 i18n ready, rendering app...');
  return <>{children}</>;
};

export default i18n;
