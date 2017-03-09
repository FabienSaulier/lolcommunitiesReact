
import { ListGroup, Alert, Table, Media} from 'react-bootstrap';
import { Table as TableSemantic, Icon , List} from 'semantic-ui-react'

export const championStatsDataFormatter = (summoner, row) => {
  const championStats = row.championStats;
  if(!championStats || !championStats.totalSessionsPlayed)
    return(<span></span>);
  const K = Math.round(championStats.totalChampionKills*10/championStats.totalSessionsPlayed) / 10;
  const D = Math.round(championStats.totalDeathsPerSession*10/championStats.totalSessionsPlayed) / 10;
  const A = Math.round(championStats.totalAssists*10/championStats.totalSessionsPlayed) / 10;
  const KDA = K+" / "+D+" / "+A;
  const winrate = Math.round((championStats.totalSessionsWon/championStats.totalSessionsPlayed)*100);
  return(
    (championStats && championStats.totalSessionsPlayed)? //'fontWeight':'bold',
      <div >
        <List style={{ 'display': 'table', 'margin': '0 auto'}}>
          <List.Item  style={{ 'marginLeft': '10px', 'color': this.getKdaColor(K,D,A)}} >{KDA}</List.Item>
          <List.Item><span style={{ 'color':this.getWinrateColor(winrate), 'fontWeight':getWinrateBoldness(winrate) }}>{winrate}%</span> &nbsp;&nbsp; <small>{championStats.totalSessionsPlayed} games</small></List.Item>
        </List>
      </div>
    :
      <span></span>
  );
}

getKdaColor = (K,D,A) => {
  if(D == 0) return 'black';
  const kda=(K+A)/D
  if(kda < 3)
    return 'black';
  else if(kda < 3.5)
    return "#f9a825"; // yellow darken-3
  else if(kda < 4)
    return '#ef6c00';// orange darken-3
  else
    return '#d84315';// deep-orange darken-3
}

getWinrateColor = (winrate) => {
  if(winrate < 55)
    return 'black';
  else if(winrate < 60)
    return "#f9a825"; // yellow darken-3
  else if(winrate < 65)
    return '#ef6c00';// orange darken-3
  else
    return '#d84315';// deep-orange darken-3
}
