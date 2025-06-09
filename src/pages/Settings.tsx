import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{t("Settings")}</h1>
      <p>{t("Hello World")}</p>
    </div>
  );
};

export default Settings;
