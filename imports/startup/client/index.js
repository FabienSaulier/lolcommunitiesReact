import { Bert } from 'meteor/themeteorchef:bert';
import 'bootstrap/dist/css/bootstrap.min.css';
import './routes.js';


Object.assign(String.prototype, {
    capitalizeFirstLetter() {
        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    }
});


Bert.defaults = {

  hideDelay: 3500,
  // Accepts: a number in milliseconds.
  style: 'growl-top-right',
  // Accepts: fixed-top, fixed-bottom, growl-top-left,   growl-top-right,
  // growl-bottom-left, growl-bottom-right.
};
