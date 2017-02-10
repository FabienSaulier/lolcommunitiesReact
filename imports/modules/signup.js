import $ from 'jquery';
import 'jquery-validation';
import { browserHistory } from 'react-router';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import { getInputValue } from './get-input-value';

let component;

const getUserData = () => (
  {
  email: getInputValue(component.refs.emailAddress).trim(),
  password: getInputValue(component.refs.password).trim(),
  profile: {

    summonerName: getInputValue(component.refs.summonerName).trim(),
    summonerId: getInputValue(component.refs.summonerId),
    server: getInputValue(component.refs.server),
  },
});

const signUp = () => {
  const user = getUserData();

  if(user.profile.summonerId == ""){
    Bert.alert("We can't find your summoner name on this server", 'danger');
  } else{
    Accounts.createUser(user, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        browserHistory.push('/');
      }
    });
  }
};

const validate = () => {
  $(component.refs.signup).validate({
    rules: {
      summonerId: {
        required: true
      },
      summonerName: {
        required: true
      },
      server: {
        required: true
      },
      emailAddress: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minlength: 6,
      },
    },
    messages: {
      summonerName: {
        required: 'Need a summoner name here.',
      },
      server: {
        required: 'Need a server here.',
      },
      emailAddress: {
        required: 'Need an email address here.',
        email: 'Is this email address legit?',
      },
      password: {
        required: 'Need a password here.',
        minlength: 'Use at least six characters, please.',
      },
    },
    submitHandler() { signUp(); },
  });
};

export const handleSignup = (options) => {
  component = options.component;
  validate();
};
