import { useState, useEffect, useRef } from "react";
import CircularProgress from "./assets/components/CicularProgress";
import showNotification from "./assets/components/showNotification";
import "./App.css";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}: ${s < 10 ? "0" : "" }${s}`;
}

export default function App() {
  // aqui se puede modificar la duracion de los relojes
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [cycles, setCycles] = useState(0);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  
  //Tiempo inicial de 25min, 
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);



  const beepSound = useRef(new Audio("/mixkit-repeating-arcade-beep-1084.wav"));

// pedir permiso de notificaciones
useEffect(() => {
  if ("Notification" in window) {
    Notification.requestPermission().then((perm) => {
      console.log("permiso", perm);
    });
  } 
}, []);

// Ajustar cuando cambie la duración de trabajo o descanso
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(isBreak ? breakDuration * 60 : workDuration * 60);
    }
  }, [workDuration, breakDuration, isBreak, isRunning]);

  // Manejo del timer
  useEffect(() => {
    let timer;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      beepSound.current.play().catch((err) => console.log("error al reproducir", err));

      showNotification(isBreak ? "Tiempo de volver al trabajo!" : "Tomate un merecido descanso");

      if (isBreak) {
        // Se completó un ciclo
        setCycles((prev) => {
          const newCycles = prev + 1;
          if (newCycles % 4 === 0) {
            setTimeLeft(longBreakDuration * 60);
          } else {
            setTimeLeft(workDuration * 60);
          }
          return newCycles;
        });
        setIsBreak(false);
      } else {
        // Pasa a descanso corto
        setTimeLeft(breakDuration * 60);
        setIsBreak(true);
      }
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isBreak, workDuration, breakDuration, longBreakDuration]);

  // Resetear timer
  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setCycles(0);
    setTimeLeft(workDuration * 60); // se reinicia contador con tiempo elegido por usuario
  };

   
  return (
    <div 
      className="app-container"
      style={{ 
        backgroundColor: isBreak ? "#4CAF50" : "#F44336", // VERDE PARA BREAK, Y ROJO PARA TRABAJO
        color: "white",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transition: "background-color 1s ease"
        }}
      >
    <h1>Pomodoro Timer</h1>

    {/* Inputs de configuracion */}

    <div className="configuradores">
      <label className="label-config">
        Tiempo de Trabajo (min)
        <input className="buttons-config" type="number" value={workDuration} onChange={(e) => setWorkDuration(Number(e.target.value))} disabled={isRunning} />
        </label>
      <label className="label-config">
        Tiempo de Descanso (min)
        <input className="buttons-config" type="number" value={breakDuration} onChange={(e) => setBreakDuration(Number(e.target.value))} disabled={isRunning} />
      </label>
    </div>


    <h2>{ isBreak ? "Break time" : "Work Time"}</h2>
    
    <CircularProgress  timeLeft={timeLeft} totalTime={isBreak ? breakDuration * 60 : workDuration * 60} formatTime={formatTime} />

    <text className="timer-sm" x="50%" y="50%" textAnchor="middle" dy=".3em"  fill="white">
                {formatTime(timeLeft)} 
            </text>
    <p>Ciclos completados: {cycles}</p>
    
    <div style={{ marginTop: "20px", display: "flex", gap: "10px"}}>
      <button onClick={() => setIsRunning(true)}>Start</button>
      <button onClick={() => setIsRunning(false)}>Pause</button>
      <button onClick={resetTimer}>RESET</button>
    </div>
    </div>
  );

}

