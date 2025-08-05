import React, { useState, useEffect } from "react";
import "./Cake.css";
import BirthdayMessage from "./BirthdayMessage"; // Make sure this exists

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

// Keyframes for balloons and message
const extraKeyframes = `
@keyframes balloonUp {
  0% { transform: translateY(0); opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateY(-110vh); opacity: 0; }
}
@keyframes bounceGlow {
  0% { transform: scale(1) translateY(0); text-shadow: 0 2px 8px #fff, 0 0 10px #ff69b4; }
  50% { transform: scale(1.08) translateY(-18px); text-shadow: 0 4px 24px #fff, 0 0 24px #ff69b4; }
  100% { transform: scale(1) translateY(0); text-shadow: 0 2px 8px #fff, 0 0 10px #ff69b4; }
}
@keyframes colorShift {
  0% { color: #ff69b4; }
  25% { color: #ffd700; }
  50% { color: #87ceeb; }
  75% { color: #adff2f; }
  100% { color: #ff69b4; }
}
@keyframes handWave {
  0% { transform: rotate(-10deg);}
  50% { transform: rotate(18deg);}
  100% { transform: rotate(-10deg);}
}
@keyframes flicker {
  0% { transform: scaleY(1) scaleX(1); opacity: 1; }
  50% { transform: scaleY(1.2) scaleX(0.9); opacity: 0.85; }
  100% { transform: scaleY(0.9) scaleX(1.1); opacity: 1; }
}
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("cake-extra-keyframes")
) {
  const styleTag = document.createElement("style");
  styleTag.id = "cake-extra-keyframes";
  styleTag.innerHTML = extraKeyframes;
  document.head.appendChild(styleTag);
}

const fullScreenStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(255,240,245,0.96)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  cursor: "pointer",
  overflow: "hidden",
};

const NUM_BALLOONS = 14;

const Cake = ({ onBlowCandles }) => {
  const [active, setActive] = useState(false);
  const [balloonData, setBalloonData] = useState(() =>
    Array.from({ length: NUM_BALLOONS }).map((_, i) => ({
      color: balloonColors[i % balloonColors.length],
      left: 5 + Math.random() * 90,
      delay: (6 * i) / NUM_BALLOONS,
      duration: 5 + Math.random() * 2,
      key: Math.random().toString(36).substr(2, 9),
    }))
  );

  // Continuously float balloons by resetting them after animation ends
  useEffect(() => {
    let running = true;
    function resetBalloon(i) {
      setBalloonData((prev) => {
        const next = [...prev];
        next[i] = {
          color:
            balloonColors[Math.floor(Math.random() * balloonColors.length)],
          left: 5 + Math.random() * 90,
          delay: 0,
          duration: 5 + Math.random() * 2,
          key: Math.random().toString(36).substr(2, 9),
        };
        return next;
      });
    }

    const timers = balloonData.map((b, i) => {
      const totalTime = (b.delay + b.duration) * 1000;
      return setTimeout(function loop() {
        if (!running) return;
        resetBalloon(i);
        timers[i] = setTimeout(loop, balloonData[i].duration * 1000);
      }, totalTime);
    });

    return () => {
      running = false;
      timers.forEach((t) => clearTimeout(t));
    };
    // eslint-disable-next-line
  }, [balloonData.length]);

  // Microphone blowing detection
  useEffect(() => {
    if (active) return; // Don't listen if already blown

    let audioContext;
    let analyser;
    let dataArray;
    let source;
    let rafId;

    async function startMic() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 2048;
        dataArray = new Uint8Array(analyser.fftSize);
        let blowCount = 0;
        const blowThreshold = 0.03; // more sensitive
        const blowFrames = 3; // number of frames that must exceed threshold

        function detectBlow() {
          analyser.getByteTimeDomainData(dataArray);

          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            let val = (dataArray[i] - 128) / 128;
            sum += val * val;
          }
          const rms = Math.sqrt(sum / dataArray.length);

          if (rms > blowThreshold) {
            blowCount++;
            if (blowCount >= blowFrames) {
              handleAction();
              return; // stop after trigger
            }
          } else {
            blowCount = 0; // reset if not sustained
          }

          if (!active) {
            rafId = requestAnimationFrame(detectBlow);
          }
        }
        rafId = requestAnimationFrame(detectBlow);
      } catch (err) {
        // Mic access denied or not available
      }
    }

    startMic();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (audioContext) audioContext.close();
    };
    // eslint-disable-next-line
  }, [active]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAction();
    }
  };

  const handleClick = () => {
    handleAction();
  };

  function handleAction() {
    if (active) return;
    setActive(true);
    loadConfetti(startConfettiFor5Minutes);
    if (onBlowCandles) onBlowCandles();
  }

  if (active) {
    return <BirthdayMessage />;
  }

  return (
    <div
      style={fullScreenStyle}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={handleKeyPress}
    >
      <div style={balloonContainerStyle}>
        {balloonData.map((b, i) => (
          <div
            key={b.key}
            style={balloonStyle(b.color, b.left, b.delay, b.duration)}
          >
            <div style={balloonStringStyle}></div>
          </div>
        ))}
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: "1.6rem",
          fontWeight: 600,
          color: "#ff69b4",
          marginBottom: 24,
          letterSpacing: "0.5px",
        }}
      >
        🎩 Wanna see the magic?🎩 <br /> <br /> 🕯️Blow out the candles!🕯️
      </div>
      <div style={{ marginTop: 32, marginBottom: 16, textAlign: "center" }}>
        {/* Creamy birthday cake with animated glowing candles */}
        <svg
          className="cake-svg"
          width="400"
          height="340"
          viewBox="0 0 400 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", margin: "0 auto" }}
        >
          {/* Cake shadow */}
          <ellipse
            cx="200"
            cy="320"
            rx="110"
            ry="18"
            fill="#e0b9a0"
            opacity="0.4"
          />
          {/* Cake base */}
          <ellipse
            cx="200"
            cy="260"
            rx="110"
            ry="40"
            fill="#f7d6c4"
            className="cake-glow"
          />
          <rect
            x="90"
            y="120"
            width="220"
            height="140"
            rx="60"
            fill="#ffe5ec"
          />
          {/* Creamy top */}
          <ellipse cx="200" cy="120" rx="110" ry="50" fill="#fff8f0" />
          {/* Cream drips */}
          <path
            d="M90 120 Q110 160 130 120 Q150 80 170 120 Q190 160 210 120 Q230 80 250 120 Q270 160 290 120 Q310 80 330 120"
            stroke="#ffd6e0"
            strokeWidth="8"
            fill="none"
          />
          {/* Creamy waves */}
          <path
            d="M100 140 Q120 170 140 140 Q160 110 180 140 Q200 170 220 140 Q240 110 260 140 Q280 170 300 140"
            stroke="#fff"
            strokeWidth="6"
            fill="none"
            opacity="0.7"
          />
          {/* Candles */}
          <rect x="140" y="65" width="12" height="55" rx="6" fill="#87ceeb" />
          <rect x="194" y="55" width="12" height="65" rx="6" fill="#ffd700" />
          <rect x="248" y="65" width="12" height="55" rx="6" fill="#adff2f" />
          {/* Candle flames with glowing animation */}
          <g>
            <ellipse
              cx="146"
              cy="62"
              rx="6"
              ry="12"
              fill="#ffe066"
              className="flame-flicker"
              style={{ filter: "drop-shadow(0 0 18px #ffe066)" }}
            />
            <ellipse
              cx="200"
              cy="52"
              rx="6"
              ry="12"
              fill="#ffe066"
              className="flame-flicker delay1"
              style={{ filter: "drop-shadow(0 0 18px #ffe066)" }}
            />
            <ellipse
              cx="254"
              cy="62"
              rx="6"
              ry="12"
              fill="#ffe066"
              className="flame-flicker delay2"
              style={{ filter: "drop-shadow(0 0 18px #ffe066)" }}
            />
          </g>
          {/* Sprinkles */}
          <circle cx="170" cy="150" r="5" fill="#ff69b4" className="twinkle" />
          <circle cx="230" cy="170" r="5" fill="#87ceeb" className="twinkle" />
          <circle cx="200" cy="190" r="5" fill="#ffd700" className="twinkle" />
          <circle cx="260" cy="150" r="5" fill="#adff2f" className="twinkle" />
          <circle cx="140" cy="170" r="5" fill="#ff6347" className="twinkle" />
        </svg>
      </div>
    </div>
  );
};

// Confetti helpers (keep your existing ones)
function loadConfetti(callback) {
  if (window.confetti) {
    callback();
  } else {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    script.async = true;
    script.onload = callback;
    document.body.appendChild(script);
  }
}

function startConfettiFor5Minutes() {
  let end = Date.now() + 5 * 60 * 1000; // 5 minutes from now

  function frame() {
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 150,
        origin: { y: 0.6 },
      });
    }
    if (Date.now() < end) {
      setTimeout(frame, 500); // fire every 0.5s
    }
  }

  frame();
}

export default Cake;
