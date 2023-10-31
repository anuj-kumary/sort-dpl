import React from "react";
import TeamVideo1 from "./assets/water.mp4";
import TeamVideo2 from "./assets/earth.mp4";
import TeamVideo3 from "./assets/fire.mp4";
import TeamVideo4 from "./assets/air.mp4";
import { TEAM } from "./constant";

const VideoBackground = ({ currentTeam }) => {
  const getImage = () => {
    switch (currentTeam) {
      case TEAM[0]:
        return TeamVideo1;
      case TEAM[1]:
        return TeamVideo2;
      case TEAM[2]:
        return TeamVideo3;
      case TEAM[3]:
        return TeamVideo4;
    }
  };

  return (
    <div className="video-background">
      <div className="content-overlay"></div>
      <video
        style={{ position: "absolute", transform: "translate(20%,15%)" }}
        width="70%"
        autoPlay
      >
        <source src={getImage()} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoBackground;
