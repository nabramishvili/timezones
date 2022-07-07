import React from 'react';
import { Form, Input, Button, Col, Row, Card, Space } from 'antd';
import PropTypes from 'prop-types';
import Logo from '../../components/ui/Logo/Logo';
import { resetPassword } from '../../state/actions/userActions';
import { connect } from 'react-redux';
import { messages } from '../../common/utils';
import { Link } from 'react-router-dom';
import { LOGIN_PAGE_URI } from '../../common/pages';
import { Helmet } from 'react-helmet';

export const ForgotPassword = (props) => {
  const onFinish = (values) => {
    props.resetPassword(values);
  };

  return (
    <>
      <Helmet>
        <title>{messages.t('forgotpassword.title')}</title>
      </Helmet>
      <Row
        type={'flex'}
        justify={'center'}
        aling={'middle'}
        style={{ marginTop: '20px' }}
      >
        <Col xs={24} md={10}>
          <Card>
            <Logo width={300} align={'center'} />
            <Form
              name="forgotPasswordForm"
              data-test={'forgotPasswordForm'}
              layout={'vertical'}
              onFinish={onFinish}
            >
              <Form.Item
                label={messages.t('forms.email')}
                name="email"
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
                <Input />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  data-test={'forgotPasswordSubmit'}
                >
                  {messages.t('general.submit')}
                </Button>
              </Form.Item>
            </Form>
            <Space size={15}>
              <Link to={LOGIN_PAGE_URI}>{messages.t('login.title')}</Link>
            </Space>
          </Card>
        </Col>
      </Row>
    </>
  );
};

ForgotPassword.propTypes = {
  resetPassword: PropTypes.func.isRequired
};

const mapActionsToProps = {
  resetPassword
};

export default connect(null, mapActionsToProps)(ForgotPassword);
