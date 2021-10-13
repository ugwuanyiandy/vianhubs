import React, {lazy, Suspense} from 'react';
import Header from "./AdminHeader";
import Footer from "./DashboardFooter";
import {Redirect, Route, Switch} from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import "../assets/css/Dashboard.css";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../redux/actions";
import AdminDash from "../pages/Admin/Dashboard";
import ManageShopWorkers from "../pages/Admin/ManageShopWorkers"
import ServiceWorkers from "../pages/Admin/ServiceWorkers"
import ManageServices from "../pages/Admin/ManageServices"
import ManageCoupons from "../pages/Admin/ManageCoupons"
import CreateOrder from "../pages/Common/CreateOrder"
import ViewWorkerProfile from "../pages/Admin/ViewWorkerProfile"
import ManageCustomers from "../pages/Admin/ManageCustomers"
import ShopEarnings from "../pages/Admin/ShopEarnings"
import CustomerReviews from "../pages/Admin/CustomerReviews"
import Settings from "../pages/Admin/Settings"
import ShopCategories from "../pages/Admin/ShopCategories"
import Orders from "../pages/Common/WorkerOrders";
import Appointments from "../pages/Common/WorkerAppointments";
import CartItems from "../pages/Admin/CartItems";
import Checkout from "../pages/Common/WorkerCheckout";


const PageNotFound = lazy(() => import('../pages/Front/ForgotPassword'));

const AdminBody = (props) => {

    return (
        <>
            <div className={props[stateKeys.PAGE_CLASS] + ' container-fluid'}>
                <section className="sidenav-enabled row pb-3 pb-md-4">
                    <div className="col-xl-12">
                        <Header/>
                        <ErrorBoundary>
                            <Suspense fallback={<p>Loading...</p>}>
                                <Switch>
                                    <Route path={'/admin/home'} component={AdminDash} exact={true}/>
                                    <Route path={'/admin/ManageShopWorkers'} component={ManageShopWorkers}/>
                                    <Route path={'/admin/ServiceWorkers'} component={ServiceWorkers}/>
                                    <Route path={'/admin/ManageShopServices'} component={ManageServices}/>
                                    <Route path={'/admin/ManageShopCoupons'} component={ManageCoupons}/>
                                    <Route path={'/admin/CartItems'} component={CartItems}/>
                                    <Route path={'/admin/ManageOrders'} component={Orders}/>
                                    <Route path={'/admin/ManageAppointments'} component={Appointments}/>
                                    <Route path={'/admin/CreateOrder'} component={CreateOrder}/>
                                    <Route path={'/admin/Checkout'} component={Checkout}/>
                                    <Route path={'/admin/WorkerProfile'} component={ViewWorkerProfile}/>
                                    <Route path={'/admin/ManageShopCustomers'} component={ManageCustomers}/>
                                    <Route path={'/admin/ShopEarnings'} component={ShopEarnings}/>
                                    <Route path={'/admin/ShopSettings'} component={Settings}/>
                                    <Route path={'/admin/CustomerReviews'} component={CustomerReviews}/>
                                    <Route path={'/admin/ShopCategories'} component={ShopCategories}/>

                                    <Redirect from={'/admin'} to={'/admin/home'} exact={true}/>

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

export default connect(mapStateToProps, mapDispatchToProps)(AdminBody);
