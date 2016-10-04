import { composeWithTracker } from 'react-komposer';
import { Communities } from '../../api/communities/communities.js';
import { Community } from '../components/community.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (props, onData) => {
  const subscription = Meteor.subscribe('communities');

  if (subscription.ready()) {
    const community = Communities.findOne({_id:props.communityId});
    onData(null, { community });
  }
};

export default composeWithTracker(composer, Loading)(Community);
