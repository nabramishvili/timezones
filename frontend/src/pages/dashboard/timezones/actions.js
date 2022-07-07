import { axiosMain as axios } from '../../../common/instances';
import {
  ENDPOINT_AVAILABLE_TIMEZONES,
  ENDPOINT_DELETE_TIMEZONE,
  ENDPOINT_GET_TIMEZONE,
  ENDPOINT_GET_TIMEZONES,
  ENDPOINT_GET_TIMEZONES_USER,
  ENDPOINT_SAVE_TIMEZONE,
  ENDPOINT_UPDATE_TIMEZONE
} from '../../../common/endpoints';
import { unexpectedErrorHandler } from '../../../common/utils';

export const getTimezones = (user_id, params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(ENDPOINT_GET_TIMEZONES_USER(user_id), { params })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        unexpectedErrorHandler();
        reject(-1);
      });
  });
};

export const getAllTimezones = (params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(ENDPOINT_GET_TIMEZONES, { params })
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        unexpectedErrorHandler();
        reject(-1);
      });
  });
};

export const getTimezone = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(ENDPOINT_GET_TIMEZONE(id))
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        unexpectedErrorHandler();
        reject(-1);
      });
  });
};

export const getAvailableTimezones = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(ENDPOINT_AVAILABLE_TIMEZONES)
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        unexpectedErrorHandler();
        reject(-1);
      });
  });
};

export const saveTimezone = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(ENDPOINT_SAVE_TIMEZONE, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject(-1);
      });
  });
};

export const updateTimezone = (id, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(ENDPOINT_UPDATE_TIMEZONE(id), data)
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        reject(-1);
      });
  });
};

export const deleteTimezone = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(ENDPOINT_DELETE_TIMEZONE(id))
      .then(() => {
        resolve(1);
      })
      .catch(() => {
        reject(-1);
      });
  });
};
