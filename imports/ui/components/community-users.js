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
    this.tierWinsLossesFormatter = this.tierWinsLossesFormatter.bind(this);
    this.sortByRank = this.sortByRank.bind(this);
    this.calculateElo = this.calculateElo.bind(this);
    this.communityNameFormatter = this.communityNameFormatter.bind(this);
    this.refreshInfo = this.refreshInfo.bind(this);
    this.getRanked5v5Data = this.getRanked5v5Data.bind(this);
    this.tableOptions = {
      defaultSortName: 'leagues',
      defaultSortOrder: 'asc',
      sortIndicator: false  // disable sort indicator ?? doesn't work.
   };
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
        Bert.alert('refresh', 'success');
      }
    });
  }

  summonerNameFormatter(sumName, row){
    let url = "http://"+row.server+".op.gg/summoner/userName="+sumName;
    return "<a href="+url+" target='_blank' > "+sumName+"</a>";
  }

  getRanked5v5Data(summonerProfil){
    for(league of summonerProfil.leagues){
      if(league.queue == 'RANKED_SOLO_5x5')
        return league;
    }
    return {'tier':"unranked"};
  }

  sortByRank(summonerA, summonerB, order) {
    const aLeague = this.getRanked5v5Data(summonerA);
    const bLeague = this.getRanked5v5Data(summonerB);

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

  tierDataFormatter(leagues, row){
    let league;
    for(l of leagues){
      if(l.queue == 'RANKED_SOLO_5x5')
        league = l;
    }
    if(!league)
      league = {'tier': 'unranked'};

    return(
        <Media>
          <Media.Left align="middle">
            <TierIconImage tier={league.tier} />
          </Media.Left>
          <Media.Right  align="middle">
            { league.leaguePoints >= 0 ?
              <span>
                <strong>{league.tier.toLowerCase()} {league.division}  {league.leaguePoints} LP</strong>
              </span>
            :
              <span>
                <strong>{league.tier.toLowerCase()} {league.division}</strong>
              </span>
            }
          </Media.Right>
        </Media>
    );
  }

  tierWinsLossesFormatter(leagues, summoner){
    const league5v5 = this.getRanked5v5Data(summoner);
    if(league5v5.wins === undefined || league5v5.losses === undefined)
      return('-');
    return(league5v5.wins +" / "+ league5v5.losses);
  }

  render(){
    return(
      this.props.summoners.length > 0 ?
      <BootstrapTable data={ this.props.summoners }  options={this.tableOptions} bordered={ false }  containerStyle={{ width: '70%' }}  tableStyle={ { margin: '0 0 0 0' } } condensed >
        <TableHeaderColumn dataField='userCommunityName' dataFormat={this.communityNameFormatter} isKey>{this.props.communityName}</TableHeaderColumn>
        <TableHeaderColumn dataField='summonerName' dataFormat={this.summonerNameFormatter} >Summoner</TableHeaderColumn>
        <TableHeaderColumn dataField='leagues' dataSort sortFunc={this.sortByRank} dataFormat={this.tierDataFormatter} >S7 solo 5x5</TableHeaderColumn>
        <TableHeaderColumn dataField='winlosses' dataFormat={this.tierWinsLossesFormatter}>wins / losses </TableHeaderColumn>
      </BootstrapTable>
      :
      <Alert bsStyle="warning">No summoners yet.</Alert>
    )
  }
}
