import React, { useState } from "react";
import "./BirthdayMessage.css";

// Balloon animation styles
const balloonContainerStyle = {
  position: "fixed",
  left: 0,
  top: 0,
  width: "100vw",
  height: "100vh",
  pointerEvents: "none",
  zIndex: 1000,
};

const balloonStyle = (color, left, delay, duration) => ({
  position: "absolute",
  bottom: "-120px",
  left: `${left}%`,
  width: "48px",
  height: "64px",
  background: color,
  borderRadius: "24px 24px 24px 24px / 32px 32px 40px 40px",
  boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
  animation: `balloonUp ${duration}s linear ${delay}s forwards`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const balloonStringStyle = {
  position: "absolute",
  left: "50%",
  top: "60px",
  width: "2px",
  height: "32px",
  background: "#aaa",
  transform: "translateX(-50%)",
};

const balloonColors = [
  "#ff69b4",
  "#ffd700",
  "#87ceeb",
  "#adff2f",
  "#ff6347",
  "#8a2be2",
  "#00ced1",
];

// Keyframes for balloons
const extraKeyframes = `
@keyframes balloonUp {
  0% { transform: translateY(0); opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateY(-110vh); opacity: 0; }
}
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("balloon-keyframes-message")
) {
  const styleTag = document.createElement("style");
  styleTag.id = "balloon-keyframes-message";
  styleTag.innerHTML = extraKeyframes;
  document.head.appendChild(styleTag);
}

const NUM_BALLOONS = 14;

const BirthdayMessage = () => {
  // Evenly space balloons across the screen and time
  const [balloonData] = useState(() =>
    Array.from({ length: NUM_BALLOONS }).map((_, i) => ({
      color: balloonColors[i % balloonColors.length],
      left: 5 + Math.random() * 90,
      delay: (6 * i) / NUM_BALLOONS,
      duration: 5 + Math.random() * 2,
    }))
  );

  return (
    <div
      className="birthday-message"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "0 32px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <div style={balloonContainerStyle}>
        {balloonData.map((b, i) => (
          <div
            key={i}
            style={balloonStyle(b.color, b.left, b.delay, b.duration)}
          >
            <div style={balloonStringStyle}></div>
          </div>
        ))}
      </div>
      <h1
        className="happy-birthday"
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "rgba(255,255,255,0.85)",
          borderRadius: 18,
          padding: "32px 24px",
          boxShadow: "0 8px 32px rgba(255,105,180,0.08)",
          fontWeight: 700,
          fontSize: "2rem",
          lineHeight: 1,
        }}
      >
        Happy Birthday!🎉
        <br />
        <br />
        We’re so proud of the man you are — kind, strong, and always making us
        laugh (even when you don’t mean to).
        <br /> <br />
        Thanks for being the glue, the clown, and the heart of this family.
        <br /> <br />
        We love you more than words… and maybe even more than cake. 🎂❤️ 🎂
        <br /> <br />
        May all your wishes come true! 🎈
        <br />
        Cheers to you on your special day! 🥳
      </h1>
    </div>
  );
};

export default BirthdayMessage;
