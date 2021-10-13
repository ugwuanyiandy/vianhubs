import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import {Link} from "react-router-dom";
import ServiceCardCollection from "../../components/Cards/Services/ServiceCardCollection";

const CashierServices = props => {

    return <>
        <div className="border-bottom mt-lg-2 mt-5 pt-5 pb-2 mb-2">
            <nav className="mb-4 mt-5" aria-label="breadcrumb">
                <ol className="breadcrumb flex-lg-nowrap">
                    <li className="breadcrumb-item">
                        <Link className="text-nowrap" to="/admin">
                            <i className="czi-home"/>
                            Home
                        </Link>
                    </li>

                    <li className="breadcrumb-item">
                        <Link className="text-nowrap" to="">
                            <i className="czi-"/>Dashboard
                        </Link>
                    </li>

                    <li className="breadcrumb-item text-nowrap active" aria-current="page">Services</li>
                </ol>
            </nav>

            <h2 className="mt-lg-1 pt-lg-1">Services</h2>
        </div>

        <div className="pt-1 pb-5">
            <div className="row">
                <ServiceCardCollection cart={'/cashier/checkout'}/>
            </div>
        </div>

    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(CashierServices);