import { useState, useEffect, useRef } from "react";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}: ${s < 10 ? "0" : "" }${s}`;
}

export default function App() {
  //Tiempo inicial de 25min, 
  const [timeLeft, setTimeLeft] = useState(0.5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const beepSound = useRef(new Audio("/mixkit-repeating-arcade-beep-1084.wav"));

  useEffect(() => {
      let timer;

      if (isRunning && timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000 );
      } else if (timeLeft === 0 ) {
        beepSound.current.play().catch((err) => {
          console.log("error al reproducir", err);
        });

        if(isBreak) {
          // si estaba en descanso--- pasa a trabajo
          setTimeLeft(25 * 60);
          setIsBreak(false);
        } else {
          // si estaba en trabajo--- pasa a descanso
          setTimeLeft(5 * 60);
          setIsBreak(true);
        }
      }

      return () => clearInterval(timer); // limpia el intervalo cuando pare
    }, [isRunning, timeLeft, isBreak]);

    const resetTimer = () => {
      setIsRunning(false);
      setTimeLeft(25 * 60); // vuelve a 25 minutos
    }

  return (
    <div 
      style={{ 
        backgroundColor: isBreak ? "#4CAF50" : "#F44336", // VERDE PARA BREAK, Y ROJO PARA TRABAJO
        color: "white",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transition: "background-color 0.5s ease"
        }}
      >
    <h1>Pomodoro Timer</h1>
    <h2>{ isBreak ? "Break time" : "Work Time"}</h2>
    <p style={{ fontSize: "3rem" }}>{formatTime(timeLeft)}</p>
    
    <div style={{ marginTop: "20px", display: "flex", gap: "10px"}}>
      <button onClick={() => setIsRunning(true)}>Start</button>
      <button onClick={() => setIsRunning(false)}>Pause</button>
      <button onClick={resetTimer}>RESET</button>
    </div>
    </div>
  );

}

