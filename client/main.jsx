import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';
import 'semantic-ui-css/semantic.min.css'
import './main.css';

Meteor.startup(() => {
  Meteor.call()

  render(<App/>, document.getElementById('react-target'));
});
