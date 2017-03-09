import React from 'react';
import { ListGroup, Alert, Table, Media} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Table as TableSemantic, Icon , List} from 'semantic-ui-react'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import {rankedTierDataFormatter} from './ranked-tier-data-formatter';
import {championStatsDataFormatter} from './champion-stats-data-formatter';
import {masteryDataFormatter} from './mastery-data-formatter';
import { sortByRank5v5, sortByMastery, sortByKda} from './sort-rank';

export default class CommunityUsersChampionFocus extends React.Component {

  constructor(props){
    super(props);
    this.summonerNameFormatter = this.summonerNameFormatter.bind(this);
    this.communityNameFormatter = this.communityNameFormatter.bind(this);
    this.refreshInfo = this.refreshInfo.bind(this);
    this.tableOptions = {
      defaultSortName: 'championStats',
      defaultSortOrder: 'asc',
      sortIndicator: true
   };
  }

  communityNameFormatter(comName, lolProfile, props){ // user is the table row
    const urlPrefix = this.props.community.urlUserLinkPrefix;
    const urlPrefixDisplay = this.props.community.urlUserLinkPrefixDisplay;
    return(
      <div>
        <Icon name='refresh' link onClick={() => {this.refreshInfo(lolProfile)}} />
        <a href={urlPrefix+comName} target='_blank'>{urlPrefixDisplay+comName}</a>
      </div>);
  }

  refreshInfo(lolProfile, props){
    Meteor.call('summonerProfile.refreshChampionStats', {
      lolProfile: lolProfile,
      championId: this.props.community.championFocus.championId
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
      <BootstrapTable data={ this.props.summoners }  options={this.tableOptions} bordered={ false }  containerStyle={{ width: '80%' }}  tableStyle={ { margin: '0 0 0 0' } } condensed >
        <TableHeaderColumn dataField='userCommunityName' dataFormat={this.communityNameFormatter} dataAlign='center' isKey>{this.props.community.displayName}</TableHeaderColumn>
        <TableHeaderColumn dataField='summonerName' dataFormat={this.summonerNameFormatter} dataAlign='center' >Summoner</TableHeaderColumn>
        <TableHeaderColumn dataField='championStats' dataSort sortFunc={sortByMastery} dataFormat={masteryDataFormatter} headerAlign='center'>Mastery</TableHeaderColumn>
        <TableHeaderColumn dataField='summoner' dataSort sortFunc={sortByKda} dataFormat={championStatsDataFormatter} headerAlign='center'>KDA / Win ratio</TableHeaderColumn>
        <TableHeaderColumn dataField='server' dataAlign='center' headerAlign='center'>Server</TableHeaderColumn>
        <TableHeaderColumn dataField='league5v5' dataSort sortFunc={sortByRank5v5} dataFormat={rankedTierDataFormatter} headerAlign='center'>S7 solo 5v5</TableHeaderColumn>
      </BootstrapTable>
      :
      <Alert bsStyle="warning">No summoners yet.</Alert>
    )
  }
}
