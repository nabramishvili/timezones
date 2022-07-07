import React from 'react';
import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import {
  PROFILE_PAGE_URI,
  ROOT_PAGE_URI,
  TIMEZONES_PAGE_URI,
  USERS_PAGE_URI
} from '../../../common/pages';
import TimezonesList from '../../../pages/dashboard/timezones/TimezonesList';
import TimezoneWizard from '../../../pages/dashboard/timezones/TimezoneWizard';
import { dashboardLink } from '../../../common/utils';
import TimezoneView from '../../../pages/dashboard/timezones/TimezoneView';
import UsersList from '../../../pages/dashboard/users/UsersList';
import UserWizard from '../../../pages/dashboard/users/UserWizard';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const DashboardRouter = ({ history, user }) => {
  return (
    <DashboardLayout history={history}>
      <Switch>
        <Route exact path={ROOT_PAGE_URI}>
          <Redirect to={`${ROOT_PAGE_URI}${TIMEZONES_PAGE_URI}`} />
        </Route>
        <ProtectedRoute
          exact
          key="my-timezones"
          path={dashboardLink(TIMEZONES_PAGE_URI)}
          component={TimezonesList}
        />
        <ProtectedRoute
          exact
          key="add-timezone"
          path={dashboardLink(TIMEZONES_PAGE_URI + '/add')}
          component={TimezoneWizard}
          action={'add'}
        />
        <ProtectedRoute
          exact
          key="view-timezone"
          path={dashboardLink(TIMEZONES_PAGE_URI + '/view/:timezoneId')}
          component={TimezoneView}
        />
        <ProtectedRoute
          exact
          key="edit-timezone"
          path={dashboardLink(TIMEZONES_PAGE_URI + '/edit/:timezoneId')}
          component={TimezoneWizard}
          action={'edit'}
        />
        <ProtectedRoute
          exact
          key="user-timezones"
          path={dashboardLink(USERS_PAGE_URI + `/:userId` + TIMEZONES_PAGE_URI)}
          component={TimezonesList}
        />
        <ProtectedRoute
          exact
          key="user-timezones-add"
          path={dashboardLink(
            USERS_PAGE_URI + `/:userId` + TIMEZONES_PAGE_URI + '/add'
          )}
          action={'add'}
          component={TimezoneWizard}
        />
        <ProtectedRoute
          exact
          key="all-timezones"
          path={dashboardLink(TIMEZONES_PAGE_URI + '/all')}
          component={TimezonesList}
          action={'all'}
        />
        <ProtectedRoute
          exact
          key="users-list"
          path={dashboardLink(USERS_PAGE_URI)}
          component={UsersList}
        />
        <ProtectedRoute
          exact
          key="add-user"
          path={dashboardLink(USERS_PAGE_URI + '/add')}
          component={UserWizard}
          action={'add'}
        />
        <ProtectedRoute
          exact
          key="edit-user"
          path={dashboardLink(USERS_PAGE_URI + '/edit/:userId')}
          component={UserWizard}
          action={'edit'}
        />
        <ProtectedRoute
          exact
          key="profile"
          path={dashboardLink(PROFILE_PAGE_URI)}
          profileUserId={user.id}
          component={UserWizard}
          action={'edit'}
        />
      </Switch>
    </DashboardLayout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
});

DashboardRouter.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(DashboardRouter);
