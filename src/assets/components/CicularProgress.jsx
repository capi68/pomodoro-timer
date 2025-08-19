export default function CircularProgress({ timeLeft, totalTime, formatTime }) {
    const radius = 90;
    const strokeWidth = "12";
    const circumference = 2 * Math.PI * radius;
    const progress = (timeLeft / totalTime) * circumference;

    return (
        <svg width="220" height="220" viewBox="0 0 220 220" shapeRendering="geometricprecision">
            {/* Ciculo de fondo */}
            <circle 
                cx="110" 
                cy="110" 
                r={radius} 
                stroke="#444" 
                strokeWidth={strokeWidth} 
                fill="none" 
            />

            {/* circle en progreso*/ }
            <circle 
                cx="100" 
                cy="100" 
                r={radius} 
                stroke="white" 
                strokeWidth={strokeWidth}
                fill="none" 
                strokeDasharray={circumference} 
                strokeDashoffset={circumference - progress} 
                strokeLinecap="round" 
                transform="rotate(-90, 110 100)" //empieza desde arriba  
            />

            {/* Tiempo en el centro */}
            <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="32" fill="white">
                {formatTime(timeLeft)} 
            </text>
        </svg>
    );
}