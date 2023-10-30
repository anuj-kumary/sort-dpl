import { useEffect, useRef, useState } from "react";
import { CAPTAINS_LIST, EMPLOYEE, TEAM } from "./constant";
import "./style.css";
import { trasnformTableData } from "./TableUtil";
import ThemeGif from "./assets/gif.mp4";

export default function App() {
  const getTeamInfoFromLocalStorage = localStorage.getItem("teamInfo");
  const parsedGetTeamInfoFromLocalStorage = JSON.parse(
    getTeamInfoFromLocalStorage
  );
  const [assignedCaptains, setAssignedCaptains] = useState(
    parsedGetTeamInfoFromLocalStorage || []
  );
  const [currentTeamIndex] = useState(0);
  const [currentCaptainIndex, setCurrentCaptainIndex] = useState(0);
  const [removedEmployees, setRemovedEmployees] = useState([]);
  const [remainingEmployee, setRemainingEmployee] = useState(EMPLOYEE);
  const typewriterRef = useRef(null);
  const [
    remoteEmployeeListToAllotRandomly,
    setRemoteEmployeeListToAllotRandomly,
  ] = useState([]);

  useEffect(() => {
    localStorage.setItem("teamInfo", JSON.stringify(assignedCaptains));
  }, [assignedCaptains]);

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
    if (remainingEmployee.length === 0) {
      alert("No remaining employees to assign.");
      return;
    }

    if (remoteEmployeeListToAllotRandomly.length < 1) {
      const employeeToAdd = handleGenerateRandomEmployee(remainingEmployee);
      const teamWithMinTeamMembers = Math.min(
        ...assignedCaptains.map(({ teamMembers }) => teamMembers.length)
      );
      const indexOfTeamWithLowestMembers = assignedCaptains.findIndex(
        ({ teamMembers }) => teamMembers.length === teamWithMinTeamMembers
      );
      setCurrentCaptainIndex(indexOfTeamWithLowestMembers);
      setAssignedCaptains((prev) =>
        prev.map((teamInfo, i) => {
          if (i === indexOfTeamWithLowestMembers) {
            return {
              ...teamInfo,
              remoteCount: teamInfo.remoteCount + 1,
              teamMembers: [...teamInfo.teamMembers, employeeToAdd],
            };
          } else {
            return teamInfo;
          }
        })
      );

      setRemainingEmployee((prev) => {
        return prev.filter((single) => single.name !== employeeToAdd.name);
      });

      return;
    }

    const remoteEmployee = handleGenerateRandomEmployee(
      remoteEmployeeListToAllotRandomly
    );

    const lowestRemoteCount = Math.min(
      ...assignedCaptains.map(({ remoteCount }) => remoteCount)
    );

    const indexOfTeamWithLowestRemoteCount = assignedCaptains.findIndex(
      ({ remoteCount }) => remoteCount === lowestRemoteCount
    );

    setCurrentCaptainIndex(indexOfTeamWithLowestRemoteCount);
    setRemoteEmployeeListToAllotRandomly((prev) =>
      prev.filter((single) => single.name !== remoteEmployee.name)
    );

    setAssignedCaptains((prev) =>
      prev.map((teamInfo, i) => {
        if (i === indexOfTeamWithLowestRemoteCount) {
          return {
            ...teamInfo,
            remoteCount: teamInfo.remoteCount + 1,
            teamMembers: [...teamInfo.teamMembers, remoteEmployee],
          };
        } else {
          return teamInfo;
        }
      })
    );

    setRemainingEmployee((prev) => {
      return prev.filter((single) => single.name !== remoteEmployee.name);
    });
  };

  const [teams, captains, viceCaptains, ...rest] =
    trasnformTableData(assignedCaptains);

  return (
    <>
      <h2>Deuex Premier League</h2>
      <div className="App">
        <div style={{ width: "80%" }}>
          {!hasFourCaptains && (
            <button
              className="button"
              onClick={assignTeamAndgenerateRandoCaptain}
            >
              Choose Captain
            </button>
          )}

          {hasFourCaptains && (
            <div>
              <button className="button" onClick={assignRandomlyEmployee}>
                Choose player
              </button>
            </div>
          )}

          <table className="tr-body">
            <col className="hydron" />
            <col className="magnum" />
            <col className="hellfire" />
            <col className="zephyr" />
            <thead>
              <tr>
                {teams?.map((team) => {
                  return <th key={team}>{team}</th>;
                })}
              </tr>
              <tr>
                {captains?.map((captain) => {
                  return (
                    <th key={captain}>
                      <div ref={typewriterRef} className="typewriter">
                        <h6>
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
                      <div ref={typewriterRef} className="typewriter">
                        <h6>
                          {" "}
                          {vc} {vc && "(VC)"}
                        </h6>
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
                        <div ref={typewriterRef} className="typewriter">
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
        <div>
          {remainingEmployee &&
            remainingEmployee.map((employee) => {
              return (
                <p
                  onClick={() => assignEmployeeToCaptain(employee)}
                  className="teamName"
                >
                  {employee.name}
                </p>
              );
            })}
        </div>
      </div>
    </>
  );
}
