import React from 'react';
import { shallow } from 'enzyme';
import { messages } from '../../../common/utils';
import { findByTestAttr, USERS_MOCK_ENDPOINT } from '../../../common/testUtils';
import { createBrowserHistory as createHistory } from 'history';
import axios from 'axios';
import { axiosMain } from '../../../common/instances';
import MockAdapter from 'axios-mock-adapter';
import { PAGE_OPTIONS, PAGE_SIZE } from '../../../common/constants';
import { UsersList } from './UsersList';

const history = createHistory();

const setUp = (props = {}) => {
  return shallow(<UsersList {...props} />);
};

const mockMessages = jest.fn((s) => s);
messages.t = mockMessages;

const match = { params: {} };
const user = { id: 1 };

describe('Users List Component', () => {
  let component, mock;
  beforeEach(() => {
    component = setUp({
      history: history,
      match: match,
      user: user
    });
    mock = new MockAdapter(axiosMain);
  });

  it('Renders without errors', () => {
    expect(component.exists()).toBeTruthy();
  });

  it('Renders users table', () => {
    const usersTable = findByTestAttr(component, 'usersTable');
    expect(usersTable.length).toBe(1);
  });

  it('Fetches successfully data from API, calls users endpoint', async () => {
    const data = await axios.get(USERS_MOCK_ENDPOINT);
    const initialPagination = {
      current: 1,
      pageSize: PAGE_SIZE,
      pageSizeOptions: PAGE_OPTIONS
    };
    let spy = jest.spyOn(axiosMain, 'get');
    mock.onGet().reply(200, data);
    const usersTable = findByTestAttr(component, 'usersTable');
    usersTable.prop('fetchData')({ pagination: initialPagination });
    expect(spy).toHaveBeenCalledWith('users', expect.anything());
  });
});
