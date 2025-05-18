describe("Flujo de usuario en el módulo de pensamiento crítico", () => {
  const usuario = {
    email: "jdma253@gmail.com",
    password: "Fandango#253",
  };

  beforeEach(() => {
    cy.intercept("POST", "**/oauth/token").as("loginRequest");

    cy.window().then((win) => {
      win.localStorage.setItem("isAuthenticated", "true");
      win.localStorage.setItem(
        "user",
        JSON.stringify({
          email: usuario.email,
          name: "Usuario Prueba",
          picture: "https://example.com/avatar.jpg",
        })
      );
    });

    cy.visit("/");
    cy.get(".MuiButtonBase-root").click();
    cy.get("#username").type(usuario.email);
    cy.get("#password").type(usuario.password);
    cy.contains("Continue").click();
  });

  it("Debe navegar al dashboard y acceder al módulo de pensamiento crítico", () => {
    cy.contains("Mis Cursos de Habilidades Blandas").should("be.visible");
    cy.contains("Pensamiento Crítico").should("be.visible");
    cy.contains("Oratoria").should("be.visible");
    cy.get('a[href="/courses/270"]').should("be.visible");
    cy.get('a[href="/courses/270"]').click();

    cy.contains("Acerca de este curso").should("be.visible");
    cy.contains("Contenido del curso").should("be.visible");
    cy.contains("Comenzar curso").should("be.visible");
    cy.contains("Volver al Dashboard").scrollIntoView().should("be.visible");
    cy.contains("Comenzar curso").click();

    cy.contains("Dashboard").should("be.visible");
    cy.contains("Inicio").should("be.visible");
    cy.contains("Discursos").should("be.visible");
    cy.contains("Reportes").should("be.visible");
    
    cy.contains("Desarrolla Tus Habilidades De Oratoria").should(
      "be.visible"
    );
    cy.contains("Herramientas de Aprendizaje Interactivo").should("be.visible");
    cy.contains("Retos de Discurso").should("be.visible");
    cy.contains("Vídeos de Oratoria").should("be.visible");
    cy.contains("Ejercicios de Oratoria").should("be.visible");
    cy.contains("Ver Ahora").should("be.visible");
    cy.contains("Prácticar").should("be.visible");
    cy.contains("Comenzar Reto").should("be.visible");
    cy.contains("Comenzar Reto").click();

    cy.contains("Empezar Nuevo Discurso").should("be.visible");
    cy.contains("Dificultad:").should("be.visible");
    cy.get(".input-select__field").select("Fácil");
    cy.contains("Descripción del Tema").should("be.visible");
    cy.contains(
      "Dirigido a quienes dan sus primeros pasos en oratoria. Se enfoca en estructura básica, claridad y control del nerviosismo."
    ).should("be.visible");
    cy.contains("Empezar discurso").should("be.visible");
    
    cy.intercept("GET", "**/oratory-topics/0").as("getTopic");
    
    cy.contains("Empezar discurso").click();
    cy.contains("Cargando...").should("be.visible");
    
    cy.wait("@getTopic");

    cy.contains("Micrófono no disponible").should("be.visible");
    cy.contains("Activa tu micrófono").should("be.visible");
    cy.get('.mic-permission-btn').click();

    cy.contains("Tema Seleccionado").should("be.visible");
    cy.contains("Discurso").should("be.visible");
    cy.contains("Palabras clave (Tips)").should("be.visible");
    cy.get('.mic-button').should("be.visible");

    cy.intercept("GET", `**/oratory-audio/list?user_email=jdma253%40gmail.com&skip=0&limit=100`).as("getReport");
    
    cy.contains('Reportes').click();
    
    cy.wait("@getReport");

    cy.contains("Historial de Grabaciones de Oratoria").should("be.visible");
    cy.contains("Ver Métricas").should("be.visible");
    cy.contains("Ordenar por:").should("be.visible");

    cy.contains('Grabación del')
      .closest('div.recording-item')
      .should('be.visible')
      .within(() => {
        cy.get('div.recording-details').within(() => {
          cy.contains('p', 'Calificación:')
            .should('be.visible')
            .and('include.text', '1/10');
        });

        cy.get('div.recording-feedback').within(() => {
          cy.contains('summary', 'Ver transcripción')
            .should('be.visible')
            .click();

          cy.get('p.transcript')
            .should('be.visible')
            .should('contain.text', 'Hola, conmigo estamos.');

          cy.get('div.feedback-section')
            .find('details')
            .contains('summary', 'Ver análisis detallado')
            .should('be.visible')
            .click();

          cy.get('div.feedback-content').within(() => {
            cy.contains('h2.section-title', 'Resumen').should('be.visible');
            cy.contains('h2.section-title', 'Sentimiento').should('be.visible');
            cy.contains('h2.section-title', 'Temas clave').should('be.visible');
          });
        });

        cy.get('button.button-ia-section-main')
          .should('be.visible')
          .find('p')
          .should('have.text', 'Escuchar grabación');
      });

    cy.get("#sort-order").select("Calificación (menor a mayor)");

    cy.contains("Ver Métricas").click();
    cy.contains("Métricas de Rendimiento").should("be.visible");
    cy.contains("Promedio").should("be.visible");
    cy.contains("Máximo").should("be.visible");
    cy.contains("Mínimo").should("be.visible");
    cy.contains("Mejora").should("be.visible");

    cy.get(".chart-container").should("be.visible");

    cy.contains("Inicio").click();

    cy.get(".juan-dabot-container").should("be.visible");
    cy.contains(
      "¿Tienes dudas o quieres consejos? Chatea con JuandaBot en Telegram 💬"
    ).should("be.visible");
  });
});
