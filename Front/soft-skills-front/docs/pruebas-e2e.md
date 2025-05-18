# Guía de Pruebas End-to-End (E2E) para Soft Skills App

Esta guía proporciona información sobre la implementación de pruebas E2E en nuestra aplicación de habilidades blandas, específicamente para los módulos de oratoria y pensamiento crítico.

## ¿Qué son las pruebas E2E?

Las pruebas E2E (End-to-End) verifican el funcionamiento de la aplicación desde la perspectiva del usuario final, probando flujos completos de interacción. A diferencia de las pruebas unitarias que prueban componentes individuales, las pruebas E2E prueban la integración de todos los componentes de la aplicación.

## Herramientas utilizadas

- **Cypress**: Framework principal para pruebas E2E
- **start-server-and-test**: Automatización de inicio del servidor y ejecución de pruebas
- **Fixtures de Cypress**: Para datos de prueba

## Estructura del proyecto

```
Front/soft-skills-front/
├── cypress/
│   ├── e2e/                      # Pruebas E2E
│   │   ├── flujos-usuario/       # Pruebas de flujos de usuario
│   │   └── README.md             # Documentación de pruebas
│   ├── fixtures/                 # Datos de prueba
│   │   └── example.json          # Datos de ejemplo
│   └── support/                  # Utilidades y configuración
│       ├── commands.js           # Comandos personalizados
│       └── e2e.js                # Configuración global
├── cypress.config.js             # Configuración de Cypress
└── docs/
    └── pruebas-e2e.md            # Esta guía
```

## Flujos de usuario probados

### Módulo de Oratoria (ID: 253)
1. **Navegación al módulo**: Desde el dashboard a la página principal de oratoria
2. **Visualización de herramientas**: Ver las herramientas disponibles de oratoria
3. **Práctica de discurso**: Flujo completo de iniciar y completar una práctica
4. **Visualización de reportes**: Acceso y visualización de reportes anteriores

### Módulo de Pensamiento Crítico (ID: 270)
1. **Navegación al módulo**: Desde el dashboard a la página principal de pensamiento crítico
2. **Opciones disponibles**: Verificación de opciones de debate y reportes
3. **Debate con IA**: Flujo completo de iniciar y participar en un debate
4. **Visualización de reportes**: Acceso y revisión de reportes de debates anteriores

## Mejores Prácticas Implementadas

### 1. Data Attributes para Testing

Se han agregado atributos `data-testid` a componentes clave para facilitar la selección en pruebas:

```jsx
<div data-testid="box-select-debate-con-ia">
  {/* Contenido del componente */}
}
```

### 2. Comandos Personalizados

Se han creado comandos personalizados para operaciones comunes:

```javascript
// Ejemplo de comando personalizado
Cypress.Commands.add('iniciarDebate', (tema = 'politica') => {
  cy.navegarAPensamientoCritico();
  cy.contains('Debate con IA').click();
  cy.url().should('include', '/activity/pensamientocritico/debateia');
  cy.get('[data-testid="select-topic"]').select(tema);
  cy.get('[data-testid="debate-button"]').click();
});
```

### 3. Manejo de Auth0

Para simular la autenticación sin depender del proveedor externo:

```javascript
// Simulación de autenticación
cy.window().then((win) => {
  win.localStorage.setItem('isAuthenticated', 'true');
  win.localStorage.setItem('user', JSON.stringify({
    email: 'usuario.prueba@example.com',
    name: 'Usuario Prueba'
  }));
  cy.reload();
});
```

### 4. Interceptación de API

Para simular respuestas de API y evitar llamadas reales:

```javascript
// Interceptar llamadas a API
cy.intercept('GET', '**/api/reports*', { fixture: 'reports.json' }).as('getReports');
```

## Cómo Ejecutar las Pruebas

```bash
# Modo interactivo (para desarrollo)
npm run cypress:open

# Modo headless (para CI/CD)
npm run cypress:run

# Con el servidor en ejecución
npm run test:e2e
```

## Patrones de Prueba Recomendados

### Patrón AAA (Arrange-Act-Assert)

```javascript
it('Debe iniciar un debate', () => {
  // Arrange (Preparar)
  cy.login();
  cy.visit('/activity/pensamientocritico');
  
  // Act (Actuar)
  cy.contains('Debate con IA').click();
  cy.get('[data-testid="select-topic"]').select('politica');
  cy.get('[data-testid="debate-button"]').click();
  
  // Assert (Afirmar)
  cy.url().should('include', '/activity/pensamientocritico/debateia/politica');
  cy.contains('Debate sobre política').should('be.visible');
});
```

### Pruebas de Accesibilidad

```javascript
it('Los elementos interactivos deben ser accesibles', () => {
  cy.visit('/activity/oratoria');
  cy.get('[data-testid="button-practicar"]')
    .should('have.attr', 'aria-label')
    .and('not.be.empty');
});
```

## Cómo Agregar Nuevas Pruebas

1. **Identificar el flujo de usuario**: Determinar qué flujo de usuario se va a probar
2. **Crear archivo de prueba**: Agregar un nuevo archivo `.cy.js` en la carpeta adecuada
3. **Implementar pruebas**: Usar los comandos personalizados y patrones recomendados
4. **Ejecutar y verificar**: Probar los nuevos tests y verificar que pasan correctamente

## Integración con CI/CD

Las pruebas E2E están configuradas para ejecutarse automáticamente en el pipeline de CI/CD usando GitHub Actions. El workflow ejecuta:

1. **Pruebas unitarias**: Con Jest
2. **Pruebas E2E**: Con Cypress en modo headless
3. **Pruebas E2E en múltiples navegadores**: Chrome, Firefox y Edge

## Solución de Problemas Comunes

### Problemas de Autenticación

Si las pruebas fallan en la autenticación, verificar:
- La simulación correcta del localStorage
- La interceptación adecuada de las llamadas a Auth0
- Los selectores para elementos de autenticación

### Elementos No Encontrados

Si Cypress no encuentra elementos:
- Verificar que el elemento tenga un `data-testid` apropiado
- Asegurarse de que el elemento esté visible cuando se intenta interactuar
- Usar `cy.wait()` para esperar a que los elementos se carguen

### Pruebas Lentas

Para optimizar el tiempo de ejecución:
- Usar `cy.intercept()` para simular respuestas de API
- Agrupar pruebas relacionadas para evitar inicios de sesión repetidos
- Considerar usar `cy.session()` para preservar el estado entre pruebas

## Recursos Adicionales

- [Documentación oficial de Cypress](https://docs.cypress.io/)
- [Mejores prácticas de Cypress](https://docs.cypress.io/guides/references/best-practices)
- [Ejemplos de patrones de testing E2E](https://docs.cypress.io/examples/examples/recipes) 