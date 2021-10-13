import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../../redux/actions";
import saloon from "../../../assets/images/asset2.png"
import {currencyFormat, time_convert} from "../../../utils/helpers";
import LinesEllipsis from "react-lines-ellipsis";
import AddToCartButton from "../../Cart/AddToCartButton";

const ServiceCard = ({service, cart}) => {
    return <>
        <div className="col-lg-3 col-md-6 mt-3">
            <div className="card">
                <div className="card-top-img">
                    <img src={service.image ? service.image : saloon} className=''
                         alt=""/>
                </div>

                <div className="card-body">

                    <h6 className="card-title font-weight-bold">
                        <LinesEllipsis text={service.name} maxLine='2'
                                       ellipsis='...'
                                       trimRight basedOn='letters'/>
                    </h6>

                    <div className="d-flex justify-content-between">
                        <div>
                            {
                                service.old_cost ?
                                    <p className="product-meta d-block font-size-sm pb-0 mb-0 strikethrough-red">
                                        {currencyFormat(service.old_cost)}
                                    </p>
                                    :
                                    null
                            }

                            <h6 className="text-green-dark">
                                {currencyFormat(service.cost)}
                            </h6>
                        </div>

                        <p className="card-text font-size-sm text-dark">
                            {/*<span className="text-sm">Duration:</span> */}
                            {time_convert(service.duration)}
                        </p>
                    </div>

                    <AddToCartButton service={service} cart={cart}
                                     className="btn btn-sm btn-block btn-outline-green-dark">
                        <i className="czi-cart mr-2"/> Add to cart
                    </AddToCartButton>
                </div>
            </div>
        </div>
    </>
}


export default connect(mapStateToProps, mapDispatchToProps)(ServiceCard);
