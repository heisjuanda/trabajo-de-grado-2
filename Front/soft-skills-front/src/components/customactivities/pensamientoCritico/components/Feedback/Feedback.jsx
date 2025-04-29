import { useState } from "react";
import "./Feedback.css";

const Feedback = ({ data }) => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="feedback-container">
      {data.sections.map((section, index) => (
        <div key={index} className="section">
          <div className="section-header" onClick={() => toggleSection(index)}>
          <h2>{section.title}</h2>
            <span className={`dropdown-icon ${openSections[index] ? "open" : ""}`}>
              {openSections[index] ? "▲" : "▼"}
            </span>
          </div>
          {openSections[index] && (
            <ul className="section-content">
            {section.items.map((item, i) => (
              <li key={i}>
                {typeof item === "string" ? (
                  item
                ) : (
                  <>
                    <strong>{item.title}:</strong>
                    <ul>
                      {item.details.map((detail, dIdx) => (
                        <li key={dIdx}>{detail}</li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Feedback;
