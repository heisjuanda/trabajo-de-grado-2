import { useNavigate } from "react-router-dom";

import "./BoxSelect.css";
import Button from "../Button/Button";

const BoxSelect = ({ icon, title, description, type, link, buttonText }) => {
  const history = useNavigate();

  const linkFunction = () => {
    if (type !== "INTERACTIVO") {
      window.open(link, "_blank");
      return;
    }

    history(link);
  };

  return (
    <div className="box-select">
      <div>
        <img width="20px" height="20px" src={icon} alt="box-icon" />
      </div>
      <div>
        <span>{type}</span>
      </div>
      <div>
        <h2>{title}</h2>
      </div>
      <div>
        <p>{description}</p>
      </div>
      <div>
        <Button
          content={buttonText}
          onclick={linkFunction}
          typeStyle="main"
          loadingState={false}
          disabled={true}
        />
      </div>
    </div>
  );
};

export default BoxSelect;
