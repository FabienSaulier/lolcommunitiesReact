import { composeWithTracker } from 'react-komposer';
import { Communities } from '../../api/communities/communities.js';
import { CommunitiesList } from '../components/communities-list.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {

  const subscription = Meteor.subscribe('communities');
  let communities= [];

  load = () =>{
    const data = {};
    communities = Communities.find().fetch();
    data.communities = communities;
    onData(null, { data });
  }

  if (subscription.ready())
    load();
  };

export default CommunitiesListContainer = composeWithTracker(composer, Loading)(CommunitiesList);
