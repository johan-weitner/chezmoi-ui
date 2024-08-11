import { IconDownload } from "@tabler/icons-react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const mainMenu = {
  app: [
    {
      label: "Export Install.Doctor YAML file",
      icon: IconDownload,
      onClick: () => window.open(`${BACKEND_URL}/groupedApps`),
      key: "m1",
    },
  ],
  group: [
    {
      label: "Export Install.Doctor YAML file",
      icon: IconDownload,
      onClick: () => window.open(`${BACKEND_URL}/groupedApps`),
      key: "m1",
    },
  ]
};