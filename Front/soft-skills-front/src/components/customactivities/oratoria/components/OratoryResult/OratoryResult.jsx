import React from "react";
import "./OratoryResult.css";

const OratoryResult = ({ result }) => {
  return (
    <div className="oratory-container">
      {result.sections.map((section, index) => (
        <div key={index} className="oratory-section">
          <h2 className="oratory-title">{section.title}</h2>
          <ul className="oratory-list">
            {section.items.map((item, i) => (
              <li key={i} className="oratory-item">
                {typeof item === "string" ? (
                  item
                ) : (
                  <div>
                    <span className="oratory-subtitle">{item.title}</span>
                    <ul className="oratory-sublist">
                      {item.details.map((detail, j) => (
                        <li key={j} className="oratory-subitem">{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default OratoryResult;
