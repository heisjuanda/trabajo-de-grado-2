import React, { useRef, useState, useEffect, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./fitness.css";
import ResponsiveAppBar from "../../responsiveappbar/ResponsiveAppBar";
import { drawHand } from "./js/description/utilities.js";
import { fistDescription } from "./js/description/fist.js";
import { palmDescription } from "./js/description/palm.js";
import { semiDescription } from "./js/description/semi.js";
import { colisioneslevel1 } from "./js/data/colisions.js";
import { Sprite } from "./js/clases/Sprite.js";
import { Player } from "./js/clases/Player.js";
import { Enemy } from "./js/clases/Enemy.js";
import { Obstacle } from "./js/clases/Obstacle.js";
import * as fp from "fingerpose";
import { CanvasProvider, useCanvas } from './js/data/CanvasContext.js';
import { ColisionBlock } from "./js/clases/ColisionBlock.js";
import background1 from "./img/backgroundLevel1.png";

const imageTemp  = "https://drive.google.com/thumbnail?id=11q1qDS78hoxTZRJhkNUbNMZuOrMQkYBN"

const parse2D = (array, rowLength) => {
  const rows = [];
  for (let i = 0; i < array.length; i += rowLength) {
    rows.push(array.slice(i, i + rowLength));
  }
  return rows;
};

const createObjectsFrom2D = (array, ctx2) => {
  const objects = [];
  array.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol === 292) {
        objects.push(new ColisionBlock({ 
          position: { x: x * 64, y: y * 64 },
          ctx2: ctx2 
        }));
      }
    });
  });
  return objects;
};
const ImageWithCloseButton = ({ imageSrc }) => {
  const [isImageVisible, setIsImageVisible] = useState(true);

  const handleHideImage = () => {
    setIsImageVisible(false);
  };

  return (
    isImageVisible && (
      <div className="image-container">
        <div className="image-wrapper">
          <img src={imageSrc} alt="Temporary" className="image-style"  />
          <button className="close-button" onClick={handleHideImage}>
            X
          </button>
        </div>
      </div>
    )
  );
};

function Home() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const { canvas2Ref, ctx2 } = useCanvas();
  const animationFrameId = useRef(null);
  const [volar, setVolar] = useState(true);
  const semiERef = useRef(false); 
  const [emoji, setEmoji] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameRestart, setGameRestart] = useState(false);
  const [score, setScore] = useState(0);
  const startTimeRef = useRef(null);

  const toggleGame = () => setGameStarted(prevState => !prevState);
  const restartAnimation = () => {
    setGameRestart(true);
  };
  const palmI = "https://drive.google.com/thumbnail?id=1hNv4pJLbS8axCylO6FZoi-ke_op-n9_-";
  const fistI = "https://drive.google.com/thumbnail?id=1eF3Dm1pBpJCaNl_71EH0GDXZvbnLfQhJ"; 
  const semiI = "https://drive.google.com/thumbnail?id=1NqProhbfwem4orWfDeQQt2ZYxjD0zpXM"; 

  const images = { palm: palmI, fist: fistI, semi: semiI };

  const runHandpose = async () => {
    try {
      const net = await handpose.load();
      console.log("Handpose model loaded.");
      setInterval(() => {
        detect(net);
      }, 10);
    } catch (error) {
      console.error("Failed to load Handpose model:", error);
    }
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      canvas2Ref.current.width = 64 * 19;
      canvas2Ref.current.height = 64 * 9;

      const hand = await net.estimateHands(video);

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          palmDescription,
          fistDescription,
          semiDescription,
        ]);
        const gesture = await GE.estimate(hand[0].landmarks, 8);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          if (gesture.gestures[0].name === 'fist') {
            setVolar(false);
            semiERef.current = false;
          }
          if (gesture.gestures[0].name === 'palm') {
            setVolar(true);
            semiERef.current = false;
          }
          if (gesture.gestures[0].name === 'semi') {
            semiERef.current = true;
          }
          setEmoji(gesture.gestures[0].name);
        }
      }

      const ctx = canvasRef.current.getContext("2d");
      ctx.translate(videoWidth, 0);
      ctx.scale(-1, 1);
       drawHand(hand, ctx);
    }
  };

  const parsedColisions = useRef(parse2D(colisioneslevel1, 16));
  const colisionBlock = useRef([]);
  const backgroundlevel1 = useRef(null);
  const player = useRef(null);
  const enemy = useRef(null);
  const obstacle = useRef(null);

  const setupGameObjects = useCallback(() => {
    if (ctx2 && !colisionBlock.current.length) {
      colisionBlock.current = createObjectsFrom2D(parsedColisions.current, ctx2);
      backgroundlevel1.current = new Sprite({
        position: { x: 0, y: 0 },
        imageSrc: background1,
        ctx2: ctx2
      });
      player.current = new Player({
        colisionBlock: colisionBlock.current,
        ctx2: ctx2
      });
      enemy.current = new Enemy({
        colisionBlock: colisionBlock.current,
        ctx2: ctx2
      });
      obstacle.current = new Obstacle({
        colisionBlock: colisionBlock.current,
        ctx2: ctx2
      });
    }
  }, [ctx2]);

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'a':
        keys.a.pressed = true;
        break;
      case 'd':
        keys.d.pressed = true;
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (event) => {
    switch (event.key) {
      case 'a':
        keys.a.pressed = false;
        break;
      case 'd':
        keys.d.pressed = false;
        break;
      default:
        break;
    }
  };

  const handleVolarChange = useCallback(() => {
    if (player.current) {
      if (volar) {
        player.current.velocity.y = -3;
      }
    }
  }, [volar]);

  const keys = {
    a: {
      pressed: false
    },
    d: {
      pressed: false
    },
  };

  const animate = useCallback(() => {
    if (ctx2) {
      ctx2.clearRect(0, 0, canvas2Ref.current.width, canvas2Ref.current.height);
      backgroundlevel1.current.draw();
      if (gameRestart) {
        player.current.position.x = 250;
        player.current.position.y = 300;
        enemy.current.position.x = 850;
        enemy.current.position.y = 200;
        obstacle.current.position.x = 850;
        obstacle.current.position.y = 200;
        setGameRestart(false);
        setGameStarted(true);
        setScore(0); 
        startTimeRef.current = Date.now(); 
      }
      if (gameStarted) {
        
        player.current.velocity.x = 0;
        if (keys.d.pressed) player.current.velocity.x = 5;
        else if (keys.a.pressed) player.current.velocity.x = -5;
        handleVolarChange();

        player.current.draw();
        player.current.update();
        enemy.current.draw();
        enemy.current.update();
        obstacle.current.draw();
        obstacle.current.update();
        setScore(Math.floor((Date.now() - startTimeRef.current) / 1000)); // Update score

        if (player.current.checkCollisionWithEnemy(enemy.current) || (player.current.checkCollisionWithEnemy(obstacle.current) && semiERef.current === false)) {
          console.log("Player has collided with Enemy or Obstacle!");
          console.log(semiERef.current);
          setGameStarted(false); // Stop the game
        }
      }
      animationFrameId.current = requestAnimationFrame(animate);
    }
  }, [ctx2, canvas2Ref, handleVolarChange, gameStarted, gameRestart]);

  useEffect(() => {
    if (ctx2) {
      setupGameObjects();
      handleVolarChange();
      runHandpose();
      animationFrameId.current = requestAnimationFrame(animate);
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }
  }, [ctx2, animate, handleKeyDown, handleKeyUp, handleVolarChange, setupGameObjects]);

  return (
    
    <div className="Home">
      <ResponsiveAppBar />
      <br />
      <header className="App-header">
      
        <div className="canvas-container">
          <div className="webcam-container"  style={{ position: "relative", width: "50%", float: "right" }}>
            <Webcam
              ref={webcamRef}
              mirrored={true}
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1,
                width: 640,
                height: 500,
                
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 2,
                width: 640,
                height: 500,
              }}
            />
          </div>
          <canvas
            ref={canvas2Ref}
            style={{
              position: "relative",
              width: "60%",
              float: "left",
              zIndex: 4,
              height: '80vh',
             
            }}
          />
        </div>
        {emoji !== null ? (
          <img
            alt={emoji}
            src={images[emoji]}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              zIndex: 3,
              left: "90%",
              bottom: 390,
              transform: "translateX(-50%)",
              textAlign: "center",
              height: 100,
            }}
          />
        ) : (
          ""
        )}
        <button onClick={toggleGame} style={{ position: "absolute", top: 125, left: 140 }}>
          Toggle Play/Stop
        </button>
        <button onClick={restartAnimation} style={{ position: "absolute", top: 125, left: 270 }}>
          Restart Animation
        </button>
        <div style={{ position: "absolute", top: 120, left: 450, color: "black"}}>
          Score: {score} seconds
        </div>
      </header>
      
      <ImageWithCloseButton imageSrc="https://drive.google.com/thumbnail?id=11q1qDS78hoxTZRJhkNUbNMZuOrMQkYBN" />
    </div>
  );
}

const App = () => (
  <CanvasProvider>
    <Home />
  </CanvasProvider>
);

export default App;
