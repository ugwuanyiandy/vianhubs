import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import {Link} from "react-router-dom";
import ServiceCardCollection from "../../components/Cards/Services/ServiceCardCollection";

const Services = props => {

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
                            <i className="czi-"/>Dashboard
                        </Link>
                    </li>

                    <li className="breadcrumb-item text-nowrap active" aria-current="page">Services</li>
                </ol>
            </nav>

            <div className="d-flex justify-content-between flex-wrap align-items-center">
                <h2 className="mt-lg-1 pt-lg-1">Services</h2>

                <Link className="btn btn-pink mt-2" to="/dashboard/cart">
                    <i className="czi-cart mr-1 ml-n1"/> Go to Cart
                </Link>
            </div>

        </div>

        <div className="pt-1 pb-5">
            <section>
                <div className="pt-1 pb-5">
                    <h1 className="h4 text-dark mb-0 mt-4">All Services</h1>

                    <section className="mb-5 pb-5 mt-3">
                        <div className="row">
                            <ServiceCardCollection cart={'/dashboard/cart'}/>
                        </div>
                    </section>

                </div>

            </section>
        </div>

    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(Services);