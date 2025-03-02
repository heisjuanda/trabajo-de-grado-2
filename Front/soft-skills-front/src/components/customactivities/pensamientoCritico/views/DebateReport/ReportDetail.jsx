import React from "react";

import "./ReportDetail.css";

const ReportDetail = ({ report }) => {
  let fullReport;
  try {
    fullReport = JSON.parse(report.full_report);
  } catch (error) {
    console.error("Error al parsear full_report", error);
    fullReport = null;
  }

  const renderItems = (items) => (
    <ul>
      {items.map((item, idx) => {
        if (typeof item === "string") {
          return <li key={idx}>{item}</li>;
        } else if (typeof item === "object" && item !== null) {
          return (
            <li key={idx}>
              <strong>{item.title}</strong>
              {item.details && (
                <ul>
                  {item.details.map((detail, dIdx) => (
                    <li key={dIdx}>{detail}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        }
        return null;
      })}
    </ul>
  );

  const renderChat = () => {
    let parsedChat;
    try {
      parsedChat = JSON.parse(report.chat);
    } catch (error) {
      console.error("Error al parsear el chat", error);
      return <p>Error al cargar el chat</p>;
    }

    if (!parsedChat?.debate_completo) return <p>No hay historial de chat</p>;

    return parsedChat.debate_completo.split("\n").map((msg, index) => {
      const isUser = msg.startsWith("Usuario");
      const roundMatch = msg.match(/\(Ronda (\d+)\)/);
      const round = roundMatch ? `Ronda ${roundMatch[1]}` : "";

      return (
        <div
          key={index}
          style={{
            margin: "8px 0",
            padding: "10px",
            borderRadius: "15px",
            backgroundColor: isUser ? "#e3f2fd" : "#f5f5f5",
            alignSelf: isUser ? "flex-start" : "flex-end",
            maxWidth: "80%",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: "0.8em",
              color: "#666",
              marginBottom: "4px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{isUser ? "👤 Usuario" : "🤖 IA"}</span>
            <span>{round}</span>
          </div>
          <div style={{ color: "#333" }}>
            {msg.split(": ").slice(1).join(": ")}
          </div>
        </div>
      );
    });
  };

  return (
    <div
      className="report-detail"
      style={{ padding: "0px 20px 20px 20px", fontFamily: "Arial, sans-serif" }}
    >
      <details style={{ marginBottom: "20px", padding: "0px 15px 0px 15px" }}>
        <summary
          style={{
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px",
            background: "#f0f0f0",
            borderRadius: "5px",
          }}
        >
          Reporte Completo
        </summary>
        {fullReport && fullReport.sections ? (
          <div
            className="full-report"
            style={{
              background: "#ffffff",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              padding: "15px",
              marginTop: "10px",
              maxHeight: "400px",
              overflowY: "auto",
              fontSize: "14px",
              color: "#333",
              lineHeight: "1.5",
            }}
          >
            {fullReport.sections.map((section, index) => (
              <div
                key={index}
                className="report-section"
                style={{ marginBottom: "20px" }}
              >
                <h4 style={{ marginBottom: "5px" }}>{section.title}</h4>
                {section.items && renderItems(section.items)}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ padding: "10px" }}>No hay detalles del reporte.</p>
        )}
      </details>

      <details style={{ marginBottom: "20px", padding: "0px 15px 0px 15px" }}>
        <summary
          style={{
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px",
            background: "#f0f0f0",
            borderRadius: "5px",
          }}
        >
          Chat
        </summary>
        <div
          className="chat-container"
          style={{
            background: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            padding: "15px",
            marginTop: "10px",
            maxHeight: "400px",
            overflowY: "auto",
            fontSize: "14px",
            color: "#333",
            lineHeight: "1.5",
          }}
        >
          { renderChat()}
        </div>
      </details>
    </div>
  );
};

export default ReportDetail;
