import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { TEAM_DETAILS } from "./constant";
import "./style.css";


export const Modals = ({ open, handleConfirm }) => {
    const [isRunning, setIsRunning] = useState(true);
    useEffect(() => {
      const stopConfetti = setTimeout(() => {
        setIsRunning(false);
      }, 5000); 

      return () => {
        clearTimeout(stopConfetti);
      };
    }, []);
    return (
      <>
        <div className={open ? "confirm show" : "confirm"}>
          <Confetti run={isRunning} width="500px"  />
          <div className="confirm-content">
            {TEAM_DETAILS.map((team) => {
              return (
                <div
                key={team.team}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    <img className="img" src={team.src} alt={team.team} />
                  </div>
                  <div class="container-text">
                    <h5 style={{ margin: 0 }}>{team.team}</h5>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="overlay" onClick={() => handleConfirm(false)} />
      </>
    );
  };