import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import {
  checkValidUserEdit,
  cleanObject,
  dashboardLink,
  isAdmin,
  messages,
  showSuccess,
  testStrongPassword,
  unexpectedErrorHandler
} from '../../../common/utils';
import { getUser, saveUser, updateUser } from './actions';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { USERS_PAGE_URI } from '../../../common/pages';
import {
  startDashboardLoading,
  stopDashboardLoading
} from '../../../state/actions/uiActions';
import { connect } from 'react-redux';
import {
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_USER,
  UNVERIFIED_USER,
  VERIFIED_USER
} from '../../../common/constants';
import Unaothirized from '../../../components/ui/Unaothorized/Unaothirized';
import { PasswordInput } from 'antd-password-input-strength';

export const UserWizard = ({
  match,
  history,
  startDashboardLoading,
  stopDashboardLoading,
  action,
  profileUserId,
  user
}) => {
  const [loading, setLoading] = useState(action === 'edit');
  const [data, setData] = useState({});
  const userId = match.params.userId || profileUserId;

  const roles = [
    {
      value: ROLE_USER,
      name: messages.t('users.role_user')
    },
    {
      value: ROLE_MANAGER,
      name: messages.t('users.role_manager')
    }
  ];

  if (isAdmin(user)) {
    roles.push({
      value: ROLE_ADMIN,
      name: messages.t('users.role_admin')
    });
  }

  const verified = [
    {
      value: UNVERIFIED_USER,
      name: messages.t('users.unverified')
    },
    {
      value: VERIFIED_USER,
      name: messages.t('users.verified')
    }
  ];

  useEffect(() => {
    let mounted = true;
    if (action === 'edit') {
      startDashboardLoading();
      getUser(userId).then((res) => {
        if (!mounted) return;
        setLoading(false);
        stopDashboardLoading();
        setData(res.data);
      });
    }
    return () => {
      mounted = false;
      stopDashboardLoading();
    };
  }, [stopDashboardLoading, startDashboardLoading, action, userId]);

  const onFinish = (values) => {
    startDashboardLoading();
    cleanObject(values);
    if (action === 'add') {
      saveUser(values)
        .then((response) => {
          handleResponse(response);
        })
        .catch(() => stopDashboardLoading());
    } else {
      updateUser(userId, values)
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
      if (!profileUserId) {
        history.push(dashboardLink(USERS_PAGE_URI));
      }
    } else {
      unexpectedErrorHandler();
      stopDashboardLoading();
    }
  };

  let initialValues = { verified: VERIFIED_USER, role: ROLE_USER };
  if (!loading && data.email) {
    initialValues = {
      full_name: data.full_name || undefined,
      email: data.email || undefined,
      role: data.role_id || ROLE_USER,
      verified: Object.prototype.hasOwnProperty.call(data, 'verified')
        ? data.verified
        : VERIFIED_USER
    };
  }
  if (initialValues && profileUserId) {
    delete initialValues.verified;
  }

  if (!profileUserId && data && data.role && !checkValidUserEdit(user, data)) {
    return <Unaothirized />;
  }

  return (
    <>
      <Helmet>
        <title>
          {action === 'add'
            ? messages.t('users.title_page_add')
            : messages.t('users.title_page_edit')}
        </title>
      </Helmet>
      <Row type={'flex'} justify={'left'} aling={'left'}>
        <Col xs={24} md={10}>
          {action === 'add' || (!loading && data.email) ? (
            <Form
              data-test={'userWizard'}
              name="userForm"
              layout={'vertical'}
              onFinish={onFinish}
              initialValues={initialValues}
            >
              <Form.Item
                label={messages.t('users.full_name')}
                name="full_name"
                rules={[
                  {
                    required: true,
                    message: messages.t('users.full_name_required')
                  },
                  {
                    min: 4,
                    message: messages.t('register.min_fullname')
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={messages.t('forms.email')}
                name="email"
                autoComplete="none"
                rules={[
                  {
                    required: true,
                    message: messages.t('login.email_required')
                  },
                  {
                    type: 'email',
                    message: messages.t('login.email_invalid')
                  }
                ]}
              >
                <Input autoComplete="none" />
              </Form.Item>
              {!profileUserId ? (
                <Form.Item
                  label={messages.t('users.role')}
                  name="role"
                  rules={[
                    {
                      required: true,
                      message: messages.t('users.role_required')
                    }
                  ]}
                >
                  <Select placeholder={messages.t('users.role')}>
                    {roles.map((x) => {
                      return (
                        <Select.Option key={x.value} value={x.value}>
                          {x.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              ) : (
                ''
              )}
              <Form.Item
                label={messages.t('forms.password')}
                name="password"
                rules={[
                  {
                    required: action === 'add',
                    message: messages.t('login.password_required')
                  },
                  {
                    min: 6,
                    message: messages.t('register.min_password')
                  },
                  () => ({
                    validator(rule, value) {
                      if (!value || testStrongPassword(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        messages.t('register.password_too_weak')
                      );
                    }
                  })
                ]}
              >
                <PasswordInput />
              </Form.Item>
              <Form.Item
                label={messages.t('register.confirm_password')}
                name="password_confirmation"
                rules={
                  action === 'add'
                    ? [
                        {
                          required: true,
                          message: messages.t(
                            'register.confirm_password_required'
                          )
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              messages.t('register.passwords_do_not_match')
                            );
                          }
                        })
                      ]
                    : [
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (
                              !getFieldValue('password') ||
                              getFieldValue('password') === value
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              messages.t('register.passwords_do_not_match')
                            );
                          }
                        })
                      ]
                }
              >
                <Input.Password autoComplete="on" />
              </Form.Item>
              {!profileUserId ? (
                <Form.Item
                  label={messages.t('users.email_verified')}
                  name="verified"
                  rules={[
                    {
                      required: true,
                      message: messages.t('users.verified_required')
                    }
                  ]}
                >
                  <Select placeholder={messages.t('users.verified')}>
                    {verified.map((x) => {
                      return (
                        <Select.Option key={x.value} value={x.value}>
                          {x.name}
                        </Select.Option>
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

UserWizard.propTypes = {
  match: PropTypes.object.isRequired,
  action: PropTypes.string.isRequired,
  history: PropTypes.object,
  startDashboardLoading: PropTypes.func,
  stopDashboardLoading: PropTypes.func,
  profileUserId: PropTypes.number,
  user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = {
  startDashboardLoading,
  stopDashboardLoading
};

export default connect(mapStateToProps, mapActionsToProps)(UserWizard);
