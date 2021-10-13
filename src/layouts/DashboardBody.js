import React, {lazy, Suspense} from 'react';
import Header from "./DashboardHeader";
import Footer from "./DashboardFooter";
import {Redirect, Route, Switch} from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";

import "../assets/css/Dashboard.css";

import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../redux/actions";
import ForgotPassword from "../pages/Front/ForgotPassword";
import Services from "../pages/Dashboard/Services";
import Cart from "../pages/Dashboard/Cart";
import Checkout from "../pages/Dashboard/Payment";
import History from "../pages/Dashboard/History";
import Profile from "../pages/Dashboard/Profile";
import Dashboard from "../pages/Dashboard/Dashboard";

const PageNotFound = lazy(() => import('../pages/PageNotFound'));

const DashboardBody = (props) => {
    return (
        <>
            <div className={props[stateKeys.PAGE_CLASS] + ' container-fluid'}>
                <section className="sidenav-enabled row pb-3 pb-md-4">
                    <div className="col-xl-12">
                        <Header/>
                        <ErrorBoundary>
                            <Suspense fallback={<p>Loading...</p>}>
                                <Switch>
                                    <Route path={'/forgot'} component={ForgotPassword}/>
                                    <Route path={'/dashboard/home'} component={Dashboard} exact={true}/>
                                    <Route path={'/dashboard/services'} component={Services}/>
                                    <Route path={'/dashboard/cart'} component={Cart}/>
                                    <Route path={'/dashboard/payment/:orderId?'} component={Checkout}/>
                                    <Route path={'/dashboard/history'} component={History}/>
                                    <Route path={'/dashboard/profile'} component={Profile}/>

                                    <Redirect from={'/dashboard'} to={'/dashboard/home'} exact={true}/>
                                    <Route component={PageNotFound}/>
                                </Switch>
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                </section>
                <Footer/>
            </div>
        </>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardBody);
