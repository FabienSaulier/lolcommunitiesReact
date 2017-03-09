import { ListGroup, Alert, Table, Media} from 'react-bootstrap';
import {MasteryIconImage} from './mastery-icon';

masteryDataFormatter(championStats, row, props){
  return(
    championStats ?
      <Media style={{'marginLeft': 'auto', 'marginRight': 'auto', 'width': '150px'}}>
        <Media.Left align="middle" style={{'paddingRight':0}}>
          <MasteryIconImage mastery={championStats.championLevel} />
        </Media.Left>
        <Media.Right  align="middle" style={{'paddingLeft':'5px'}}>
          {championStats.championPoints} pts
        </Media.Right>
      </Media>
    :
      <span></span>
  );
}
