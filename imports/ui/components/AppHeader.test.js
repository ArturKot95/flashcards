import React from 'react';
import AppHeader from './AppHeader.jsx';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Header } from 'semantic-ui-react';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Link } from 'react-router-dom';

describe('AppHeader', function () {
  before(function () {
    resetDatabase();
    Meteor.call('collection.new', 'Test 1');
    Meteor.call('collection.new', 'Test 2');
  })

  it('Banner "Flashcards" should be visible', function () {
    const header = shallow(<AppHeader />);
    expect(header.find(Header)).to.have.length(1);
  });

  it('Collections links should be next to banner', function () {
    const header = shallow(<AppHeader />);
    expect(header.find(Link)).to.have.length(2);
  })
});