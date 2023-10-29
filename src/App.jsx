import { useRef, useState } from "react";
import { CAPTAINS_LIST, EMPLOYEE_LIST, TEAM } from "./constant";
import "./style.css";
import { trasnformTableData } from "./TableUtil";
import { Modals } from "./modal";

export default function App() {
  const [assignedCaptains, setAssignedCaptains] = useState([]);
  const [currentTeamIndex] = useState(0);
  const [currentCaptainIndex, setCurrentCaptainIndex] = useState(0);
  const [remainingEmployee, setRemainingEmployee] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const typewriterRef = useRef(null);
  const [
    remoteEmployeeListToAllotRandomly,
    setRemoteEmployeeListToAllotRandomly,
  ] = useState([]);

  const hasFourCaptains =
    assignedCaptains.length === 4 &&
    assignedCaptains.every((item) => item.captainName);

  const handleModal = () => {
    setOpenModal(!openModal);
  };

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
  };
  function filterTeamMembers() {
    const newEmployeeList = EMPLOYEE_LIST.filter(
      (employee) =>
        !assignedCaptains.some((team) =>
          team.teamMembers.includes(employee.name)
        )
    );
    setRemainingEmployee(newEmployeeList);
    const remoteEmployee = newEmployeeList.filter(
      (employee) => employee.remote
    );
    setRemoteEmployeeListToAllotRandomly(remoteEmployee);
    return newEmployeeList;
  }

  const assignEmployeeToCaptain = (employee) => {
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

  const [teams, captains, viceCaptains, ...rest] =trasnformTableData(assignedCaptains);

  return (
    <div className="App">
      <div>
        <button onClick={handleModal} className="button">
          Reveal Team
        </button>
      </div>
      {openModal && <Modals open={openModal} handleConfirm={handleModal} />}

      <button className="button" onClick={assignTeamAndgenerateRandoCaptain}>
        Click to choose Captain
      </button>
      <div>
        {hasFourCaptains && (
          <>
            <p>Every captain has the right to choose one player</p>
            <div className="checkbox">
              {EMPLOYEE_LIST.map((employee) => {
                return (
                  <div className="checkbox" key={employee.name}>
                    <input
                      type="checkbox"
                      id={employee.name}
                      name={employee.name}
                      value={employee.name}
                      onChange={(e) => {
                        if (e.target.checked) {
                          assignEmployeeToCaptain(employee);
                        }
                      }}
                    />
                    <label htmlFor={employee.name}>{employee.name}</label>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      {hasFourCaptains && (
        <button className="button" onClick={filterTeamMembers}>
          Give me remaining employee name
        </button>
      )}

      {remainingEmployee &&
        remainingEmployee.map((employeeName, index) => (
          <p key={index}>{employeeName.name}</p>
        ))}

      {remainingEmployee && hasFourCaptains && (
        <div>
          <button className="button" onClick={assignRandomlyEmployee}>
            Assign team for remaining employee
          </button>
        </div>
      )}

      {assignedCaptains.length !== 0 && (
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
      )}
    </div>
  );
}
