# Pruebas End-to-End (E2E) con Cypress

Este directorio contiene pruebas E2E automatizadas que verifican el funcionamiento de la aplicación desde la perspectiva del usuario final.

## Estructura de Directorios

```
cypress/
├── e2e/                      # Pruebas E2E
│   ├── flujos-usuario/       # Pruebas de flujos de usuario completos
│   │   ├── oratoria-flujo.cy.js
│   │   ├── pensamiento-critico-flujo.cy.js
│   │   └── flujo-completo.cy.js
│   └── ...                   # Otras pruebas específicas
├── fixtures/                 # Datos de prueba
├── support/                  # Utilidades y comandos personalizados
│   ├── commands.js           # Comandos personalizados
│   └── e2e.js                # Configuración global
└── ...
```

## Ejecución de Pruebas

Para ejecutar las pruebas E2E, utiliza los siguientes comandos:

```bash
# Abrir la interfaz gráfica de Cypress (para desarrollo)
npm run cypress:open

# Ejecutar todas las pruebas en modo headless (para CI/CD)
npm run cypress:run

# Ejecutar pruebas mientras la aplicación está en ejecución
npm run test:e2e
```

## Comandos Personalizados

Se han creado varios comandos personalizados para simplificar las pruebas:

- `cy.login()` - Simula inicio de sesión
- `cy.logout()` - Simula cierre de sesión
- `cy.navegarAOratoria()` - Navega al módulo de oratoria
- `cy.navegarAPensamientoCritico()` - Navega al módulo de pensamiento crítico
- `cy.iniciarPracticaOratoria(tema)` - Inicia una práctica de oratoria
- `cy.iniciarDebate(tema)` - Inicia un debate de pensamiento crítico

Ejemplo de uso:

```javascript
it('Debe completar una práctica de oratoria', () => {
  cy.login();
  cy.iniciarPracticaOratoria('Tecnología');
  // ... resto de la prueba
});
```

## Buenas Prácticas para Escribir Pruebas E2E

1. **Enfócate en flujos de usuario reales**:
   - Prueba lo que los usuarios realmente harían, no las minucias de implementación.
   - Prioriza los flujos críticos del negocio.

2. **Usa selectores resilientes**:
   - Prefiere `data-testid` para seleccionar elementos.
   - Evita seleccionar por clases CSS que puedan cambiar.

3. **Mantén las pruebas independientes**:
   - Cada prueba debe funcionar de forma aislada.
   - No dependas del estado de otras pruebas.

4. **Prepara los datos de prueba adecuadamente**:
   - Usa `cy.intercept()` para simular respuestas de API.
   - Utiliza los fixtures para datos estáticos.

5. **Escribe pruebas legibles**:
   - Usa comentarios para explicar el propósito de cada sección.
   - Nombra tus pruebas de forma descriptiva.

6. **Evita pruebas frágiles**:
   - Usa `cy.contains()` para texto que podría cambiar ligeramente.
   - Implementa esperas explícitas con `cy.wait()` para condiciones asincrónicas.

## Mantenimiento de Pruebas

Al agregar nuevas funcionalidades o cambiar las existentes:

1. Actualiza las pruebas existentes si cambia la interfaz de usuario.
2. Agrega nuevas pruebas para nuevas funcionalidades.
3. Ejecuta regularmente todas las pruebas para detectar regresiones.

## Integración con CI/CD

Estas pruebas están configuradas para ejecutarse automáticamente en el pipeline de CI/CD:

1. **Pull Request**: Se ejecutan pruebas en cada PR para verificar cambios.
2. **Merge a Main**: Se ejecutan todas las pruebas antes de implementar.
3. **Despliegue a Producción**: Se ejecutan pruebas de humo post-despliegue.

## Solución de Problemas Comunes

- **Pruebas inconsistentes**: Verifica si hay condiciones de carrera o elementos que cargan dinámicamente.
- **Falsos positivos/negativos**: Asegúrate de que tus aserciones sean precisas y específicas.
- **Pruebas lentas**: Considera si necesitas verificar cada paso o puedes optimizar. 