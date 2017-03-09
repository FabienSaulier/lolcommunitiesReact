import { ListGroup, Alert, Table, Media} from 'react-bootstrap';
import {MasteryIconImage} from './mastery-icon';

export const masteryDataFormatter = (championStats, row ) => {
  return( //style={{'marginLeft': 'auto', 'marginRight': 'auto', 'width': '150px'}}
    championStats ?
      <Media style={{ 'display': 'table', 'margin': '0 auto'}}>
        <Media.Left align="middle" style={{'paddingRight':0}}>
          <MasteryIconImage mastery={championStats.championLevel} />
        </Media.Left>
        <Media.Right  align="middle" style={{'paddingLeft':'5px'}}>
          {championStats.championPoints} pts
        </Media.Right>
      </Media>
    :
      <span style={{ 'display': 'table', 'margin': '0 auto'}}>N/A</span>
  );
}
