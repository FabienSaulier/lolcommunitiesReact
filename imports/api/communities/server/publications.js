import { Meteor } from 'meteor/meteor';
import { Communities } from '../communities';

Meteor.publish('communities', () => Communities.find());
