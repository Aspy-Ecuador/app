import { defineConfig } from 'cypress';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';


export default defineConfig({
  projectId: 'qxkk7u',
  e2e: {
    specPattern: 'cypress/e2e/**/*.feature',
    baseUrl: 'http://localhost:5173/app',
    chromeWebSecurity: false,  // Esto puede ayudar a evitar problemas de CORS durante las pruebas
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
      });

      on('file:preprocessor', bundler);

      return config;
    },
  },
});
