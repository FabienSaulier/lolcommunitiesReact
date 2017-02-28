import React from 'react';
import { ListGroup, Alert, Table, Media} from 'react-bootstrap';
import {TierIconImage} from './tier-icon';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Table as TableSemantic, Icon } from 'semantic-ui-react'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

export class CommunityUsers extends React.Component {

  constructor(props){
    super(props);
    this.summonerNameFormatter = this.summonerNameFormatter.bind(this);
    this.tierDataFormatter = this.tierDataFormatter.bind(this);
    this.sortByRank3v3 = this.sortByRank3v3.bind(this);
    this.sortByRank5v5 = this.sortByRank5v5.bind(this);
    this.sortByRankFlex5v5 = this.sortByRankFlex5v5.bind(this);
    this.calculateElo = this.calculateElo.bind(this);
    this.communityNameFormatter = this.communityNameFormatter.bind(this);
    this.refreshInfo = this.refreshInfo.bind(this);
    this.calculatePositionAB = this.calculatePositionAB.bind(this);
    this.tableOptions = {
      defaultSortName: 'league5v5',
      defaultSortOrder: 'asc',
      sortIndicator: false
   };


   Object.assign(String.prototype, {
       capitalizeFirstLetter() {
           return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
       }
   });

  }

  communityNameFormatter(comName, row){
    return(<div><Icon name='refresh' link onClick={() => {this.refreshInfo(row.summonerId, row.server)}} />  {comName}</div>);
  }

  refreshInfo(summonerId, summonerServer){
    Meteor.call('summonerProfile.refresh', {
      summonerId: summonerId,
      summonerServer: summonerServer
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

  sortByRank3v3(summonerA, summonerB, order) {
    return this.calculatePositionAB(summonerA.league3v3, summonerB.league3v3, order);
  }

  sortByRank5v5(summonerA, summonerB, order) {
    return this.calculatePositionAB(summonerA.league5v5, summonerB.league5v5, order);
  }

  sortByRankFlex5v5(summonerA, summonerB, order) {
    return this.calculatePositionAB(summonerA.league5v5flex, summonerB.league5v5flex, order);
  }

  calculatePositionAB(aLeague, bLeague, order){
    let aPoints = this.calculateElo(aLeague);
    let bPoints = this.calculateElo(bLeague);
    if(order === 'desc'){
      if(aPoints > bPoints){
        return 1;
      }
      else if (aPoints === bPoints)
        return 0;
      else
        return -1;
    } else{
      if(aPoints > bPoints){
        return -1;
      }
      else if (aPoints === bPoints)
        return 0;
      else
        return 1;
    }
  }

  calculateElo(leagueInfo){
    if(!leagueInfo)
      return 0;

    let points;
    switch (leagueInfo.tier) {
      case "UNRANKED":
        points = 0;
        break;
      case "BRONZE":
        points = 10000;
        break;
      case "SILVER":
        points = 20000;
        break;
      case "GOLD":
        points = 30000;
        break;
      case "PLATINUM":
        points = 40000;
        break;
      case "DIAMOND":
        points = 50000;
        break;
      case "MASTER":
        points = 60000;
        break;
      case "CHALLENGER":
        points = 70000;
        break;
      default:
        points = 0;
    };
    switch (leagueInfo.division) {
      case "V":
        points += 0;
        break;
      case "IV":
        points += 1000;
        break;
      case "III":
        points += 2000;
        break;
      case "II":
        points += 3000;
        break;
      case "I":
        points += 4000;
        break;
      default:
    };
    if(leagueInfo.leaguePoints)
      points += leagueInfo.leaguePoints;
    return points;
  }

  tierDataFormatter(league, row){
    if(!league)
      league = {'tier': 'unranked'};
    return(
        <Media>
          <Media.Left align="middle" style={{'paddingRight':0}}>
            <TierIconImage tier={league.tier} />
          </Media.Left>
          <Media.Right  align="middle" style={{'paddingLeft':'5px'}}>
            { league.leaguePoints >= 0 ? // case of unranked
              <span>{league.tier.capitalizeFirstLetter()} {league.division}  {league.leaguePoints} LP
                <br /><small> {league.wins} W / {league.losses} L</small>
              </span>
            :
              <span>{league.tier.capitalizeFirstLetter()} {league.division}
                <br /><small> {league.wins} W / {league.losses} L</small>
              </span>
            }
          </Media.Right>
        </Media>
    );
  }

  render(){
    return(
      this.props.summoners.length > 0 ?
      <BootstrapTable data={ this.props.summoners }  options={this.tableOptions} bordered={ false }  containerStyle={{ width: '90%' }}  tableStyle={ { margin: '0 0 0 0' } } condensed >
        <TableHeaderColumn dataField='userCommunityName' dataFormat={this.communityNameFormatter} dataAlign='center' isKey>{this.props.communityName}</TableHeaderColumn>
        <TableHeaderColumn dataField='summonerName' dataFormat={this.summonerNameFormatter} dataAlign='center' >Summoner</TableHeaderColumn>
        <TableHeaderColumn dataField='league5v5' dataSort sortFunc={this.sortByRank5v5} dataFormat={this.tierDataFormatter} dataAlign='center'  >S7 solo 5v5</TableHeaderColumn>
        <TableHeaderColumn dataField='league5v5flex' dataSort sortFunc={this.sortByRankFlex5v5} dataFormat={this.tierDataFormatter} dataAlign='center'   >S7 flex 5v5</TableHeaderColumn>
        <TableHeaderColumn dataField='league3v3' dataSort sortFunc={this.sortByRank3v3} dataFormat={this.tierDataFormatter} dataAlign='center'  >S7 3v3</TableHeaderColumn>
      </BootstrapTable>
      :
      <Alert bsStyle="warning">No summoners yet.</Alert>
    )
  }
}
