import microphoneBton from "../../../../../resources/icons/microphoneBtn.png";

import "./MicrophoneBton.css";

function VoiceRecorderButton({ onClick, isRecording }) {

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button
      className={`mic-button ${isRecording ? "recording" : ""}`}
      onClick={handleClick}
    >
      <img src={microphoneBton} alt="microphone" className="mic-icon" />
    </button>
  );
}

export default VoiceRecorderButton;
