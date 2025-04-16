import { useState, useEffect, useRef } from 'react';
import './Main.css'; // Asegúrate de que la ruta sea correcta

// APIs de Navegador
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const MediaRecorder = window.MediaRecorder; // API para grabar media

const OratoryView = () => {
  // Estados existentes
  const [isRecording, setIsRecording] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const timeoutRef = useRef(null);

  // --- Estados y Refs para Grabación de Audio ---
  const [isAudioSupported, setIsAudioSupported] = useState(true); // Soporte para MediaRecorder
  const [permissionGranted, setPermissionGranted] = useState(false); // Permiso de micrófono
  // Guarda objetos { transcript: string, audioUrl: string | null, filename: string }
  const [audioClips, setAudioClips] = useState([]);
  const mediaRecorderRef = useRef(null); // Ref para la instancia de MediaRecorder
  const audioChunksRef = useRef([]); // Ref para guardar los trozos de audio grabados
  const mediaStreamRef = useRef(null); // Ref para el stream de audio del micrófono

  // --- Efecto para inicializar SpeechRecognition ---
  useEffect(() => {
    if (!SpeechRecognition) {
      console.error("SpeechRecognition no es compatible.");
      setIsSupported(false);
      return;
    }
    if (!MediaRecorder || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
       console.error("MediaRecorder o getUserMedia no son compatibles.");
       setIsAudioSupported(false);
       return;
    }

    const initRecognition = () => {
       const recognitionInstance = new SpeechRecognition();
       recognitionInstance.continuous = true;
       recognitionInstance.interimResults = true;
       recognitionInstance.lang = 'es-CO';

       recognitionInstance.onresult = (event) => {
         let interim = '';
         let final = '';
         for (let i = event.resultIndex; i < event.results.length; ++i) {
           if (event.results[i].isFinal) {
             final += event.results[i][0].transcript + ' ';
           } else {
             interim += event.results[i][0].transcript;
           }
         }
         setFinalTranscript(prevFinal => prevFinal + final);
         setInterimTranscript(interim);
       };

        recognitionInstance.onend = () => {
            console.log('Reconocimiento de voz terminado.');
            // La lógica de parada principal se maneja en stopRecording
        };

        recognitionInstance.onerror = (event) => {
            console.error('Error en SpeechRecognition:', event.error);
            // Intentar detener todo si hay un error grave
            stopRecording(true); // Pasa true para indicar que es por error
        };

       setRecognition(recognitionInstance);
       console.log('Instancia de SpeechRecognition lista.');
    }

    initRecognition();

    // --- Función de limpieza ---
    return () => {
      console.log('Limpiando componente OratoryView...');
      // Detener stream y reconocimiento si están activos
      stopMediaStream();
      if (recognition) {
          recognition.stop();
      }
      // Limpia el timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Revocar URLs de objectos para liberar memoria
      audioClips.forEach(clip => {
        if (clip.audioUrl) {
          URL.revokeObjectURL(clip.audioUrl);
        }
      });
    };
  }, []); // Dependencias vacías para ejecutar solo al montar

  // --- Función para solicitar permiso y configurar MediaRecorder ---
  const setupMediaRecorder = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia no soportado");
      setIsAudioSupported(false);
      return null;
    }

    try {
      // Solicitar acceso al micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream; // Guardar el stream
      setPermissionGranted(true);
      console.log("Permiso de micrófono obtenido.");

      // Crear instancia de MediaRecorder
      // Intenta con webm, si no, el default del navegador
       const options = { mimeType: 'audio/webm;codecs=opus' };
       let recorder;
       try {
           recorder = new MediaRecorder(stream, options);
       } catch (err) {
           console.warn("audio/webm no soportado, usando default.", err);
           recorder = new MediaRecorder(stream); // Usa el formato por defecto
       }

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = []; // Limpiar chunks anteriores

      // Evento cuando hay datos de audio disponibles
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          // console.log("Chunk de audio recibido:", event.data.size);
        }
      };

      // Evento cuando la grabación se detiene
      recorder.onstop = () => {
        console.log('MediaRecorder detenido.');
        // Crear un Blob con todos los chunks de audio
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const filename = `grabacion-${new Date().toISOString()}.webm`; // o .wav si es el caso

        // Guardar la URL y la transcripción final (puede tener delay por setState)
        // Usamos una copia de finalTranscript en el momento de parar
        const currentFinalTranscript = finalTranscript + interimTranscript; // Captura lo último

        setAudioClips(prevClips => [
          ...prevClips,
          { transcript: currentFinalTranscript.trim(), audioUrl: audioUrl, filename: filename }
        ]);

        console.log(`Audio Blob creado: ${audioUrl}, Tamaño: ${audioBlob.size}, Tipo: ${audioBlob.type}`);

        // Limpiar chunks para la próxima grabación
        audioChunksRef.current = [];
        // Detener las pistas del stream para liberar el micrófono
        stopMediaStream();
      };

       recorder.onerror = (event) => {
           console.error('Error en MediaRecorder:', event.error);
           stopRecording(true); // Detener todo en caso de error
       };


      return recorder; // Devuelve la instancia configurada

    } catch (err) {
      console.error("Error al obtener permiso o configurar MediaRecorder:", err);
      setPermissionGranted(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          alert("Necesitas dar permiso al micrófono para grabar audio.");
      } else {
          alert(`Error al acceder al micrófono: ${err.message}`);
      }
      return null;
    }
  };

  // --- Función para detener el MediaStream (liberar micrófono) ---
   const stopMediaStream = () => {
       if (mediaStreamRef.current) {
           console.log("Deteniendo pistas del MediaStream.");
           mediaStreamRef.current.getTracks().forEach(track => track.stop());
           mediaStreamRef.current = null; // Limpiar la referencia
       }
   };


  // --- Función unificada para detener la grabación ---
  const stopRecording = (isError = false) => {
      console.log(`Deteniendo grabación... (Error: ${isError})`);
      if (recognition && isRecording) {
          recognition.stop(); // Detiene reconocimiento de voz
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop(); // Detiene grabación de audio (esto dispara onstop)
      }
      // Si no fue un error, onend/onstop limpiarán isRecording. Si fue error, lo forzamos.
      if (isError) {
          setIsRecording(false);
          setInterimTranscript('');
          stopMediaStream(); // Asegurar liberar micro en error
      }
       // Limpiar timeout siempre
      if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
      }
      // setIsRecording se setea a false en los handlers onend/onstop generalmente
      // pero lo forzamos aquí si no estaba grabando o por error
      if (!isRecording || isError){
          setIsRecording(false);
      }
  };


  // --- Función para manejar el botón de grabar ---
  const handleRecord = async () => {
    if (isRecording) return; // Ya está grabando

    if (!recognition) {
        console.warn("SpeechRecognition no inicializado.");
        return;
    }
    if (!isAudioSupported) {
        alert("La grabación de audio no es compatible con este navegador.");
        return;
    }

    // Limpiar estados anteriores
    setFinalTranscript('');
    setInterimTranscript('');
    // Limpiar referencia de chunks por si acaso
    audioChunksRef.current = [];

    // Configurar y obtener MediaRecorder (pide permiso si es necesario)
    const recorder = await setupMediaRecorder();

    // Si setupMediaRecorder falló (permiso denegado o error), no continuar
    if (!recorder) {
      return;
    }

    // Iniciar ambas grabaciones
    try {
        recorder.start(); // Inicia grabación de audio
        recognition.start(); // Inicia reconocimiento de voz
        setIsRecording(true);
        console.log('Grabación de audio y reconocimiento iniciados.');

        // Configurar el timeout para detener todo
        if (timeoutRef.current) clearTimeout(timeoutRef.current); // Limpiar anterior
        timeoutRef.current = setTimeout(() => {
            console.log('Timeout de 30s alcanzado, deteniendo todo.');
            stopRecording(); // Llama a la función unificada de parada
        }, 30000); // 30 segundos

    } catch (error) {
        console.error("Error al iniciar grabación/reconocimiento:", error);
        stopRecording(true); // Detener todo si hay error al iniciar
    }
  };


  // --- Renderizado ---
  const currentDisplayTranscript = finalTranscript + interimTranscript;

  return (
    <div className="main-container">
      {!isSupported || !isAudioSupported ? (
        <p className="browser-error">
          { !isSupported && "El reconocimiento de voz no es compatible. " }
          { !isAudioSupported && "La grabación de audio no es compatible. " }
          Intenta usar Chrome o Edge actualizado.
        </p>
      ) : (
        <>
          <button
            onClick={handleRecord}
            disabled={isRecording} // Solo deshabilita si está grabando
            className={`record-button ${isRecording ? 'recording' : ''}`}
          >
            {isRecording ? 'Grabando... (30s)' : 'Iniciar Grabación'}
          </button>
          {/* Opcional: Botón de detener explícito
           <button onClick={() => stopRecording()} disabled={!isRecording}>
               Detener Grabación
           </button>
          */}

          <div className="transcript-box">
            <h3>Transcripción en vivo:</h3>
            <p>{currentDisplayTranscript || 'El texto aparecerá aquí...'}</p>
          </div>

          <div className="audio-clips">
            <h3>Grabaciones Anteriores:</h3>
            {audioClips.length === 0 && <p>No hay grabaciones guardadas.</p>}
            {audioClips.map((clip, index) => (
              <div key={index} className="clip">
                <h4>Grabación {index + 1}</h4>
                <p><strong>Transcripción:</strong> {clip.transcript || '(Sin transcripción)'}</p>
                {clip.audioUrl && (
                  <>
                    <audio controls src={clip.audioUrl}></audio>
                    <a
                      href={clip.audioUrl}
                      download={clip.filename} // Nombre del archivo para descargar
                      className="download-link"
                      style={{marginLeft: '10px'}} // Estilo simple
                    >
                      Descargar Audio
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OratoryView;