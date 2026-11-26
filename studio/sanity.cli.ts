import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "0ax9v9qq",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  deployment: {
    autoUpdates: true,
  },
});
