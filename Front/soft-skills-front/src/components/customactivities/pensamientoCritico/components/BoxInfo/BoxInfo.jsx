import React, { useState } from "react";
import { ALL_IDEAS } from "../../constantes/debateIdeas";
import ideaIcon from "../../assets/idea-topic.png";
import dropdownImage from "../../assets/dropdown.png";

import "./BoxInfo.css";

const BoxInfo = ({ topic, isFullScreen, question, dropdown = false }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const showClosed = !isOpen && dropdown;

  const topicTitle = topic
    ? ALL_IDEAS[topic].option
    : "Selecciona un Tema para mostrar su titulo";

  const topicDescription = topic
    ? ALL_IDEAS[topic].description
    : "Selecciona un Tema para mostrar la descripción";

  return (
    <article
      className="box-info"
      style={
        isFullScreen
          ? { width: "80vw", maxWidth: "1200px", minWidth: "200px" }
          : {}
      }
    >
      <div
        className="box-info-header"
        style={
          showClosed
            ? {
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignContent: "center",
              }
            : {}
        }
      >
        <img
          width={showClosed ? "41px" : "30px"}
          height={showClosed ? "41px" : ""}
          src={topic ? ALL_IDEAS[topic].icon : ideaIcon}
          alt="Idea icon"
        />
        <div className="drop-down__container">
          <h2>{isFullScreen ? "Tema Seleccionado" : topicTitle}</h2>
          {dropdown && (
            <button
              onClick={dropdown ? toggleDropdown : undefined}
              style={isOpen ? { transform: "rotate(180deg)" } : {}}
            >
              <img
                alt="dropdown"
                src={dropdownImage}
                width="30px"
                height="30px"
              />
            </button>
          )}
        </div>
        {showClosed && (
          <p>{isFullScreen && question ? question : topicDescription}</p>
        )}
      </div>
      {(!dropdown || isOpen) && (
        <>
          <h3>
            {isFullScreen ? ALL_IDEAS[topic].option : "Descripción del Tema"}
          </h3>
          <p>{isFullScreen && question ? question : topicDescription}</p>
        </>
      )}
    </article>
  );
};

export default BoxInfo;
