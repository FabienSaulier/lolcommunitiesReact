import React from 'react';
import { ListGroup, Alert, Table, Media} from 'react-bootstrap';
import {TierIconImage} from './tier-icon';
import {MasteryIconImage} from './mastery-icon';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Table as TableSemantic, Icon , List} from 'semantic-ui-react'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import {rankedTierDataFormatter} from './ranked-tier-data-formatter';
import { sortByRank5v5, sortByMastery, sortByKda} from './sort-rank';

export default class CommunityUsersChampionFocus extends React.Component {

  constructor(props){
    super(props);
    this.summonerNameFormatter = this.summonerNameFormatter.bind(this);
    this.communityNameFormatter = this.communityNameFormatter.bind(this);
    this.refreshInfo = this.refreshInfo.bind(this);
    this.masteryDataFormatter=this.masteryDataFormatter.bind(this);
    this.championStatsDataFormatter = this.championStatsDataFormatter.bind(this);
    this.getKdaColor = this.getKdaColor.bind(this);
    this.getWinrateColor = this.getWinrateColor.bind(this);
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

  getKdaColor(K,D,A){
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

  getWinrateColor(winrate){
    if(winrate < 55)
      return 'black';
    else if(winrate < 60)
      return "#f9a825"; // yellow darken-3
    else if(winrate < 65)
      return '#ef6c00';// orange darken-3
    else
      return '#d84315';// deep-orange darken-3
  }

  championStatsDataFormatter(summoner, row){
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
            <List.Item><span style={{ 'color':this.getWinrateColor(winrate)}}>{winrate}%</span> &nbsp;&nbsp; <small>{championStats.totalSessionsPlayed} games</small></List.Item>
          </List>
        </div>
      :
        <span></span>
    );
  }

  render(){
    return(
      this.props.summoners.length > 0 ?
      <BootstrapTable data={ this.props.summoners }  options={this.tableOptions} bordered={ false }  containerStyle={{ width: '80%' }}  tableStyle={ { margin: '0 0 0 0' } } condensed >
        <TableHeaderColumn dataField='userCommunityName' dataFormat={this.communityNameFormatter} dataAlign='center' isKey>{this.props.community.displayName}</TableHeaderColumn>
        <TableHeaderColumn dataField='summonerName' dataFormat={this.summonerNameFormatter} dataAlign='center' >Summoner</TableHeaderColumn>
        <TableHeaderColumn dataField='championStats' dataSort sortFunc={sortByMastery} dataFormat={this.masteryDataFormatter} headerAlign='center'>Mastery</TableHeaderColumn>
        <TableHeaderColumn dataField='summoner' dataSort sortFunc={sortByKda} dataFormat={this.championStatsDataFormatter} headerAlign='center'>KDA</TableHeaderColumn>
        <TableHeaderColumn dataField='server' dataAlign='center' headerAlign='center'>Server</TableHeaderColumn>
        <TableHeaderColumn dataField='league5v5' dataSort sortFunc={sortByRank5v5} dataFormat={rankedTierDataFormatter} headerAlign='center'>S7 solo 5v5</TableHeaderColumn>
      </BootstrapTable>
      :
      <Alert bsStyle="warning">No summoners yet.</Alert>
    )
  }
}
