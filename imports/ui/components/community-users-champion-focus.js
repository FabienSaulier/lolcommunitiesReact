import React from 'react';
import { ListGroup, Alert, Table, Media} from 'react-bootstrap';
import {TierIconImage} from './tier-icon';
import {MasteryIconImage} from './mastery-icon';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Table as TableSemantic, Icon } from 'semantic-ui-react'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import {rankedTierDataFormatter} from './ranked-tier-data-formatter';
import {sortByRank3v3,  sortByRank5v5, sortByRankFlex5v5, sortByMastery} from './sort-rank';

export default class CommunityUsersChampionFocus extends React.Component {

  constructor(props){
    super(props);
    this.summonerNameFormatter = this.summonerNameFormatter.bind(this);
    this.communityNameFormatter = this.communityNameFormatter.bind(this);
    this.refreshInfo = this.refreshInfo.bind(this);
    this.masteryDataFormatter=this.masteryDataFormatter.bind(this);
    this.tableOptions = {
      defaultSortName: 'championStats',
      defaultSortOrder: 'asc',
      sortIndicator: false
   };
  }

  communityNameFormatter(comName, lolProfile){ // user is the table row
    return(<div><Icon name='refresh' link onClick={() => {this.refreshInfo(lolProfile)}} />  {comName}</div>);
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

  masteryDataFormatter(championStats, row, props){
    return(
      championStats ?
        <Media style={{'marginLeft': 'auto', 'marginRight': 'auto', 'width': '150px'}}>
          <Media.Left align="middle" style={{'paddingRight':0}}>
            <MasteryIconImage mastery={championStats.championLevel} />
          </Media.Left>
          <Media.Right  align="middle" style={{'paddingLeft':'5px'}}>
            {championStats.championPoints} points
          </Media.Right>
        </Media>
      :
        <span></span>
    );
  }

  render(){
    return(
      this.props.summoners.length > 0 ?
      <BootstrapTable data={ this.props.summoners }  options={this.tableOptions} bordered={ false }  containerStyle={{ width: '70%' }}  tableStyle={ { margin: '0 0 0 0' } } condensed >
        <TableHeaderColumn dataField='userCommunityName' dataFormat={this.communityNameFormatter} dataAlign='center' isKey>{this.props.community.displayName}</TableHeaderColumn>
        <TableHeaderColumn dataField='summonerName' dataFormat={this.summonerNameFormatter} dataAlign='center' >Summoner</TableHeaderColumn>
        <TableHeaderColumn dataField='championStats' dataSort sortFunc={sortByMastery} dataFormat={this.masteryDataFormatter} headerAlign='center'>Mastery</TableHeaderColumn>
        <TableHeaderColumn dataField='league5v5' dataSort sortFunc={sortByRank5v5} dataFormat={rankedTierDataFormatter} headerAlign='center'>S7 solo 5v5</TableHeaderColumn>
        <TableHeaderColumn dataField='server' dataSort dataAlign='center' headerAlign='center'>Server</TableHeaderColumn>
      </BootstrapTable>
      :
      <Alert bsStyle="warning">No summoners yet.</Alert>
    )
  }
}
