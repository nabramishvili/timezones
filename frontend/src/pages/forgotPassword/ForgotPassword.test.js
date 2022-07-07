import React from 'react';
import { shallow } from 'enzyme';
import { messages } from '../../common/utils';
import { findByTestAttr } from '../../common/testUtils';
import { ForgotPassword } from './ForgotPassword';

const setUp = (props = {}) => {
  return shallow(<ForgotPassword {...props} />);
};

const mockMessages = jest.fn((s) => s);
const mockResetPassword = jest.fn();
messages.t = mockMessages;

describe('ForgotPassword Component', () => {
  let component;
  beforeEach(() => {
    component = setUp({
      resetPassword: mockResetPassword
    });
  });

  it('Renders without errors', () => {
    expect(component.exists()).toBeTruthy();
  });

  it('Renders Logo Component', () => {
    const logo = component.find('Logo');
    expect(logo.length).toBe(1);
  });

  it('Renders Forgot Password Form', () => {
    const registerForm = findByTestAttr(component, 'forgotPasswordForm');
    expect(registerForm.length).toBe(1);
  });

  it('Renders Form Submit Button', async () => {
    const submitButton = findByTestAttr(component, 'forgotPasswordSubmit');
    expect(submitButton.length).toBe(1);
  });

  it('Calls forgot password function when submit button is pressed', async () => {
    const registerForm = findByTestAttr(component, 'forgotPasswordForm');
    registerForm.prop('onFinish')();
    expect(mockResetPassword.mock.calls.length).toBe(1);
  });
});
