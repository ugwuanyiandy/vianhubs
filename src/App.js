import React, {Component} from 'react';
import "./assets/css/App.css";
import "./assets/css/Helpers.css";
import "./assets/css/Colors.css";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import FrontBody from "./layouts/FrontBody";
import DashboardBody from "./layouts/DashboardBody";
import AttendantBody from "./layouts/AttendantBody";
import CashierBody from "./layouts/CashierBody";
import AdminBody from "./layouts/AdminBody"
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import PageLoader from "./components/Loader/PageLoader/PageLoader";
import {AuthRoute} from "./components/Authenticator/Authenticate";
import AddToCartModal from "./components/Cart/AddToCartModal";
import ToastContainer from "./components/Popup/ToastContainer";
import ReceiptPrintPage from "./components/Receipt/ReceiptPrintPage";
import {workerType} from "./utils/Identifiers";

export class App extends Component {
    render() {
        return (
            <Router>
                <ScrollToTop>
                    <Switch>
                        <AuthRoute path="/dashboard" component={DashboardBody}/>
                        <AuthRoute path="/attendant" authorized={[workerType.attendant]} component={AttendantBody}/>
                        <AuthRoute path="/cashier" authorized={[workerType.cashier]} component={CashierBody}/>
                        <AuthRoute path="/admin" authorized={[workerType.owner, workerType.admin]}
                                   component={AdminBody}/>
                        <AuthRoute path="/print/order" component={ReceiptPrintPage}
                                   authorized={[workerType.owner, workerType.admin, workerType.cashier]}/>
                        <Route component={FrontBody}/>
                    </Switch>
                    <PageLoader/>
                    <AddToCartModal/>
                    <ToastContainer/>
                </ScrollToTop>
            </Router>
        )
    }
}

export default App
