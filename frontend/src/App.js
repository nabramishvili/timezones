import React, { useEffect } from 'react';
import store from './state/store';
import MainLayout from './templates/MainLayout/MainLayout';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-multi-lang/lib';
import { checkAuthenticated, messages } from './common/utils';
import './App.css';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MainRouter from './components/utils/Routers/MainRouter';

function App({ user }) {
  messages.t = useTranslation();
  useEffect(() => {
    //initial authorization check which also loads current authenticated user (if any)
    checkAuthenticated(store, true);
    setInterval(() => {
      //check if token needs refreshing and refresh if it does
      checkAuthenticated(store);
    }, 60000);
  }, []);

  return (
    <>
      <Helmet>
        <title>{messages.t('general.title')}</title>
        <meta name="description" content={messages.t('general.description')} />
      </Helmet>
      <MainLayout>{!user.loading ? <MainRouter /> : ''}</MainLayout>
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.user
});

App.propTypes = {
  user: PropTypes.object
};

export default connect(mapStateToProps)(App);
