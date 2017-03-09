
import { ListGroup, Alert, Table, Media} from 'react-bootstrap';
import {TierIconImage} from './tier-icon';

export const rankedTierDataFormatter = (league, row) => {
  if(!league)
    league = {'tier': 'unranked'};
  const winrate = Math.round((league.wins/(league.wins+league.losses))*100);
  return(
      <Media style={{'marginLeft': 'auto', 'marginRight': 'auto', 'width': '150px'}}>
        <Media.Left align="middle" style={{'paddingRight':0}}>
          <TierIconImage tier={league.tier} />
        </Media.Left>
        <Media.Right  align="middle" style={{'paddingLeft':'5px'}}>
          { league.leaguePoints >= 0 ? // case of unranked
            <span>{league.tier.capitalizeFirstLetter()} {league.division}  {league.leaguePoints} LP
              <br /><span  style={{ 'color':getWinrateColor(winrate), 'fontWeight':getWinrateBoldness(winrate) }}>{winrate}%</span><small>&nbsp;&nbsp;{league.wins+league.losses} games</small>
            </span>
          : // unranked
            <span>{league.tier.capitalizeFirstLetter()}</span>
          }
        </Media.Right>
      </Media>
  );
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

getWinrateBoldness = (winrate) => {
  if(winrate < 55)
    return 'normal';
  else if(winrate < 60)
    return "bold"; // yellow darken-3
  else if(winrate < 65)
    return 'bold';// orange darken-3
  else
    return 'bold';// deep-orange darken-3
}
