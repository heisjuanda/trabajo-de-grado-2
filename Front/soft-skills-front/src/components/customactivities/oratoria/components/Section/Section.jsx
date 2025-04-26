import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import "./Section.css";

const Section = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="section-container">
      <div className="section-header" onClick={toggleDropdown}>
        <h2 className="section-title">{title}</h2>
        <span className={`dropdown-icon ${isOpen ? "open" : ""}`}>
          {isOpen ? "▲" : "▼"}
        </span>
      </div>
      {isOpen && (
        <div className="markdown-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Section;
