import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import {Link} from "react-router-dom";


const ContactCards = (props) => {
    return <>
        <section className="container-fluid pt-grid-gutter bg-white">
            <div className="row">
                <div className="col-xl-3 col-md-6 mb-grid-gutter">
                    <div className="card">
                        <div className="card-body text-center pb-2">
                            <i className="czi-location h3 mt-2 mb-4 text-primary"/>
                            <h3 className="h6 mb-2">Main store address</h3>
                            <p className="font-size-sm text-muted mb-1">
                                Shop 20, Cappador's place plaza, 134 Adetokunbo Ademola Cres, Wuse 2, Abuja</p>
                            <Link className="font-size-sm text-primary" to={'/direction'}>Click to see map
                                <i className="czi-arrow-right align-middle ml-1"/>
                            </Link>
                        </div>
                    </div>
                </div>
                
                <div className="col-xl-3 col-md-6 mb-grid-gutter">
                    <div className="card">
                        <div className="card-body text-center">
                            <i className="czi-time h3 mt-2 mb-4 text-primary"/>
                            <h3 className="h6 mb-3">Working hours</h3>
                            <ul className="list-unstyled font-size-sm text-muted mb-0">
                                <li>Mon - Fri: 10AM - 7PM</li>
                                <li className="mb-0">Sta: 11AM - 5PM</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="col-xl-3 col-md-6 mb-grid-gutter">
                    <div className="card">
                        <div className="card-body text-center">
                            <i className="czi-phone h3 mt-2 mb-4 text-primary"/>
                            <h3 className="h6 mb-3">Phone numbers</h3>
                            <ul className="list-unstyled font-size-sm mb-0">
                                <li>
                                    <a className="nav-link-style" href="tel:07048413179">
                                        +234 704 841 3179</a></li>
                                <li className="mb-0">
                                    <a className="nav-link-style" href="tel:07052530185">
                                        +234 705 253 0185</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="col-xl-3 col-md-6 mb-grid-gutter">
                    <div className="card">
                        <div className="card-body text-center">
                            <i className="czi-mail h3 mt-2 mb-4 text-primary"/>
                            <h3 className="h6 mb-3">Email addresses</h3>
                            <ul className="list-unstyled font-size-sm mb-0">
                                <li><span className="text-muted mr-1">Customers:</span><a
                                    className="nav-link-style"
                                    href="mailto:+108044357260">info@vianhubs.com</a></li>
                                <li className="mb-0"><span
                                    className="text-muted mr-1">Tech support:</span><a
                                    className="nav-link-style"
                                    href="mailto:support@example.com">support@vianhubs.com</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactCards);