// import { useEffect, useState } from "react";

// export default function Timer() {
//   const [timeLeft, settimeLeft] = useState(10);  

//   const TIMER_DURATION = 10;

//   useEffect(() => {
//     let startTime = localStorage.getItem("lactation-otpTimer");

//     if (!startTime) {
//       startTime = Date.now().toString();
//       localStorage.setItem("lactation-otpTimer", startTime) ;
//     }

//     const start = parseInt(startTime, 10);

//     const interval = setInterval(() => {
//       const now = Date.now();
//       const elapsed = Math.floor((now - start) / 1000);
//       const remaining = TIMER_DURATION - elapsed;

//       if (remaining < 0) {
//         clearInterval(interval);
//         localStorage.removeItem("lactation-otpTimer");
//         settimeLeft(0);
//       } else {
//         settimeLeft(remaining);
//       }
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   const formatTime = () => {
//     const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
//     const s = String(timeLeft % 60).padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   return <>{formatTime()}</>;
// }


import { useEffect, useState } from "react";

interface TimerProps {
  duration?: number;     // Total countdown duration in seconds
  resetKey?: number;     // Triggers restart from parent
}

const TIMER_KEY = "otp-timer-start";

export default function Timer({ duration = 600, resetKey = 0 }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const now = Date.now();
    let startTime = localStorage.getItem(TIMER_KEY);

    if (!startTime || resetKey) {
      // If no previous startTime or resetKey has changed, reset timer
      localStorage.setItem(TIMER_KEY, now.toString());
      startTime = now.toString();
    }

    const start = parseInt(startTime, 10);

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = duration - elapsed;

      if (remaining <= 0) {
        clearInterval(interval);
        localStorage.removeItem(TIMER_KEY); // Clean up
        setTimeLeft(0);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [resetKey, duration]);

  const formatTime = () => {
    const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const s = String(timeLeft % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return <span className="font-semibold">{formatTime()}</span>;
}
