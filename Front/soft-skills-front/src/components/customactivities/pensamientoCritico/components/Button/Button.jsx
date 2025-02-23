import './Button.css'

const Button = ({ content, disabled, typeStyle, onclick, loadingState }) => {
  return (
    <button onClick={onclick} disabled={!disabled || loadingState} className={`button-ia-section-${typeStyle === "main" ? "main" : "secondary"}`}>
      <p>{loadingState ? "Cargando..." : content}</p>
    </button>
  );
};

export default Button;
