export const TIMEZONES_MOCK_ENDPOINT =
  'https://35b24ab0-ab32-4593-9ab1-49b0aac9829b.mock.pstmn.io/api/timezones';
export const USERS_MOCK_ENDPOINT =
  'https://35b24ab0-ab32-4593-9ab1-49b0aac9829b.mock.pstmn.io/api/users';

export const findByTestAttr = (component, attr) => {
  return component.find(`[data-test='${attr}']`);
};
