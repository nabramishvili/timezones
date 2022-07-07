//AUTH
export const ENDPOINT_AUTH_TOKEN = 'token';
export const ENDPOINT_GET_USER_INFO = 'auth/me';
export const ENDPOINT_REGISTER = 'auth/register';
export const ENDPOINT_REQUEST_RESET_PASSWORD = 'users/reset_request';

//TIMEZONES
export const ENDPOINT_GET_TIMEZONES = 'timezones/all';
export const ENDPOINT_SAVE_TIMEZONE = 'timezones';
export const ENDPOINT_UPDATE_TIMEZONE = (id) => `timezones/${id}`;
export const ENDPOINT_DELETE_TIMEZONE = (id) => `timezones/${id}`;
// export const ENDPOINT_GET_TIMEZONES_USER = ($user_id) => `users/${$user_id}/timezones`;
export const ENDPOINT_GET_TIMEZONES_USER = () => `timezones`;
export const ENDPOINT_GET_TIMEZONE = (id) => `timezones/${id}`;
export const ENDPOINT_AVAILABLE_TIMEZONES = 'timezones/available';

//USERS
export const ENDPOINT_GET_USERS = 'users';
export const ENDPOINT_SAVE_USER = 'users';
export const ENDPOINT_UPDATE_USER = (id) => `users/${id}`;
export const ENDPOINT_DELETE_USER = (id) => `users/${id}`;
export const ENDPOINT_GET_USER = (id) => `users/${id}`;
