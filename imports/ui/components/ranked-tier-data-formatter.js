
import { ListGroup, Alert, Table, Media} from 'react-bootstrap';
import {TierIconImage} from './tier-icon';

export const rankedTierDataFormatter = (league, row) => {
  if(!league)
    league = {'tier': 'unranked'};
  return(
      <Media style={{'marginLeft': 'auto', 'marginRight': 'auto', 'width': '150px'}}>
        <Media.Left align="middle" style={{'paddingRight':0}}>
          <TierIconImage tier={league.tier} />
        </Media.Left>
        <Media.Right  align="middle" style={{'paddingLeft':'5px'}}>
          { league.leaguePoints >= 0 ? // case of unranked
            <span>{league.tier.capitalizeFirstLetter()} {league.division}  {league.leaguePoints} LP
              <br /><small> {league.wins} W / {league.losses} L</small>
            </span>
          : // unranked
            <span>{league.tier.capitalizeFirstLetter()}</span>
          }
        </Media.Right>
      </Media>
  );
}
