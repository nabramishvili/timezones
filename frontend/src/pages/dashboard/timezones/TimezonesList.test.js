import React from 'react';
import { shallow } from 'enzyme';
import { messages } from '../../../common/utils';
import {
  findByTestAttr,
  TIMEZONES_MOCK_ENDPOINT
} from '../../../common/testUtils';
import { TimezonesList } from './TimezonesList';
import { createBrowserHistory as createHistory } from 'history';
import axios from 'axios';
import { axiosMain } from '../../../common/instances';
import MockAdapter from 'axios-mock-adapter';
import { PAGE_OPTIONS, PAGE_SIZE } from '../../../common/constants';

const history = createHistory();

const setUp = (props = {}) => {
  return shallow(<TimezonesList {...props} />);
};

const mockMessages = jest.fn((s) => s);
messages.t = mockMessages;

const match = { params: {} };
const user = { id: 1 };

describe('Timezones List Component', () => {
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

  it('Renders timezones table', () => {
    const timezonesTable = findByTestAttr(component, 'timezonesTable');
    expect(timezonesTable.length).toBe(1);
  });

  it('Fetches successfully data from API, calls timezones endpoint', async () => {
    const data = await axios.get(TIMEZONES_MOCK_ENDPOINT);
    const initialPagination = {
      current: 1,
      pageSize: PAGE_SIZE,
      pageSizeOptions: PAGE_OPTIONS
    };
    let spy = jest.spyOn(axiosMain, 'get');
    mock.onGet().reply(200, data);
    const timezonesTable = findByTestAttr(component, 'timezonesTable');
    timezonesTable.prop('fetchData')({ pagination: initialPagination });
    expect(spy).toHaveBeenCalledWith('timezones', expect.anything());
  });
});
