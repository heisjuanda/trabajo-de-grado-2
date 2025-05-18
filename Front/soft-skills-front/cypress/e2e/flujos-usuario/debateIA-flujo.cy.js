describe("Flujo de usuario en el módulo de oratoria", () => {
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

  it("Debe navegar al dashboard y acceder al módulo de oratoria", () => {
    cy.contains("Mis Cursos de Habilidades Blandas").should("be.visible");
    cy.contains("Pensamiento Crítico").should("be.visible");
    cy.contains("Oratoria").should("be.visible");
    cy.contains('Ver más').should("be.visible");
    cy.contains('Ver más').first().click();

    cy.contains("Acerca de este curso").should("be.visible");
    cy.contains("Contenido del curso").should("be.visible");
    cy.contains("Comenzar curso").should("be.visible");
    cy.contains("Volver al Dashboard").scrollIntoView().should("be.visible");
    cy.contains("Comenzar curso").click();

    cy.contains("Dashboard").should("be.visible");
    cy.contains("Inicio").should("be.visible");
    cy.contains("Debates").should("be.visible");
    cy.contains("Reportes").should("be.visible");
    
    cy.contains("Desarrolla Tus Habilidades De Pensamiento Cŕitico").should(
      "be.visible"
    );
    cy.contains("Herramientas de Aprendizaje Interactivo").should("be.visible");
    cy.contains("Debate IA").should("be.visible");
    cy.contains("Vídeos").should("be.visible");
    cy.contains("Puzzles").should("be.visible");
    cy.contains("Ver Ahora").should("be.visible");
    cy.contains("Jugar Juegos").should("be.visible");
    cy.contains("Empezar Debate").should("be.visible");
    cy.contains("Empezar Debate").click();

    cy.contains("Empezar Nuevo Debate").should("be.visible");
    cy.contains("Tema de debate:").should("be.visible");
    cy.get(".input-select__field").select("Salud");
    cy.contains("Descripción del Tema").should("be.visible");
    cy.contains(
      "Incluye temas como la salud mental, la medicina moderna, pandemias y avances en el bienestar humano."
    ).should("be.visible");
    cy.contains("Generar debate").should("be.visible");
    cy.contains("Generar debate").click();
    cy.contains("Cargando...").should("be.visible");

    cy.intercept("POST", "**/debate-topics/process-round").as("processRound");

    cy.contains("Tema Seleccionado").should("be.visible");
    cy.contains("Enviar Mensaje").should("be.visible");
    cy.get("#user-response").type("Hola, ¿cómo estás?");
    cy.get('button:has(img[alt="Send"])').click();

    cy.wait("@processRound");

    cy.get(".chat-container > .message-box > .message").contains(
      "Hola, ¿cómo estás?"
    );
    cy.get(".chat-container > .message-box .messaged").contains("Usuario");

    cy.get(".chat-container > .message-box .incoming .messaged").contains("IA");

    cy.intercept("GET", `**/debate-topics/reports/${usuario.email}`).as(
      "getReports"
    );

    cy.contains("Reportes").click();

    cy.wait("@getReports");

    cy.contains("Reportes Recientes").should("be.visible");
    cy.contains("Ver Métricas").should("be.visible");
    cy.contains("Ordenar por:").should("be.visible");

    cy.get(".reports-container").should("exist");
    cy.get(".report-user-avatar").should(
      "have.attr",
      "src",
      "https://s.gravatar.com/avatar/d446f05810a26e48ac7585ab53a66e18?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fjd.png"
    );
    cy.get(".report-user-name").should("have.text", "");
    cy.get(".report-rating-value").should("have.text", "2");
    cy.get(".report-date > span").should(
      "contain",
      "sábado, 17 de mayo de 2025"
    );

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
