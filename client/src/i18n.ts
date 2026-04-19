import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          nav: {
            home: "Home",
            marketplace: "Discover",
            stories: "Stories",
            about: "About",
            login: "Login",
            logout: "Logout",
            artisans: "Artisans",
            aitools: "AI Tools",
            welcome: "Welcome",
            join: "Join Now",
          },
          home: {
            hero_title: "Discover Authentic Handcrafted Products",
            hero_subtitle: "Connect directly with skilled artisans",
            explore_button: "Explore Marketplace",
          },
          common: {
            loading: "Loading...",
            search: "Search",
            add_to_cart: "Add to Cart",
          },
        },
      },
      hi: {
        translation: {
          nav: {
            home: "होम",
            marketplace: "खोजें",
            stories: "कहानियाँ",
            about: "परिचय",
            login: "लॉगिन",
            logout: "लॉगआउट",
            artisans: "कारीगर",
            aitools: "AI उपकरण",
            welcome: "स्वागत",
            join: "अभी जुड़ें",
          },
          home: {
            hero_title: "प्रामाणिक हस्तनिर्मित उत्पाद खोजें",
            hero_subtitle: "कुशल कारीगरों से सीधे जुड़ें",
            explore_button: "बाज़ार देखें",
          },
          common: {
            loading: "लोड हो रहा है...",
            search: "खोजें",
            add_to_cart: "कार्ट में जोड़ें",
          },
        },
      },
      te: {
        translation: {
          nav: {
            home: "హోమ్",
            marketplace: "అన్వేషించండి",
            stories: "కథలు",
            about: "గురించి",
            login: "లాగిన్",
            logout: "లాగౌట్",
            artisans: "కళాకారులు",
            aitools: "AI సాధనాలు",
            welcome: "స్వాగతం",
            join: "ఇప్పుడు చేరండి",
          },
          home: {
            hero_title: "అసలైన చేతివృత్తుల ఉత్పత్తులను కనుగొనండి",
            hero_subtitle: "నేర్పరి కళాకారులతో నేరుగా అనుసంధానం అవ్వండి",
            explore_button: "మార్కెట్‌ప్లేస్ అన్వేషించండి",
          },
          common: {
            loading: "లోడవుతోంది...",
            search: "వెతకండి",
            add_to_cart: "కార్ట్‌కు జోడించండి",
          },
        },
      },
    },
    lng: localStorage.getItem("language") || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;