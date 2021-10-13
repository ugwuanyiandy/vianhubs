import React from 'react';
import {Redirect, Route, withRouter} from "react-router-dom";
import {workerType} from "../../utils/Identifiers";
import {getUser, loadUserInfo, userLoggedIn} from "../../utils/auth";

export const AuthRoute = withRouter(({component: Component, path, authorized = [], ...rest}) => {
    if (userLoggedIn()) {
        const user = getUser();
        if (!user) {
            //Update full details from server
            loadUserInfo();
        }

        //Authorization
        if (authorized.length && user) {
            const userType = user?.worker_profile?.type?.key;
            if (!authorized.includes(userType)) {
                return <Redirect from={path} to={`/login`}/>
            }
        }

        return <Route path={path} component={Component} {...rest}/>
    } else
        return <Redirect from={path} to={`/login`}/>
})

export const UnAuthRoute = withRouter(({component: Component, path, ...rest}) => {
    const user = getUser();
    if (userLoggedIn() && user) {
        switch (user?.worker_profile?.type?.key) {
            case workerType.owner:
            case workerType.admin:
                return <Redirect from={path} to={`/admin`}/>
            case workerType.cashier:
                return <Redirect from={path} to={`/cashier`}/>
            case workerType.attendant:
                return <Redirect from={path} to={`/attendant`}/>
            case workerType.customer:
            default:
                return <Redirect from={path} to={`/dashboard`}/>
        }
    } else
        return <Route path={path} component={Component} {...rest}/>

})