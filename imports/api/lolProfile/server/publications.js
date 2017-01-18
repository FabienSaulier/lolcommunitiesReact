import { Meteor } from 'meteor/meteor';
import { LolProfile } from '../lolProfile';

Meteor.publish('lolProfile', () => LolProfile.find());
