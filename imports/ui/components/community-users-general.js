import React from 'react';
import { ListGroup, Alert, Table, Media} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Table as TableSemantic, Icon } from 'semantic-ui-react'
import { calculateElo } from '../../modules/calcul-elo'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import {rankedTierDataFormatter} from './ranked-tier-data-formatter';
import {sortByRank3v3,  sortByRank5v5, sortByRankFlex5v5} from './sort-rank';

export default class CommunityUsersGeneral extends React.Component {

  constructor(props){
    super(props);
    this.summonerNameFormatter = this.summonerNameFormatter.bind(this);
    this.communityNameFormatter = this.communityNameFormatter.bind(this);
    this.refreshInfo = this.refreshInfo.bind(this);
    this.tableOptions = {
      defaultSortName: 'league5v5',
      defaultSortOrder: 'asc',
      sortIndicator: false
   };
  }

  communityNameFormatter(comName, lolProfile){ // user is the table row
    return(<div><Icon name='refresh' link onClick={() => {this.refreshInfo(lolProfile)}} />  {comName}</div>);
  }

  refreshInfo(lolProfile){
    Meteor.call('summonerProfile.refresh', {
      lolProfile: lolProfile
    }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Data updated', 'success');
      }
    });
  }

  summonerNameFormatter(sumName, row){
    let url = "http://"+row.server+".op.gg/summoner/userName="+encodeURIComponent(sumName);
    return "<a href="+url+" target='_blank' > "+sumName+"</a>";
  }

  render(){
    return(
      this.props.summoners.length > 0 ?
      <BootstrapTable data={ this.props.summoners }  options={this.tableOptions} bordered={ false }  containerStyle={{ width: '100%' }}  tableStyle={ { margin: '0 0 0 0' } } condensed >
        <TableHeaderColumn dataField='userCommunityName' dataFormat={this.communityNameFormatter} dataAlign='center' isKey>{this.props.community.displayName}</TableHeaderColumn>
        <TableHeaderColumn dataField='summonerName' dataFormat={this.summonerNameFormatter} dataAlign='center' >Summoner</TableHeaderColumn>
        <TableHeaderColumn dataField='league5v5' dataSort sortFunc={sortByRank5v5} dataFormat={rankedTierDataFormatter} headerAlign='center'>S7 solo 5v5</TableHeaderColumn>
        <TableHeaderColumn dataField='league5v5flex' dataSort sortFunc={sortByRankFlex5v5} dataFormat={rankedTierDataFormatter}  headerAlign='center' >S7 flex 5v5</TableHeaderColumn>
{/*
        <TableHeaderColumn dataField='league3v3' dataSort sortFunc={sortByRank3v3} dataFormat={rankedTierDataFormatter} dataAlign='center'  >S7 3v3</TableHeaderColumn>
*/}
      </BootstrapTable>
      :
      <Alert bsStyle="warning">No summoners yet.</Alert>
    )
  }
}
