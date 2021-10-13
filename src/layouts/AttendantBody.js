import React, {lazy, Suspense} from 'react';
import Header from "./AttendantHeader";
import Footer from "./DashboardFooter";
import {Redirect, Route, Switch} from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import "../assets/css/Dashboard.css";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../redux/actions";

import AttendantSchedule from "../pages/Attendant/Schedule";
import AttendantEarnings from "../pages/Attendant/Earnings";
import AttendantDashboard from "../pages/Attendant/Dashboard";

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
                                    <Route path={'/attendant/home'} component={AttendantDashboard} exact={true}/>
                                    <Route path={'/attendant/schedule'} component={AttendantSchedule}/>
                                    <Route path={'/attendant/earnings'} component={AttendantEarnings}/>

                                    <Redirect from={'/attendant'} to={'/attendant/home'} exact={true}/>

                                    <Route component={PageNotFound}/>
                                </Switch>
                            </Suspense>
                        </ErrorBoundary>
                        {/*<Dialog/>*/}
                    </div>
                </section>
                <Footer/>
            </div>
        </>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardBody);
