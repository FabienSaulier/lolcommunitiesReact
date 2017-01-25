import React from 'react';
import { ListGroup, Alert, Table} from 'react-bootstrap';


export const CommunityUsers = ({ summoners , communityName}) => (

  summoners.length > 0 ?

  <Table responsive className="communityUsersList">
    <thead>
      <tr>
        <th>{communityName} name</th>
        <th>Summoner Name</th>
        <th>Current Season</th>
        <th>S6</th>
        <th>Ranked Wins</th>
      </tr>
    </thead>

    <tbody>
      {summoners.map((summoner, index) => (
        <tr key={index}>
          <td> {summoner.userCommunityName}</td>
          <td><a href={"http://"+summoner.server+".op.gg/summoner/userName="+summoner.summonerName}> {summoner.summonerName}</a></td>
          <td> {summoner.tier} {summoner.division} {summoner.leaguePoints}</td>
          <td> </td>
          <td> {summoner.wins}/{summoner.losses}</td>
        </tr>
      ))}
    </tbody>
  </Table>
  :
  <Alert bsStyle="warning">No summoners yet.</Alert>
);
