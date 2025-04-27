module.exports = {
  // La ruta base donde Jest buscará los archivos
  roots: ["<rootDir>/src"],
  
  // Extensiones de archivo que Jest procesará
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  
  // Un patrón regexp que debe coincidir con todos los archivos de prueba
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?)$",
  
  // Transformaciones que debe hacer Jest en los archivos antes de ejecutar las pruebas
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  
  // Ignora estos módulos al transformar con babel-jest
  transformIgnorePatterns: [
    "node_modules/(?!(axios|react-router-dom)/)"
  ],
  
  // Mapeo de módulos para resolver problemas con módulos específicos
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "axios": "<rootDir>/node_modules/axios/dist/axios.js",
    "^react-markdown$": "<rootDir>/src/__mocks__/reactMarkdownMock.js"
  },
  
  // Configura un entorno de prueba web para browser
  testEnvironment: "jsdom",
  
  // Archivos a ejecutar antes de las pruebas
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  
  // Cobertura de código
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/index.js",
    "!src/reportWebVitals.js",
    "!src/setupTests.js"
  ],
  
  // Umbral de cobertura deseado
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 50,
      functions: 50,
      lines: 50
    }
  }
}; 