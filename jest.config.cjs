module.exports = {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",  // linea agregada
    "^@shared-theme/(.*)$": "<rootDir>/src/shared-theme/$1", // ✅ LÍNEA AGREGADA    
    "^@assets/(.*)$": "<rootDir>/src/assets/$1",   // <-- línea agregada    
    "^@forms/(.*)$": "<rootDir>/src/components/forms/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@data/(.*)$": "<rootDir>/src/data/$1",
    "\\.(css|scss)$": "identity-obj-proxy",
    "^@aldabil/react-scheduler$": "<rootDir>/src/__mocks__/react-scheduler-mock.js",  //Linea agregada
  },
  transformIgnorePatterns: [
  "node_modules/(?!(\\@mui\\/x-date-pickers\\/.*))"
  ],
  testMatch: [
    "**/__tests__/**/*.test.(ts|tsx|js|jsx)",
    "**/?(*.)+(spec|test).(ts|tsx|js|jsx)",
  ],
};
