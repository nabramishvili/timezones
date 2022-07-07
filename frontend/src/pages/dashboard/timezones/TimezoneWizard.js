import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import {
  dashboardLink,
  isAdmin,
  messages,
  showSuccess,
  unexpectedErrorHandler
} from '../../../common/utils';
import {
  getAvailableTimezones,
  getTimezone,
  saveTimezone,
  updateTimezone
} from './actions';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { TIMEZONES_PAGE_URI } from '../../../common/pages';
import {
  startDashboardLoading,
  stopDashboardLoading
} from '../../../state/actions/uiActions';
import { connect } from 'react-redux';
import { getUser, getUsers } from '../users/actions';
import { SELECT_PAGE_SIZE } from '../../../common/constants';

export const TimezoneWizard = (props) => {
  const [loading, setLoading] = useState(props.action === 'edit');
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [offsets, setOffsets] = useState([]);
  const [data, setData] = useState({});
  const { timezoneId, userId } = props.match.params;
  const { startDashboardLoading, stopDashboardLoading } = props;
  let canceled = false;

  useEffect(() => {
    getAvailableTimezones().then((response) => {
      if (canceled) return;
      setOffsets(response.data);
    });
    if (props.action === 'edit') {
      startDashboardLoading();
      getTimezone(timezoneId).then((res) => {
        if (canceled) return;
        setLoading(false);
        stopDashboardLoading();
        setData(res.data);
      });
    }
    if (isAdmin(props.user)) {
      loadUsers();
      if (userId) {
        startDashboardLoading();
        loadUser(userId);
      }
    }

    return () => {
      canceled = true;
      stopDashboardLoading();
    };
  }, [
    stopDashboardLoading,
    startDashboardLoading,
    props.action,
    props.user,
    timezoneId
  ]);

  const loadUsers = (search = '') => {
    getUsers({ search, per_page: SELECT_PAGE_SIZE }).then((res) => {
      if (canceled) return;
      setUsers(res.data);
    });
  };

  const loadUser = (id) => {
    getUser(id).then((res) => {
      if (canceled) return;
      setCurrentUser(res.data);
      stopDashboardLoading();
    });
  };

  const onFinish = (values) => {
    startDashboardLoading();
    if (values.user_id) {
      values.user_id = parseInt(values.user_id.key);
    }
    if (props.action === 'add') {
      saveTimezone(values)
        .then((response) => {
          handleResponse(response);
        })
        .catch(() => stopDashboardLoading());
    } else {
      updateTimezone(timezoneId, values)
        .then((response) => {
          handleResponse(response);
        })
        .catch(() => stopDashboardLoading());
    }
  };

  const handleResponse = (response) => {
    if (response.success) {
      stopDashboardLoading();
      showSuccess(messages.t('general.operation_success'));
      if (
        props.location &&
        props.location.referrer &&
        props.location.referrer !== props.history.location.pathname
      ) {
        props.history.push(props.location.referrer);
      } else {
        props.history.push(dashboardLink(TIMEZONES_PAGE_URI));
      }
    } else {
      unexpectedErrorHandler();
      stopDashboardLoading();
    }
  };

  const handleSearch = (value) => {
    loadUsers(value);
  };

  let initialValues = null;
  if (props.action === 'edit') {
    if (data && data.name) {
      initialValues = {
        name: data.name,
        city: data.city,
        offset: data.offset
      };
    }
    if (isAdmin(props.user) && initialValues) {
      initialValues.user_id = {
        key: data.user.id,
        value: data.user.full_name
      };
    }
  } else if (isAdmin(props.user) && userId && currentUser) {
    initialValues = {
      user_id: {
        key: userId,
        value: currentUser.full_name
      }
    };
  } else if (isAdmin(props.user) && !userId) {
    initialValues = {
      user_id: {
        key: props.user.id,
        value: props.user.full_name
      }
    };
  }

  let showForm = props.action === 'add' || (!loading && data.name);
  if (userId) {
    showForm = !!currentUser;
  }

  return (
    <>
      <Helmet>
        <title>
          {props.action === 'add'
            ? messages.t('timezones.title_page_add')
            : messages.t('timezones.title_page_edit')}
        </title>
      </Helmet>
      <Row type={'flex'} justify={'left'} aling={'left'}>
        <Col xs={24} md={10}>
          {showForm ? (
            <Form
              name="timezoneForm"
              layout={'vertical'}
              onFinish={onFinish}
              initialValues={initialValues}
              data-test={'timezoneWizard'}
            >
              <Form.Item
                label={messages.t('general.name')}
                name="name"
                rules={[
                  {
                    required: true,
                    message: messages.t('timezones.name_required')
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={messages.t('timezones.city')}
                name="city"
                rules={[
                  {
                    required: true,
                    message: messages.t('timezones.city_required')
                  },
                  {
                    min: 2,
                    message: messages.t('timezones.min_city')
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={messages.t('timezones.gmt_offset')}
                name="offset"
                rules={[
                  {
                    required: true,
                    message: messages.t('timezones.offset_required')
                  }
                ]}
              >
                <Select
                  showSearch
                  placeholder={messages.t('timezones.gmt_offset')}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {offsets.map((x) => {
                    return (
                      <Select.Option key={x} value={x}>
                        {x}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              {isAdmin(props.user) ? (
                <Form.Item label={messages.t('users.user_id')} name="user_id">
                  <Select
                    showSearch
                    filterOption={false}
                    defaultActiveFirstOption={false}
                    labelInValue={true}
                    showArrow={false}
                    notFoundContent={null}
                    onSearch={handleSearch}
                    placeholder={messages.t('users.user_id')}
                  >
                    {users.map((x) => {
                      return (
                        <Select.Option key={x.id}>{x.full_name}</Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              ) : (
                ''
              )}
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {messages.t('general.submit')}
                </Button>
              </Form.Item>
            </Form>
          ) : null}
        </Col>
      </Row>
    </>
  );
};

TimezoneWizard.propTypes = {
  match: PropTypes.object.isRequired,
  action: PropTypes.string.isRequired,
  location: PropTypes.object,
  history: PropTypes.object,
  startDashboardLoading: PropTypes.func,
  stopDashboardLoading: PropTypes.func,
  user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = {
  startDashboardLoading,
  stopDashboardLoading
};

export default connect(mapStateToProps, mapActionsToProps)(TimezoneWizard);
