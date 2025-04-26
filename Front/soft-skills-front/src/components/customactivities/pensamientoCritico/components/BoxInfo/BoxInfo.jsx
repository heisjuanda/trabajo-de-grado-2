import React, { useEffect, useRef, useState } from "react";

import useWindowWidth from "../../Hooks/useWindow";

import { ALL_IDEAS } from "../../constantes/debateIdeas";

import ideaIcon from "../../assets/idea-topic.png";
import dropdownImage from "../../assets/dropdown.png";

import "./BoxInfo.css";

const BoxInfo = ({ topic, isFullScreen, question, dropdown = false, allIdeas = ALL_IDEAS }) => {
  const [isOpen, setIsOpen] = useState(false);

  const width = useWindowWidth();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const showClosed = !isOpen && dropdown;

  const topicTitle = topic
    ? allIdeas[topic].option
    : "Selecciona un Tema para mostrar su titulo";

  const topicDescription = topic
    ? allIdeas[topic].description
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
                justifyContent:"space-around",
                alignItems:"center"
              }
            : {}
        }
      >
        <img
          width={showClosed ? "41px" : "30px"}
          height={showClosed ? "41px" : ""}
          src={topic ? allIdeas[topic].icon : ideaIcon}
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
        {showClosed && width >= 480 && (
          <p>{isFullScreen && question ? question : topicDescription}</p>
        )}
      </div>
      {(!dropdown || isOpen) && (
        <>
          <h3>
            {isFullScreen ? allIdeas[topic].option : "Descripción del Tema"}
          </h3>
          <p>{isFullScreen && question ? question : topicDescription}</p>
        </>
      )}
    </article>
  );
};

export default BoxInfo;
