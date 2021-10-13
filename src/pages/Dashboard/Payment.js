import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import UserPayment from "../../components/Cart/UserPayment";
import {Link} from "react-router-dom";


const Payment = props => {
    return <>
        <div className="border-bottom mt-lg-2 mt-5 pt-5 pb-2 mb-2">
            <nav className="mb-4 mt-5" aria-label="breadcrumb">
                <ol className="breadcrumb flex-lg-nowrap">
                    <li className="breadcrumb-item">
                        <Link className="text-nowrap" to="">
                            <i className="czi-home"/>Home
                        </Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link className="text-nowrap" to="">
                            <i className="czi-"/> Dashboard
                        </Link>
                    </li>

                    <li className="breadcrumb-item text-nowrap active" aria-current="page">Payment</li>
                </ol>
            </nav>

            <h2 className="mt-lg-1 pt-lg-1">Payment</h2>
        </div>

        <div className="container mt-4 mb-5 pb-3">
            <div className="bg-light box-shadow-lg rounded-lg overflow-hidden">
                <UserPayment redirectTo={'/dashboard/services'}
                             order={props.history.location?.order}
                             orderID={props.match?.params?.orderId}/>
            </div>
        </div>

    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment);