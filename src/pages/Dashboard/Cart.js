import {Link} from "react-router-dom";
import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import UserCart from "../../components/Cart/UserCart";

const Cart = () => {

    return <>
        <div className="border-bottom mt-lg-2 mt-5 pt-5 pb-2 mb-2">
            <nav className="mb-4 mt-5" aria-label="breadcrumb">
                <ol className="breadcrumb flex-lg-nowrap">
                    <li className="breadcrumb-item">
                        <Link className="text-nowrap" to="/">
                            <i className="czi-home"/>Home
                        </Link>
                    </li>

                    <li className="breadcrumb-item">
                        <Link className="text-nowrap" to="/dashboard/home">
                            <i className="czi-"/> Dashboard
                        </Link>
                    </li>

                    <li className="breadcrumb-item text-nowrap active" aria-current="page">Cart</li>
                </ol>
            </nav>

            <h2 className="mt-lg-1 pt-lg-1">Cart</h2>
        </div>


        <div className="pt-1 pb-5">
            <section>
                <div className="pt-1 pb-5">
                    <section className="mb-5">
                        <div className="mt-3">
                            <div className="container mb-5 pb-3">
                                <div className="bg-light box-shadow-lg rounded-lg overflow-hidden min-vh-50">
                                    <UserCart paymentPage={'/dashboard/payment'}/>
                                </div>
                            </div>

                        </div>
                    </section>

                </div>

            </section>
        </div>
    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);