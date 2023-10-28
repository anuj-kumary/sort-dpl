import { useState } from "react";
import { CAPTAINS_LIST, EMPLOYEE_LIST, TEAM } from "./constant";
import "./style.css";
import { trasnformTableData } from "./TableUtil";

export default function App() {
  const [assignedCaptains, setAssignedCaptains] = useState([]);
  const [currentTeamIndex] = useState(0);
  const [currentCaptainIndex, setCurrentCaptainIndex] = useState(0);
  const [remainingEmployee, setRemainingEmployee] = useState([]);

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

    const result = {
      captainName: randomCaptain.name,
      teamName: currentTeam,
      teamMembers: [],
    };
    setAssignedCaptains((prevCaptains) => [...prevCaptains, result]);
  };

  function filterTeamMembers() {
    const newEmployee = EMPLOYEE_LIST.filter(
      (employee) =>
        !assignedCaptains.some((team) =>
          team.teamMembers.includes(employee.name)
        )
    );
    setRemainingEmployee(newEmployee);
  }

  const assignEmployeeToCaptain = (employeeName) => {
    setAssignedCaptains((assignedCaptains) => {
      return assignedCaptains.map((teamInfo, index) => {
        if (index === currentCaptainIndex) {
          currentCaptainIndex === 3 && setCurrentCaptainIndex(0);
          return { ...teamInfo, teamMembers: [employeeName] };
        } else {
          return teamInfo;
        }
      });
    });

    setCurrentCaptainIndex((prev) => prev + 1);
  };

  const assignRandomlyEmployee = () => {
    if (remainingEmployee.length === 0) {
      alert("No remaining employees to assign.");
      return;
    }

    const generateRandoEmployee =
      remainingEmployee[Math.floor(Math.random() * remainingEmployee.length)];

    setRemainingEmployee((remainingEmployee) => {
      return remainingEmployee.filter(
        (employee) => employee.name !== generateRandoEmployee.name
      );
    });

    setAssignedCaptains((assignedCaptains) => {
      return assignedCaptains.map((teamInfo, index) => {
        if (index === currentCaptainIndex) {
          currentCaptainIndex === 3 && setCurrentCaptainIndex(0);
          return {
            ...teamInfo,
            teamMembers: [...teamInfo.teamMembers, generateRandoEmployee.name],
          };
        } else {
          return teamInfo;
        }
      });
    });

    setCurrentCaptainIndex((prev) => prev + 1);
  };

  const [teams, captains, viceCaptains, ...rest] = trasnformTableData(assignedCaptains)

  console.log([teams, captains, viceCaptains, ...rest])

  return (
    <div className="App">
      <button className="butotn" onClick={assignTeamAndgenerateRandoCaptain}>
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
                          assignEmployeeToCaptain(employee.name);
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
        <button className="butotn" onClick={filterTeamMembers}>
          Give me remaining employee name
        </button>
      )}

      {remainingEmployee &&
        remainingEmployee.map((employeeName, index) => (
          <p key={index}>{employeeName.name}</p>
        ))}

      {remainingEmployee && hasFourCaptains && (
        <div>
          <button className="butotn" onClick={assignRandomlyEmployee}>
            Assign team for remaining employee
          </button>
        </div>
      )}

      {assignedCaptains.length !== 0 && (
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              {teams?.map((team) => {
                return <th key={team}>{team}</th>;
              })}
            </tr>
            <tr>
              {captains?.map((captain, index) => {
                return (
                  <th className="captainName" key={captain}>
                    {captain} { captain &&  '(C)'}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              {viceCaptains?.map((vc) => {
                return <td key={vc}>{vc} (VC)</td>;
              })}
            </tr>
            {rest?.map((r, index) => <tr key={index}>
              {r.map((teamName) => {
                return <td key={teamName}>{teamName}</td>;
              })}
            </tr>)}
          </tbody>
        </table>
      )}
    </div>
  );
}
