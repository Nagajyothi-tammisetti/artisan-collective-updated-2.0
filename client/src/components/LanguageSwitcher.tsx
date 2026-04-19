import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const currentLang = i18n.language;

  return (
    <div className="flex gap-1 border border-border rounded-lg p-1">
      {[
        { code: "en", label: "EN" },
        { code: "hi", label: "हि" },
        { code: "te", label: "తె" },
      ].map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          style={{
            padding: "2px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: currentLang === lang.code ? "700" : "400",
            background: currentLang === lang.code ? "hsl(21, 85%, 56%)" : "transparent",
            color: currentLang === lang.code ? "white" : "inherit",
            cursor: "pointer",
            border: "none",
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}