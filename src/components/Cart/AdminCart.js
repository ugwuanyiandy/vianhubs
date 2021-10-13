import React, {useState} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import CartItems from "./CartItems";
import Endpoint from "../../utils/endpoint";
import {clearCart, printOrder} from "../../utils/cart";
import Checkout from "./Checkout";


const AdminCart = (props) => {

    const [printReceiptStatus, setPrintReceiptStatus] = useState(true);

    const checkoutSuccess = (res) => {
        clearCart();
        if (printReceiptStatus)
            printOrder(res.data.data);
    };

    return <>
        <div className="row">
            <div className="col-lg-7 pt-2 pt-lg-4 pb-4 mb-3">
                <CartItems/>
            </div>

            <aside className="col-lg-5">
                <hr className="d-lg-none"/>
                <div className="cz-sidebar-static h-100 ml-auto border-left">
                    <Checkout checkoutSuccess={checkoutSuccess} endpoint={Endpoint.cashierCheckout}
                              errorCheck={() => false}>
                        <div className="custom-control custom-checkbox">
                            <input className="custom-control-input" type="checkbox"
                                   checked={printReceiptStatus}
                                   onChange={(e) => setPrintReceiptStatus(e.target.checked)}
                                   name='receipt' id="receipt"/>
                            <label className="custom-control-label" htmlFor="receipt">Print Receipt</label>
                        </div>
                    </Checkout>
                </div>
            </aside>
        </div>
    </>
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminCart);
