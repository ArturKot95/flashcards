import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';
import 'semantic-ui-css/semantic.min.css'
import './main.css';
import 'flag-icon-css/css/flag-icon.min.css';

Meteor.startup(() => {
  Meteor.call()

  render(<App/>, document.getElementById('react-target'));
});
