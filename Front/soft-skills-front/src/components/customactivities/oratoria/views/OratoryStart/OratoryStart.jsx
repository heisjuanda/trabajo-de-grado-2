import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import MicNotSupported from "../../components/MicNotSupported/MicNotSupported";
import Nav from "../../components/Nav/Nav";
import Button from "../../../pensamientoCritico/components/Button/Button";
import BoxInfo from "../../../pensamientoCritico/components/BoxInfo/BoxInfo";
import Discurse from "../../components/Discurse/Discurse";
import AudioTranscript from "../../components/AudioTranscript/AudioTranscript";
import Timer from "../../components/Timer/Timer";

import { getOratoryTopic, saveOratoryTopic } from "../../helpers/helpers";
import {
  ALL_DIFFICULTIES,
  TIME_OUT_DISCURSE,
  ORATORY_FEEDBACK_STORAGE_KEY,
} from "../../constantes/constants";

import "./OratoryStart.css";
const OratoryStart = () => {
  const { user } = useAuth0();
  const history = useNavigate();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const MediaRecorder = window.MediaRecorder;

  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [oratoryTopic, setOratoryTopic] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [blob, setBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);
  const timeoutRef = useRef(null);

  const [isAudioSupported, setIsAudioSupported] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [audioClips, setAudioClips] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);

  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const [totalTime, setTotalTime] = useState(0);

  const notifyInfo = (message) =>
    toast.info(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifyFailure = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifyWarning = (message) =>
    toast.warning(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
    });

  useEffect(() => {
    const topic = getOratoryTopic();
    if (!topic) {
      history("/activity/oratoria/start");
    }
    setOratoryTopic(topic);
  }, []);

  const compressAudio = async (audioBlob) => {
    if (audioBlob.size < 1000000) {
      return audioBlob;
    }

    try {
      notifyInfo("Comprimiendo audio para optimizar el envío...");
      
      const audioElement = new Audio();
      audioElement.src = URL.createObjectURL(audioBlob);
      
      return new Promise((resolve) => {
        audioElement.onloadedmetadata = async () => {
          const originalDuration = audioElement.duration;
          
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const audioData = await audioBlob.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(audioData);
          
          const offlineContext = new OfflineAudioContext(
            1,
            audioBuffer.sampleRate * originalDuration, 
            22050
          );
          
          const source = offlineContext.createBufferSource();
          source.buffer = audioBuffer;
          
          source.connect(offlineContext.destination);
          source.start(0);
          
          const renderedBuffer = await offlineContext.startRendering();
          
          const compressedBlob = bufferToWave(renderedBuffer, 0, renderedBuffer.length);
          
          notifySuccess(`Audio comprimido: ${(compressedBlob.size / 1024 / 1024).toFixed(2)}MB (reducción: ${((1 - compressedBlob.size / audioBlob.size) * 100).toFixed(0)}%)`);
          
          URL.revokeObjectURL(audioElement.src);
          resolve(compressedBlob);
        };
      });
    } catch (error) {
      console.error("Error al comprimir audio:", error);
      notifyWarning("No se pudo comprimir el audio, usando la versión original.");
      return audioBlob;
    }
  };

  const bufferToWave = (abuffer, offset, length) => {
    const numOfChan = abuffer.numberOfChannels;
    const size = length * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(size);
    const view = new DataView(buffer);
    
    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, size - 8, true);
    writeUTFBytes(view, 8, 'WAVE');
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChan, true);
    view.setUint32(24, abuffer.sampleRate, true);
    view.setUint32(28, abuffer.sampleRate * 2 * numOfChan, true);
    view.setUint16(32, numOfChan * 2, true);
    view.setUint16(34, 16, true);
    writeUTFBytes(view, 36, 'data');
    view.setUint32(40, length * numOfChan * 2, true);
    
    const channel0 = abuffer.getChannelData(0);
    let offset1 = 44;
    for (let i = 0; i < length; i++) {
      let sample = Math.max(-1, Math.min(1, channel0[i]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(offset1, sample, true);
      offset1 += 2;
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
  };

  const writeUTFBytes = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const setupMediaRecorder = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      notifyFailure("getUserMedia no soportado");
      setIsAudioSupported(false);
      return null;
    }

    try {
      setPermissionGranted(true);
      notifySuccess("Permiso de micrófono obtenido.");

      if (!permissionGranted || !isSupported) return;
      
      const constraints = { 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 22050,
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      const options = { 
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 16000
      };
      
      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (err) {
        notifyWarning("audio/webm con bitrate personalizado no soportado, usando configuración alternativa.");
        try {
          recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
        } catch (err2) {
          notifyFailure("audio/webm no soportado, usando formato predeterminado.", err);
          recorder = new MediaRecorder(stream);
        }
      }

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        notifyInfo("MediaRecorder detenido. Procesando audio...");
        
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        
        notifyInfo(`Tamaño original: ${(audioBlob.size / 1024 / 1024).toFixed(2)}MB`);
        
        const compressedBlob = await compressAudio(audioBlob);
        
        const audioUrl = URL.createObjectURL(compressedBlob);
        const filename = `grabacion-${new Date().toISOString()}.webm`;

        const currentFinalTranscript = finalTranscript + interimTranscript;

        setAudioClips((prevClips) => [
          ...prevClips,
          {
            transcript: currentFinalTranscript.trim(),
            audioUrl: audioUrl,
            filename: filename,
          },
        ]);

        audioChunksRef.current = [];
        stopMediaStream();
        setBlob(compressedBlob);
      };

      recorder.onerror = (event) => {
        notifyFailure("Error en MediaRecorder:", event.error);
        stopRecording(true);
      };

      return recorder;
    } catch (err) {
      notifyFailure(
        "Error al obtener permiso o configurar MediaRecorder:",
        err
      );
      setPermissionGranted(false);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        notifyFailure("Necesitas dar permiso al micrófono para grabar audio.");
      } else {
        notifyFailure(`Error al acceder al micrófono: ${err.message}`);
      }
      return null;
    }
  };

  const sendAudioToServer = async (transcript, retryCount = 0) => {
    if (!user.email) {
      notifyFailure("No se pudo obtener el email del usuario");
      return;
    }
    try {
      setIsLoading(true);
      if (retryCount === 0) notifyInfo("Enviando audio al servidor...");
      else notifyInfo(`Reintentando envío... intento ${retryCount + 1}`);

      const formData = new FormData();
      formData.append("transcript", transcript);
      formData.append("audio", blob, "grabacion.webm");
      formData.append("topic", JSON.stringify(oratoryTopic));
      formData.append("time", totalTime);
      formData.append("is_question", isQuestion);
      formData.append("user_email", user.email);
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/oratory-topics/oratory-analysis`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      saveOratoryTopic(response.data.analysis, ORATORY_FEEDBACK_STORAGE_KEY);
      notifySuccess("Audio enviado!, Feedback recibido y reporte guardado!.");
    } catch (error) {
      console.error("Error al enviar el audio al servidor:", error);

      console.log(String(error));
      if (String(error).includes("service_unavailable") && retryCount < 2) {
        notifyFailure(
          `Whisper no disponible. Reintentando en 5 segundos... (Intento ${
            retryCount + 1
          })`
        );

        await new Promise((resolve) => setTimeout(resolve, 5000));
        sendAudioToServer(transcript, retryCount + 1);
      } else {
        notifyFailure("Error final al enviar el audio al servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopMediaStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const stopRecording = (isError = false) => {
    if (recognition && isRecording) {
      recognition.stop();
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (isError) {
      setIsRecording(false);
      setInterimTranscript("");
      stopMediaStream();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!isRecording || isError) {
      setIsRecording(false);
    }
    setIsRecording(false);

    endTimeRef.current = Date.now();
    if (startTimeRef.current) {
      const durationMs = endTimeRef.current - startTimeRef.current;
      setTotalTime(durationMs);
    }

    recognition?.stop();

    setIsFinished(true);
  };

  const handleRecord = async () => {
    if (isRecording) return;

    if (!recognition) {
      notifyWarning("SpeechRecognition no inicializado.");
      return;
    }
    if (!isAudioSupported) {
      notifyWarning(
        "La grabación de audio no es compatible con este navegador."
      );
      return;
    }

    setFinalTranscript("");
    setInterimTranscript("");
    audioChunksRef.current = [];

    startTimeRef.current = Date.now();

    const recorder = await setupMediaRecorder();

    if (!recorder) {
      return;
    }

    try {
      // Configuramos el intervalo para capturar chunks más pequeños
      recorder.start(1000); // Captura chunks cada segundo en lugar de al final
      recognition.start();
      setIsRecording(true);
      notifyInfo("Grabación de audio y reconocimiento iniciados.");

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        stopRecording();
      }, TIME_OUT_DISCURSE[oratoryTopic.difficulty]);
    } catch (error) {
      notifyFailure("Error al iniciar grabación/reconocimiento:", error);
      stopRecording(true);
    }
  };

  const speakText = (text) => {
    if (parseInt(oratoryTopic.difficulty) !== 2) return;
    if (!window.speechSynthesis) {
      notifyFailure("Speech Synthesis no está soportado en este navegador.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-CO";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    const availableVoices = window.speechSynthesis.getVoices();
    const spanishVoice = availableVoices.find((voice) =>
      voice.lang.startsWith("es")
    );

    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    setIsQuestion(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const currentDisplayTranscript = finalTranscript + interimTranscript;
    setTranscript(currentDisplayTranscript);
  }, [finalTranscript, interimTranscript]);

  useEffect(() => {
    if (!isRecording && blob && transcript && !isSending) {
      setIsSending(true);
      sendAudioToServer(transcript);
    }
  }, [transcript, blob, isSending]);

  useEffect(() => {
    if (!SpeechRecognition) {
      notifyFailure("SpeechRecognition no es compatible.");
      setIsSupported(false);
      return;
    }
    if (
      !MediaRecorder ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      notifyFailure("MediaRecorder o getUserMedia no son compatibles.");
      setIsAudioSupported(false);
      return;
    }

    const initRecognition = () => {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "es-CO";

      recognitionInstance.onresult = (event) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + " ";
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setFinalTranscript((prevFinal) => prevFinal + final);
        setInterimTranscript(interim);
      };

      recognitionInstance.onend = () => {
        notifyInfo("Reconocimiento de voz terminado.");
        stopRecording();
      };

      recognitionInstance.onerror = (event) => {
        notifyFailure("Error en SpeechRecognition:", event.error);
        stopRecording(true);
      };

      setRecognition(recognitionInstance);
      notifyInfo("Instancia de SpeechRecognition lista.");
    };

    initRecognition();

    return () => {
      notifyInfo("Limpiando componente OratoryView...");
      stopMediaStream();
      if (recognition) {
        recognition.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      audioClips.forEach((clip) => {
        if (clip.audioUrl) {
          URL.revokeObjectURL(clip.audioUrl);
        }
      });
    };
  }, []);

  if (!permissionGranted || !isSupported) {
    return (
      <section className="orator-ia-section">
        <Nav />
        <MicNotSupported setupMediaRecorder={setupMediaRecorder} />
        <ToastContainer />
      </section>
    );
  }

  return (
    <section className="orator-ia-section">
      <Nav />
      {isRecording && (
        <Timer
          duration={TIME_OUT_DISCURSE[oratoryTopic.difficulty]}
          onComplete={() => {
            notifyInfo("El tiempo se ha acabado automáticamente.");
          }}
        />
      )}
      {oratoryTopic && (
        <BoxInfo
          topic={oratoryTopic.difficulty}
          allIdeas={ALL_DIFFICULTIES}
          dropdown
          isFullScreen
          question={oratoryTopic.tema}
        />
      )}
      {isFinished ? (
        <div className="transcript-container">
          <AudioTranscript transcript={transcript} audioClips={audioClips} />
          <Button
            content="Continuar"
            disabled={!isLoading || transcript.length === 0}
            typeStyle="main"
            onclick={() => {
              history("/activity/oratoria-feedback");
            }}
          />
        </div>
      ) : (
        <Discurse
          topic={oratoryTopic}
          handleRecord={handleRecord}
          stopRecording={stopRecording}
          isRecording={isRecording}
          speakText={speakText}
        />
      )}
      <ToastContainer />
    </section>
  );
};

export default OratoryStart;
