import { TEAM } from "./constant";

export const trasnformTableData = (data) => {
  const tr1 = TEAM;
  const tr2 = TEAM.map((t) => {
    return data?.find((d) => d?.teamName === t)?.captainName;
  });

  const largestTeam = data.reduce((acc, dataVal) => {
    if (dataVal.teamMembers.length > acc.teamMembers.length) acc = dataVal;
    return acc;
  }, data[0]);

  const otherTrs = largestTeam?.teamMembers?.map((t, index) => {
    return TEAM.map((team) => {
      const otherTeamMembers = data.find(
        (d) => d.teamName === team
      ).teamMembers;
      return otherTeamMembers[index]?.name;
    });
  });

  return [tr1, tr2, ...(otherTrs ?? [])];
};
