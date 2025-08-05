import React, { useState } from "react";
import "./App.css";
import birthdaySong from "./birthday.mp3";
import familyPhoto from "./family.jpg";
import Cake from "./components/Cake";
import Fireworks from "./components/Fireworks";
import BirthdayMessage from "./components/BirthdayMessage";

function App() {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [songPlayed, setSongPlayed] = useState(false);

  const handleBlowCandles = () => {
    setCandlesBlown(true);
    if (!songPlayed) {
      const song = new Audio(birthdaySong);
      song.play();
      setSongPlayed(true);
    }
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${familyPhoto})` }}>
      <div className="overlay">
        {!candlesBlown ? (
          <Cake onBlowCandles={handleBlowCandles} />
        ) : (
          <>
            <Fireworks />
            <BirthdayMessage />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
