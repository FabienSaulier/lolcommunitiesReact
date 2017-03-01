
// return a number depending of the ranking.
export const calculateElo = (leagueInfo) => {
  if(!leagueInfo)
    return 0;

  let points;
  switch (leagueInfo.tier) {
    case "UNRANKED":
      points = 0;
      break;
    case "BRONZE":
      points = 10000;
      break;
    case "SILVER":
      points = 20000;
      break;
    case "GOLD":
      points = 30000;
      break;
    case "PLATINUM":
      points = 40000;
      break;
    case "DIAMOND":
      points = 50000;
      break;
    case "MASTER":
      points = 60000;
      break;
    case "CHALLENGER":
      points = 70000;
      break;
    default:
      points = 0;
  };
  switch (leagueInfo.division) {
    case "V":
      points += 0;
      break;
    case "IV":
      points += 1000;
      break;
    case "III":
      points += 2000;
      break;
    case "II":
      points += 3000;
      break;
    case "I":
      points += 4000;
      break;
    default:
  };
  if(leagueInfo.leaguePoints)
    points += leagueInfo.leaguePoints;
  return points;
};
