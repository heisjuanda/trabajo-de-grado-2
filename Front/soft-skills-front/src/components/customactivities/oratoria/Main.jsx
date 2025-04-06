import { useState, useEffect, useRef } from 'react';
import './Main.css';

const OratoryView = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioClips, setAudioClips] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let newTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          newTranscript += text + ' ';
        }
        setTranscript(prev => prev + newTranscript);
      };

      recognition.onend = () => {
        if (transcript.trim()) {
          setAudioClips(prev => [...prev, transcript]);
        }
        setTranscript('');
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTranscript('');
      recognitionRef.current.start();
      
      // Stop recording after 30 seconds
      setTimeout(() => {
        recognitionRef.current.stop();
      }, 30000);
    }
  };

  return (
    <div className="main-container">
      {recognitionRef.current ? (
        <>
          <button 
            onClick={handleRecord} 
            disabled={isRecording}
            className={`record-button ${isRecording ? 'recording' : ''}`}
          >
            {isRecording ? 'Recording... (30s)' : 'Start Recording'}
          </button>

          <div className="transcript-box">
            <h3>Live Transcript:</h3>
            <p>{transcript || 'Speech will appear here...'}</p>
          </div>

          <div className="audio-clips">
            <h3>Previous Recordings:</h3>
            {audioClips.map((clip, index) => (
              <div key={index} className="clip">
                <p>{clip}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="browser-error">
          Speech recognition is not supported in your browser. 
          Try using Chrome or Edge.
        </p>
      )}
    </div>
  );
};

export default OratoryView;