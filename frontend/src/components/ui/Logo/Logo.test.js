import React from 'react';
import { shallow } from 'enzyme';
import { messages } from '../../../common/utils';
import { findByTestAttr } from '../../../common/testUtils';
import Logo from './Logo';

const setUp = (props = {}) => {
  return shallow(<Logo {...props} />);
};

const mockMessages = jest.fn((s) => s);
messages.t = mockMessages;

describe('Logo Component', () => {
  let component;
  beforeEach(async () => {
    component = setUp({
      width: 200,
      align: 'center'
    });
  });

  it('Renders without errors', () => {
    expect(component.exists()).toBeTruthy();
  });

  it('Renders logo img', () => {
    const img = findByTestAttr(component, 'logo');
    expect(img.length).toBe(1);
  });
});
