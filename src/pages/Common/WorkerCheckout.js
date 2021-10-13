import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import {Link} from "react-router-dom";
import AdminCart from "../../components/Cart/AdminCart";

const WorkerCheckout = () => {

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

                    <li className="breadcrumb-item text-nowrap active" aria-current="page">Checkout</li>
                </ol>
            </nav>

            <div className="d-flex flex-wrap justify-content-between align-items-center">
                <h2 className="mt-lg-1 pt-lg-1">Checkout</h2>
                <Link className="btn btn-outline-green-dark mt-2" to="/admin/createOrder">
                    <i className="czi-gift mr-1 ml-n1"/> Back to Services
                </Link>
            </div>
        </div>

        <div className="pt-1 pb-5">
            <section>
                <div className="pt-1 pb-5">
                    <section className="mb-5 pb-5">
                        <div className="mt-3">
                            <div className="container mb-5 pb-3">
                                <div className="bg-light box-shadow-lg rounded-lg overflow-hidden min-vh-50">
                                    <AdminCart/>
                                </div>
                            </div>

                        </div>
                    </section>
                </div>
            </section>
        </div>

    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkerCheckout);