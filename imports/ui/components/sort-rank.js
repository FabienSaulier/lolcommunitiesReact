import { calculateElo } from '../../modules/calcul-elo'

export const sortByRank3v3 = (summonerA, summonerB, order) => {
  return calculatePositionAB(summonerA.league3v3, summonerB.league3v3, order);
}

export const sortByRank5v5 = (summonerA, summonerB, order) => {
  return calculatePositionAB(summonerA.league5v5, summonerB.league5v5, order);
}

export const sortByRankFlex5v5 = (summonerA, summonerB, order) => {
  return calculatePositionAB(summonerA.league5v5flex, summonerB.league5v5flex, order);
}

export const sortByMastery = (summonerA, summonerB, order) => {
  return calculatePositionByMasteryAB(summonerA, summonerB, order);
}

const calculatePositionAB = (aLeague, bLeague, order)=> {
  let aPoints = calculateElo(aLeague);
  let bPoints = calculateElo(bLeague);
  if(order === 'desc'){
    if(aPoints > bPoints){
      return 1;
    }
    else if (aPoints === bPoints)
      return 0;
    else
      return -1;
  } else{
    if(aPoints > bPoints){
      return -1;
    }
    else if (aPoints === bPoints)
      return 0;
    else
      return 1;
  }
}

const calculatePositionByMasteryAB = (summonerA, summonerB, order) =>{
  let aPoints = calculateMasteryScore(summonerA.championStats);
  let bPoints = calculateMasteryScore(summonerB.championStats);
  if(order === 'desc'){
    if(aPoints > bPoints){
      return 1;
    }
    else if (aPoints === bPoints)
      return 0;
    else
      return -1;
  } else{
    if(aPoints > bPoints){
      return -1;
    }
    else if (aPoints === bPoints)
      return 0;
    else
      return 1;
  }
}

calculateMasteryScore = (championStats) =>{
  if(!championStats)
    return 0;

  let points;
  switch (championStats.championLevel) {
    case 1:
      points = 0;
      break;
    case 2:
      points = 10000000;
      break;
    case 3:
      points = 20000000;
      break;
    case 4:
      points = 30000000;
      break;
    case 5:
      points = 40000000;
      break;
    case 6:
      points = 50000000;
      break;
    case 7:
      points = 60000000;
      break;
    default:
      points = 0;
  };
  console.log(points);
  points += championStats.championPoints;
  console.log(championStats);
  console.log(points);

  return points;
};
