import { composeWithTracker } from 'react-komposer';
import { Communities } from '../../api/communities/communities.js';
import { CommunitiesList } from '../components/communities-list.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('communities');

let toto = "caca";
let communities= [];

const test = () =>{
  console.log("avant: "+toto);
  if(toto=="caca")
    toto = "pipi";
  else
    toto = "caca";

  console.log("après: "+toto);
  changeData();
}

changeData = () => {
  const data = {};

  //const communities = Communities.find().fetch();
  data.communities = communities;
  data.test = test;
  data.toto = toto;
  console.log(data);

  onData(null, {data});

}

load = () =>{
  const data = {};

  communities = Communities.find().fetch();

  data.communities = communities;
  data.test = test;
  data.toto = toto;
  onData(null, { data });
}


if (subscription.ready())
  load();


};

export default CommunitiesListContainer = composeWithTracker(composer, Loading)(CommunitiesList);
