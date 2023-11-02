import { useEffect, useState } from "react";
import { CAPTAINS_LIST, EMPLOYEE, TEAM, TEAM_DETAILS } from "./constant";
import "./style.css";
import { trasnformTableData } from "./TableUtil";
import VideoBackground from "./VideoBackground";

export default function App() {
  const [assignedCaptains, setAssignedCaptains] = useState(
    JSON.parse(localStorage.getItem("teamInfo") ?? "[]") ?? []
  );
  const [currentTeamIndex] = useState(0);
  const [currentTeam, setCurrentTeam] = useState("");
  const [currentCaptainIndex, setCurrentCaptainIndex] = useState(0);
  const [removedEmployees, setRemovedEmployees] = useState([]);
  const [remainingEmployee, setRemainingEmployee] = useState(EMPLOYEE);
  const [showTeamVideo, setShowTeamVideo] = useState(false);
  const [
    remoteEmployeeListToAllotRandomly,
    setRemoteEmployeeListToAllotRandomly,
  ] = useState([]);
  const [teamCounter, setTeamCounter] = useState(
    JSON.parse(localStorage.getItem("teamIndex") ?? 0) ?? 0
  );
  useEffect(() => {
    const filteredArray = remainingEmployee.filter((member) => {
      return !assignedCaptains.some(
        (team) =>
          team.captainName === member.name ||
          team.teamMembers.some((tm) => tm.name === member.name)
      );
    });
    setRemainingEmployee(filteredArray);
  }, []);

  useEffect(() => {
    const filteredArray = remainingEmployee.filter((member) => {
      return !assignedCaptains.some(
        (team) =>
          team.captainName === member.name ||
          team.teamMembers.some((tm) => tm.name === member.name)
      );
    });
    setRemainingEmployee(filteredArray);
  }, []);

  useEffect(() => {
    const getTeamInfoFromLocalStorage = localStorage.getItem("teamInfo");
    const parsedGetTeamInfoFromLocalStorage = JSON.parse(
      getTeamInfoFromLocalStorage
    );
    const getTeamIndexFromLocalStorage = localStorage.getItem("teamIndex");
    const parsedGetTeamIndexFromLocalStorage = JSON.parse(
      getTeamIndexFromLocalStorage
    );
    setAssignedCaptains(parsedGetTeamInfoFromLocalStorage || []);
    setTeamCounter(parsedGetTeamIndexFromLocalStorage || 0);
  }, []);

  useEffect(() => {
    localStorage.setItem("teamInfo", JSON.stringify(assignedCaptains));
    localStorage.setItem("teamIndex", JSON.stringify(teamCounter));
  }, [assignedCaptains, teamCounter]);

  const hasFourCaptains =
    assignedCaptains.length === 4 &&
    assignedCaptains.every((item) => item.captainName);

  const assignTeamAndgenerateRandoCaptain = () => {
    const availableTeams = TEAM.filter(
      (team) => !assignedCaptains.some((assigned) => assigned.teamName === team)
    );

    if (availableTeams.length === 0) {
      alert("All teams are already assigned a captain.");
      return;
    }

    const currentTeam = availableTeams[currentTeamIndex];
    setCurrentTeam(currentTeam);
    setShowTeamVideo(true);

    setTimeout(() => {
      setShowTeamVideo(false);
      const availableCaptains = CAPTAINS_LIST.filter(
        (captain) =>
          !assignedCaptains.some(
            (assigned) => assigned.captainName === captain.name
          )
      );

      const randomCaptain =
        availableCaptains[Math.floor(Math.random() * availableCaptains.length)];

      let isRemote = 0;
      if (randomCaptain.remote) {
        isRemote = 1;
      }

      const result = {
        captainName: randomCaptain.name,
        teamName: currentTeam,
        teamMembers: [],
        remoteCount: isRemote,
      };

      setAssignedCaptains((prevCaptains) => [...prevCaptains, result]);
      filterTeamMemberFromEmployee(randomCaptain);
    }, 2500);
  };

  const filterTeamMemberFromEmployee = (employee) => {
    if (removedEmployees.some((removed) => removed.name === employee.name)) {
      return;
    }
    const newEmployeeList = remainingEmployee.filter(
      (employees) => employees.name !== employee.name
    );
    setRemovedEmployees([...removedEmployees, employee]);
    setRemainingEmployee(newEmployeeList);
    const remoteEmployee = newEmployeeList.filter(
      (employee) => employee.remote
    );
    setRemoteEmployeeListToAllotRandomly(remoteEmployee);
  };

  const assignEmployeeToCaptain = (employee) => {
    if (
      Array.isArray(viceCaptains) &&
      viceCaptains.length >= 4 &&
      viceCaptains.slice(0, 4).every((item) => item !== undefined)
    ) {
      return;
    }
    setCurrentTeam(employee.teamName);
    const updatedAssignedCaptains = assignedCaptains.map((teamInfo, index) => {
      if (index === currentCaptainIndex) {
        currentCaptainIndex === 3 && setCurrentCaptainIndex(0);
        return {
          ...teamInfo,
          teamMembers: [employee],
          remoteCount: employee.remote
            ? teamInfo.remoteCount + 1
            : teamInfo.remoteCount,
        };
      } else {
        return teamInfo;
      }
    });
    setAssignedCaptains(updatedAssignedCaptains);
    filterTeamMemberFromEmployee(employee);
    setCurrentCaptainIndex((prev) => prev + 1);
  };
  const handleGenerateRandomEmployee = (list) => {
    const generateRandoEmployee = list[Math.floor(Math.random() * list.length)];
    return generateRandoEmployee;
  };

  const assignRandomlyEmployee = () => {
    let prefferedRemote = true;
    if (remainingEmployee.length === 0) {
      alert("No remaining employees to assign.");
      return;
    }

    const currentTeam = assignedCaptains[teamCounter];

    if (currentTeam.remoteCount === 2) {
      prefferedRemote = false;
    }

    let employeeToAdd = null;

    if (prefferedRemote) {
      // if remote is empty then get from others and assign
      if (remoteEmployeeListToAllotRandomly.length === 0) {
        // get from all employee list
        employeeToAdd = handleGenerateRandomEmployee(remainingEmployee);
        // currentTeam.teamMembers.push(employeeToAdd);
        setAssignedCaptains((prev) =>
          prev.map((teamInfo, i) => {
            if (i === teamCounter) {
              return {
                ...teamInfo,
                teamMembers: [...teamInfo.teamMembers, employeeToAdd],
              };
            } else {
              return teamInfo;
            }
          })
        );
      } else {
        // get from remote and assign
        employeeToAdd = handleGenerateRandomEmployee(
          remoteEmployeeListToAllotRandomly
        );
        setAssignedCaptains((prev) =>
          prev.map((teamInfo, i) => {
            if (i === teamCounter) {
              return {
                ...teamInfo,
                teamMembers: [...teamInfo.teamMembers, employeeToAdd],
                remoteCount: teamInfo.remoteCount + 1,
              };
            } else {
              return teamInfo;
            }
          })
        );
      }
    } else {
      //get from others and assign
      employeeToAdd = handleGenerateRandomEmployee(remainingEmployee);
      setAssignedCaptains((prev) =>
        prev.map((teamInfo, i) => {
          if (i === teamCounter) {
            return {
              ...teamInfo,
              teamMembers: [...teamInfo.teamMembers, employeeToAdd],
            };
          } else {
            return teamInfo;
          }
        })
      );
    }
    setRemainingEmployee((prev) => {
      return prev.filter((single) => single.name !== employeeToAdd.name);
    });

    setRemoteEmployeeListToAllotRandomly((prev) => {
      return prev.filter((single) => single.name !== employeeToAdd.name);
    });

    setTeamCounter((prev) => {
      prev++;
      if (prev === 4) {
        prev = 0;
      }
      return prev;
    });
    return;
  };

  const getCaptainImage = (name) => {
    const employeeImage = EMPLOYEE.filter((employee) => {
      return employee.name === name;
    });
    return employeeImage[0].image;
  };

  const [teams, captains, viceCaptains, ...rest] =
    trasnformTableData(assignedCaptains);

  return (
    <>
      <div className="overlays"></div>
      <div className="maincontainer">
        <div style={{ padding: "1rem" }}>
          <h2>
            Deuex Premier League <span style={{ color: "#255FD2" }}>2023</span>
          </h2>
          <div className="App">
            <div style={{ width: "80%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <div className="container">
                  {TEAM_DETAILS.map((team) => {
                    return (
                      <div style={{ width: "25%", textAlign: "center" }}>
                        <img
                          width="100px"
                          height="100px"
                          alt={team.team}
                          src={team.src}
                        />
                        <p>{team.team}</p>
                      </div>
                    );
                  })}
                </div>

                <table className="tr-body">
                  <col className="hydron" />
                  <col className="magnum" />
                  <col className="hellfire" />
                  <col className="zephyr" />
                  <thead>
                    <tr>
                      {captains?.map((captain) => {
                        return (
                          <th key={captain}>
                            <div className="typewriter">
                              <h6>
                                <img
                                  style={{
                                    borderRadius: "50px",
                                    marginRight: "1rem",
                                  }}
                                  width={50}
                                  height={50}
                                  src={getCaptainImage(captain)}
                                  alt={captain}
                                />
                                {captain} {captain && "(C)"}
                              </h6>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {viceCaptains?.map((vc) => {
                        return (
                          <td key={vc}>
                            <div className="typewriter">
                              <h6> {vc}</h6>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    {rest?.map((r, index) => (
                      <tr key={index}>
                        {r.map((teamName) => {
                          return (
                            <td key={teamName}>
                              <div className="typewriter">
                                <h6> {teamName}</h6>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="teamnameContainer">
            <div
              className={!hasFourCaptains ? "button-style" : null}
              style={{ display: "flex", alignItems: "center" }}
            >
              <div>
                {!hasFourCaptains && (
                  <button
                    className="button-85"
                    onClick={assignTeamAndgenerateRandoCaptain}
                  >
                    Choose Captain
                  </button>
                )}

                {viceCaptains?.length === 4 &&
                  viceCaptains.every((item) => item !== undefined) && (
                    <div>
                      <button
                        className="button-85"
                        onClick={assignRandomlyEmployee}
                      >
                        Choose random player
                      </button>
                    </div>
                  )}
              </div>
              <div
                style={{
                  width: viceCaptains?.every((item) => item === item) && "auto",
                }}
                className={hasFourCaptains ? "optionaltext" : null}
              >
                {hasFourCaptains && (
                  <p style={{ paddingLeft: "1rem" }}>
                    Click on name to select employee
                  </p>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                alignItems: "end",
              }}
            >
              {remainingEmployee &&
                remainingEmployee.map((employee) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        borderRadius: "50x",
                        alignItems: "center",
                        paddingLeft: "2rem",
                        width: "50%",
                      }}
                    >
                      <img
                        style={{ borderRadius: "50px" }}
                        width={50}
                        height={50}
                        alt={employee.name}
                        src={employee.image}
                      />
                      <p
                        onClick={() => assignEmployeeToCaptain(employee)}
                        className="teamName"
                        style={{ cursor: "pointer" }}
                      >
                        {employee.name}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {showTeamVideo && <VideoBackground currentTeam={currentTeam} />}
      </div>
    </>
  );
}
