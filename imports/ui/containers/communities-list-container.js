import { composeWithTracker } from 'react-komposer';
import { Communities } from '../../api/communities/communities.js';
import { CommunitiesList } from '../components/communities-list.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('communities');

  if (subscription.ready()) {
    const communities = Communities.find().fetch();
    onData(null, { communities });
  }
};

export default composeWithTracker(composer, Loading)(CommunitiesList);
