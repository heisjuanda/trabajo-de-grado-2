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
      const message = msg.split(": ").slice(1).join(": ")

      if (!message) return null;
      return (
        <div
          key={index}
          style={{
            backgroundColor: isUser ? "#e3f2fd" : "#f5f5f5",
            alignSelf: isUser ? "flex-start" : "flex-end",
          }}
        >
          <div>
            <span>{isUser ? "👤 Usuario" : "🤖 IA"}</span>
            <span>{round}</span>
          </div>
          <div>
            {message}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="report-detail">
      <details>
        <summary>Reporte Completo</summary>
        {fullReport && fullReport.sections ? (
          <div className="full-report">
            {fullReport.sections.map((section, index) => (
              <div key={index} className="report-section">
                <h4>{section.title}</h4>
                {section.items && renderItems(section.items)}
              </div>
            ))}
          </div>
        ) : (
          <p>No hay detalles del reporte.</p>
        )}
      </details>

      <details>
        <summary>Chat</summary>
        <div className="chat-container">
          {renderChat()}
        </div>
      </details>
    </div>
  );
};

export default ReportDetail;
