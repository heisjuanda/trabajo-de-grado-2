import "./Loader.css";

const Loader = ({ isText }) => {
  return (
    <div className={`loader${isText ? "-text" : ""}`}>
      <div className="dots"></div>
      <div className="dots"></div>
      <div className="dots"></div>
    </div>
  );
};

export default Loader;
