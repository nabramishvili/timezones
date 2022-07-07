import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {LOGIN_PAGE_URI} from "../../common/pages";

const ProtectedRoute = ({ component: Component, authenticated, ...rest }) => (

    <Route
        {...rest}
        render={(props) =>
            authenticated === false ? <Redirect to={LOGIN_PAGE_URI} /> : <Component {...props} />
        }
    />
);

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
});

ProtectedRoute.propTypes = {
    user: PropTypes.object
};

export default connect(mapStateToProps)(ProtectedRoute);
