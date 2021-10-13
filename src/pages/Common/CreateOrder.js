import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import hairm from "../../assets/images/asset2.png"
import LinesEllipsis from "react-lines-ellipsis";
import "react-datepicker/dist/react-datepicker.css";
import {currencyFormat, time_convert} from "../../utils/helpers";
import {Link} from "react-router-dom";
import AddToCartButton from "../../components/Cart/AddToCartButton";
import ClipLoader from "react-spinners/ClipLoader";

const CreateOrder = (props) => {

    const override = {
        display: 'block',
        margin: '0 auto',
    };

    return <>
        <div className="border-bottom mt-lg-2 mt-5 pt-5 pb-2 mb-2">
            <nav className="mb-4 mt-5" aria-label="breadcrumb">
                <ol className="breadcrumb flex-lg-nowrap">
                    <li className="breadcrumb-item">
                        <Link className="text-nowrap" to="">
                            <i className="czi-home"/>Home
                        </Link>
                    </li>

                    <li className="breadcrumb-item text-nowrap active" aria-current="page">Dashboard</li>
                </ol>
            </nav>

            <div className="d-flex flex-wrap justify-content-between align-items-center">
                <h2 className="mt-lg-1 pt-lg-1 mt-2">Create Order</h2>
                <Link className="btn btn-pink mt-2" to="/admin/Checkout">
                    <i className="czi-cart mr-1 ml-n1"/> Checkout
                </Link>
            </div>

        </div>

        <div className="pt-1 pb-5">


            <section>
                <div className="pt-1 pb-5">
                    <h1 className="h4 text-dark mb-0 mt-4">Available Services</h1>

                    <section className="mb-5 pb-5">
                        <div className="mt-3">

                            <div className="row">
                                {props[stateKeys.SERVICES].length ?
                                    props[stateKeys.SERVICES].map((service, index) => {
                                        return (
                                            <div key={index} className="col-lg-3">
                                                <div className="card box-shadow">
                                                    <img src={hairm} className="card-img-top" alt="Card image"/>
                                                    <div className="card-body">

                                                        <h6 className="card-title font-weight-bold">
                                                            <LinesEllipsis
                                                                text={service.name}
                                                                maxLine='2'
                                                                ellipsis='...'
                                                                trimRight
                                                                basedOn='letters'
                                                            />
                                                        </h6>

                                                        <div
                                                            className="d-flex flex-wrap justify-content-between">

                                                            <div>
                                                                {
                                                                    service.old_cost ?
                                                                        <p className="product-meta d-block font-size-sm pb-0 mb-0 strikethrough-red">
                                                                            {currencyFormat(service.old_cost)}
                                                                        </p>
                                                                        :
                                                                        null
                                                                }

                                                                <h6 className="text-accent">
                                                                    {currencyFormat(service.cost)}
                                                                </h6>
                                                            </div>


                                                            <p className="card-text font-size-sm text-dark">
                                                                {time_convert(service.duration)}
                                                            </p>
                                                        </div>

                                                        <AddToCartButton service={service} cart={'/admin/Checkout'}
                                                                         className="btn btn-sm btn-block btn-green-dark">
                                                            <i className="czi-cart mr-2"/> Add to cart
                                                        </AddToCartButton>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    <div className='mx-auto text-center'>
                                        <div className="sweet-loading mt-5 mr-3">
                                            <ClipLoader
                                                css={override}
                                                size={30}
                                                color={"#FF9595"}
                                                loading={true}
                                            />
                                        </div>
                                    </div>
                                }

                            </div>

                        </div>
                    </section>

                </div>

            </section>
        </div>

    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrder);