import { useState, useEffect } from "react";

export default function App() {
  //Tiempo inicial de 25min, 
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div>
    <h1>Pomodoro Timer</h1>
    <p>{timeLeft}</p>
    </div>
  );
}

