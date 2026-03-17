import React, { useState, useEffect } from "react";

function Welcome({ profile, loginTime }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const SESSION_LIMIT_MS = 900000; // 15 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format current displayed time
  const formattedTime = currentTime.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "long"
  });

  // Calculate elapsed session time
  const elapsedMs = currentTime - loginTime;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const elapsedH = Math.floor(elapsedSeconds / 3600);
  const elapsedM = Math.floor((elapsedSeconds % 3600) / 60);
  const elapsedS = elapsedSeconds % 60;

  const elapsedFormatted = `${elapsedH}h ${elapsedM}m ${elapsedS}s`;

  // Calculate remaining session time (countdown)
  const remainingMs = SESSION_LIMIT_MS - elapsedMs;
  const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));

  const remH = Math.floor(remainingSeconds / 3600);
  const remM = Math.floor((remainingSeconds % 3600) / 60);
  const remS = remainingSeconds % 60;

  const remainingFormatted = `${remH}h ${remM}m ${remS}s`;

  return (
    <div className="welcome-msg">
      Hello, <strong>{profile.firstName} {profile.lastName}</strong>! <br />
      Time: {formattedTime} <br />
      Session Time (Remaining): {remainingFormatted}
    </div>
  );
}

export default Welcome;