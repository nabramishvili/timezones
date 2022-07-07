import { notification } from 'antd';
import { axiosMain as axios } from './instances';
import { LOADING_UI } from '../state/types';
import jwtDecode from 'jwt-decode';
import {
  getUserData,
  logoutUser,
  refreshToken as refreshTokenAction
} from '../state/actions/userActions';
import { ROOT_PAGE_URI } from './pages';
import moment from 'moment';
import { PAGE_OPTIONS, PAGE_SIZE } from './constants';

/**
 *
 * Global messages object which will keep messages for current selected language
 *
 * @type {{t: {}}}
 */
export const messages = {
  t: {}
};

/**
 *
 * Show info with given title and description
 *
 * @param title
 * @param description
 */
export const showInfo = (title, description = null) => {
  return notification['info']({
    message: title,
    description: description
  });
};

/**
 *
 * Show success notification with given title and description
 *
 * @param title
 * @param description
 */
export const showSuccess = (title, description = null) => {
  return notification['success']({
    message: title,
    description: description
  });
};

/**
 *
 * Show error notification with given title and description
 *
 * @param title
 * @param description
 */
export const showError = (title, description = null) => {
  return notification['error']({
    message: title,
    description: description
  });
};

/**
 * Show unexpected error notification
 */
export const unexpectedErrorHandler = () => {
  return notification['error']({
    message: messages.t('general.try_later')
  });
};

/**
 *
 * check authenticated user, refresh token if needed
 *
 * @param store
 * @param loadUserData
 */
export const checkAuthenticated = (store, loadUserData = false) => {
  const storeState = store.getState();
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  if (accessToken) {
    //store.dispatch({ type: SET_AUTHENTICATED });
    const decodedToken = jwtDecode(accessToken);
    if (decodedToken.exp * 1000 < Date.now() + 300000) {
      if (refreshToken) {
        if (!storeState.user.refreshing) {
          store.dispatch(refreshTokenAction(loadUserData));
        }
      } else {
        showInfo(
          messages.t('login.session_expired_title'),
          messages.t('login.session_expired_description')
        );
        store.dispatch(logoutUser());
      }
    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      if (loadUserData) {
        store.dispatch({ type: LOADING_UI });
        store.dispatch(getUserData());
      }
    }
  }
};

/**
 *
 * Generate link relative to root dashboard url
 *
 * @param key
 * @returns {string}
 */
export const dashboardLink = (key) => `${ROOT_PAGE_URI}${key}`;

/**
 *
 * Convert pagination param from antd table for api endpoint
 *
 * @param data
 * @returns {*}
 */
export const convertPagination = (data) => {
  data.page = data.pagination.current;
  data.per_page = data.pagination.pageSize;
  delete data.pagination;
  return data;
};

/**
 *
 * Update current url according to table filters
 *
 * @param params
 * @param history
 */
export const updateAntdTableFiltersUrl = (params, history) => {
  let search = '?';
  if (
    params.pagination &&
    params.pagination.current &&
    params.pagination.current !== 1
  ) {
    search += `page=${params.pagination.current}`;
  }
  for (let key in params) {
    if (key !== 'pagination') {
      // noinspection JSUnfilteredForInLoop
      if (params[key]) {
        if (search.length > 1) search += '&';
        // noinspection JSUnfilteredForInLoop
        search += `${key}=${params[key]}`;
      }
    }
  }
  if (!(!history.location.search && search === '?')) {
    history.push({
      search: search
    });
  }
};

/**
 *
 * Get date format
 *
 * @param seconds
 * @returns {string}
 */
const getDateFormat = (seconds = false) => {
  return seconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
};

/**
 *
 * Get current utc time with provided offset
 *
 * @param offset
 * @param seconds
 * @returns {string}
 */
export const getCurrentDateTimeWithGmtOffset = (offset, seconds = false) => {
  if (!offset) return '';
  offset = offset.replace(':', '');
  if (offset[0] !== '-') {
    offset = '+' + offset;
  }
  return moment().utc().utcOffset(offset).format(getDateFormat(seconds));
};

/**
 *
 * Get current utc time
 *
 * @param seconds
 * @returns {string}
 */
export const getCurrentUtcDateTime = (seconds = false) => {
  return moment().utc().format(getDateFormat(seconds));
};

/**
 *
 * Get current browser time
 *
 * @param seconds
 * @returns {string}
 */
export const getCurrentDateTime = (seconds = false) => {
  return moment().format(getDateFormat(seconds));
};

/**
 *
 * Calculate difference between two dates and return it in hh:mm format
 *
 * @param d1
 * @param d2
 * @returns {string}
 */
export const calculateDateDifference = (d1, d2) => {
  if (!d1 || !d2) return '';
  const ms = moment(d1, getDateFormat()).diff(moment(d2, getDateFormat()));
  const d = moment.duration(ms);
  let hours = d.hours().toString();
  let minutes = d.minutes().toString();
  let sign = hours[0] === '-' ? '-' : '+';
  hours = hours.replace('-', '');
  minutes = minutes.replace('-', '');
  hours = hours.padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');
  return sign + hours + ':' + minutes;
};

/**
 *
 * Strip leading slashes from a string
 *
 * @param s
 * @returns {void | string | *}
 */
export const stripLeadingSlash = (s) => {
  return s.replace(/^\/+/g, '');
};

/**
 *
 * check if given user is of role "user"
 *
 * @param user
 * @returns {boolean}
 */
export const isUser = (user) => {
  return user.role === 'user';
};

/**
 *
 * check if given user is of role "manager"
 *
 * @param user
 * @returns {boolean}
 */
export const isManager = (user) => {
  return user.role === 'manager';
};

/**
 *
 * check if given user is of role "admin"
 *
 * @param user
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return user.role === 'admin';
};

/**
 *
 * check if given user is of role "admin" or "manager"
 *
 * @param user
 * @returns {boolean}
 */
export const isManagerOrAdmin = (user) => {
  return user.role === 'admin' || user.role === 'manager';
};

/**
 *
 * Get initial pagination params for tables
 *
 * @returns {{current: number, pageSizeOptions: number[], pageSize: number}}
 */
export const getInitialTablePagination = () => {
  return { current: 1, pageSize: PAGE_SIZE, pageSizeOptions: PAGE_OPTIONS };
};

/**
 *
 * Remove empty keys from object
 *
 * @param obj
 */
export const cleanObject = (obj) => {
  for (let propName in obj) {
    // noinspection JSUnfilteredForInLoop
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ''
    ) {
      // noinspection JSUnfilteredForInLoop
      delete obj[propName];
    }
  }
};

/**
 *
 * Check if authenticated user can edit target user
 *
 * @param user
 * @param target
 * @returns {boolean}
 */
export const checkValidUserEdit = (user, target) => {
  if (isAdmin(user)) {
    return isUser(target) || isManager(target);
  } else if (isManager(user)) {
    return isUser(target);
  }
  return false;
};

/**
 *
 * Check if password is strong enough. Password should contain at least 1 uppercase letter,
 * at least one lowercase letter and at least 1 number.
 *
 * @param password
 * @returns {boolean}
 */
export const testStrongPassword = (password) => {
  return new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])').test(password);
};
