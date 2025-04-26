import "./AudioTranscript.css";

const AudioTranscript = ({ transcript, audioClips }) => {
  return (
    <div className="audio-clips-container">
      {transcript && (
        <div className="current-transcript">
          <h3>Transcripción actual:</h3>
          <p>{transcript}</p>
        </div>
      )}

      <div className="recordings-section">
        <h3>Grabación actual:</h3>
        {audioClips.length === 0 ? (
          <p className="no-recordings">No hay grabaciones guardadas.</p>
        ) : (
          audioClips.map((clip, index) => (
            <div key={index} className="clip-card">
              <h4>Grabación {index + 1}</h4>
              {clip.audioUrl && (
                <div className="audio-controls">
                  <audio controls src={clip.audioUrl}></audio>
                  <a
                    href={clip.audioUrl}
                    download={clip.filename}
                    className="download-btn"
                  >
                    Descargar
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AudioTranscript;
