import React from 'react';
import { ListGroup, Alert, Table, Media} from 'react-bootstrap';
import {TierIconImage} from './tier-icon';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Table as TableSemantic } from 'semantic-ui-react'
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
    return "<a  href="+url+" target='_blank' > "+sumName+"</a>";
  }

  tierDataFormatter(tier, row){
    console.log(row);
    if (!tier)
      tier = "unranked";

    return(
        <Media>
          <Media.Left align="middle">
            <TierIconImage tier={tier} />
          </Media.Left>
          <Media.Right  align="middle">
            { row.leaguePoints >= 0 ?
              <span>
                <strong>{tier.toLowerCase()} {row.division}  {row.leaguePoints} LP</strong>
              </span>
            :
              <span>
                <strong>{tier.toLowerCase()} {row.division}</strong>
              </span>
            }
          </Media.Right>
        </Media>
    );
  }

  tierWinsLossesFormatter(wins, row){
    return(row.wins +" / "+ row.losses);
  }

  render(){
    return(
      this.props.summoners.length > 0 ?
      <BootstrapTable data={ this.props.summoners } bordered={ false }  condensed >
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
