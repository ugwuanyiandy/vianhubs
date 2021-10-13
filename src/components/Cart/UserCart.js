import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import CartItems from "./CartItems";
import Checkout from "./Checkout";
import Endpoint from "../../utils/endpoint";
import {clearCart} from "../../utils/cart";
import {withRouter} from "react-router-dom";


const UserCart = (props) => {

    const checkoutSuccess = xhr => {
        clearCart();

        const order = xhr.data.data;
        props.history.push({
            pathname: props.paymentPage ?? '/payment',
            order: order
        })
    }

    const validate = (options) => {

    }

    return <>
        <div className="row">
            <div className="col-lg-7 pt-2 pt-lg-4 pb-4 mb-3">
                <CartItems/>
            </div>
            <aside className="col-lg-5">
                <hr className="d-lg-none"/>
                <div className="cz-sidebar-static h-100 ml-auto border-left">
                    <Checkout checkoutSuccess={checkoutSuccess}
                              endpoint={Endpoint.customerCheckout}
                              errorCheck={validate}
                              buttonText={'Secure Checkout'}
                    />
                </div>
            </aside>
        </div>

    </>
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserCart));
