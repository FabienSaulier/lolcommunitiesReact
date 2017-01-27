import React from 'react';
import { ListGroup, Alert, Table, Media} from 'react-bootstrap';
import {TierIconImage} from './tier-icon';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

export class CommunityUsers extends React.Component {

  constructor(props){
    super(props);
    this.summonerNameFormatter = this.summonerNameFormatter.bind(this);
    this.tierDataFormatter = this.tierDataFormatter.bind(this);
    this.tierWinsLossesFormatter = this.tierWinsLossesFormatter.bind(this);
  }

  summonerNameFormatter(sumName, row){
    let url = "http://"+row.server+".op.gg/summoner/userName="+sumName;
    return "<a href="+url+" target='_blank' > "+sumName+"</a>";
  }

  tierDataFormatter(tier, row){
    return(
        <Media>
          <Media.Left align="middle">
            <TierIconImage tier={tier} />
          </Media.Left>
          <Media.Body>
            <span><strong>{tier.toLowerCase()} {row.division}</strong> <br />
            <strong>{row.leaguePoints} LP</strong></span>
          </Media.Body>
        </Media>
    );
  }

  tierWinsLossesFormatter(wins, row){
    return(row.wins +" / "+ row.losses);
  }

  render(){
    return(
      this.props.summoners.length > 0 ?
      <BootstrapTable data={ this.props.summoners } >
        <TableHeaderColumn dataField='userCommunityName' isKey>{this.props.communityName}</TableHeaderColumn>
        <TableHeaderColumn dataField='summonerName'  dataFormat={this.summonerNameFormatter} >Summoner</TableHeaderColumn>
        <TableHeaderColumn dataField='tier' dataFormat={this.tierDataFormatter} >S7</TableHeaderColumn>
        <TableHeaderColumn dataField='wins' dataFormat={this.tierWinsLossesFormatter}>wins / looses </TableHeaderColumn>
      </BootstrapTable>
      :
      <Alert bsStyle="warning">No summoners yet.</Alert>
    )
  }
}
