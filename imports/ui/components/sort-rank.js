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
