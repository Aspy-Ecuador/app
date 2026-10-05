import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // Nombre del Studio publicado: https://aspy-ecuador.sanity.studio
  studioHost: "aspy-ecuador",
  deployment: {
    // Id de la aplicación desplegada (evita preguntas en `npm run deploy`)
    appId: "gyazl149rm1eqklyla3jvrmg",
  },
});
