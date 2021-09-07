import React from 'react';
import AppHeader from './AppHeader';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Header } from 'semantic-ui-react';

if (Meteor.isClient) {
  describe('AppHeader', function () {
    it('Banner "Flashcards" should be visible', function () {
      const header = shallow(<AppHeader />);
      expect(header.find(Header)).to.have.length(1);
    });
  });
}