import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from "../state/store";
import AuthRoute from "../components/utils/AuthRoute";
import ProtectedRoute from "../components/utils/ProtectedRoute";
import Login from './login/Login';
import Home from './home/Home';
import {LOGIN_PAGE_URI, ROOT_PAGE_URI} from "../common/pages";
import 'antd/dist/antd.css';
import ReactDOM from "react-dom";

function Index() {
    return (
        <Provider store={store}>
                <Router>
                    <Switch>
                        <AuthRoute exact path={LOGIN_PAGE_URI} component={Login} />
                        <ProtectedRoute path={ROOT_PAGE_URI} component={Home} />
                    </Switch>
                </Router>
        </Provider>

    );
}

export default Index;


if (document.getElementById('app')) {
    ReactDOM.render(<Index />, document.getElementById('app'));
}
