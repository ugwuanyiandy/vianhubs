import React, {lazy, Suspense} from 'react';
import Header from "./CashierHeader";
import Footer from "./DashboardFooter";
import {Redirect, Route, Switch} from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import "../assets/css/Dashboard.css";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../redux/actions";

import CashierDash from "../pages/Cashier/Dashboard";
import CashierServices from "../pages/Cashier/CashierServices";
import CashierCheckout from "../pages/Common/WorkerCheckout";
import CashierAppointments from "../pages/Common/WorkerAppointments";
import CashierOrders from "../pages/Common/WorkerOrders";
import CashierAttendantSchedule from "../pages/Cashier/AttendantSchedule";

const PageNotFound = lazy(() => import('../pages/PageNotFound'));

const CashierBody = (props) => {
    return (
        <>
            <div className={props[stateKeys.PAGE_CLASS] + ' container-fluid'}>
                <section className="sidenav-enabled row pb-3 pb-md-4">
                    <div className="col-xl-12">
                        <Header/>
                        <ErrorBoundary>
                            <Suspense fallback={<p>Loading...</p>}>
                                <Switch>
                                    <Route path={'/cashier/home'} component={CashierDash} exact={true}/>
                                    <Route path={'/cashier/services'} component={CashierServices} exact={true}/>
                                    <Route path={'/cashier/checkout'} component={CashierCheckout} exact={true}/>
                                    <Route path={'/cashier/appointments'} component={CashierAppointments} exact={true}/>
                                    <Route path={'/cashier/orders'} component={CashierOrders} exact={true}/>
                                    <Route path={'/cashier/attendantSchedule'} component={CashierAttendantSchedule}
                                           exact={true}/>
                                    <Redirect from={'/cashier'} to={'/cashier/home'} exact={true}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(CashierBody);
