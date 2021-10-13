import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import PaystackOrderHook from "../../components/Cart/PaystackOrderHook";
import {
    currencyFormat,
    handleAxiosError,
    hidePageLoader,
    parseName,
    showPageLoader,
    useMergeState,
    validateEmail
} from "../../utils/helpers";
import ClipLoader from "react-spinners/ClipLoader";
import cardPaymentImage from '../../assets/images/card-pay.png';
import {getUser} from "../../utils/auth";
import {withRouter} from "react-router-dom";


const UserPayment = props => {

    const [payMethodXhrStatus, setPayMethodXhrStatus] = useMergeState({
        message: '', success: false, error: false, warning: false, loading: false
    });
    const [payXhrStatus, setPayXhrStatus] = useMergeState({
        message: '', success: false, error: false, warning: false, loading: false
    });
    const [orderXhrStatus, setOrderXhrStatus] = useMergeState({
        message: '', success: false, error: false, warning: false, loading: false
    });
    const [method, setMethod] = useState('paystack');

    const user = getUser();
    const [email, setEmail] = useState(user ? user.email : null);
    const [paystackConfig, setPaystackConfig] = useMergeState({
        showModal: false,
        publicKey: null
    });
    const [bankTransferConfig, setBankTransferConfig] = useMergeState({
        name: '', number: '', bank: '', proof_required: false
    });

    const orderData = Object.assign({}, {
        buyer_name: '', total: 0, sub_total: 0, discount: 0,
        buyer_phone: '', reference: '0000000001'
    }, props.order);
    const [order, setOrder] = useState(orderData);

    const verifyPayment = () => {
        showPageLoader();
        Endpoint.verifyPayment(order.reference, method)
            .then((xhr) => {
                setPayXhrStatus({
                    success: true,
                    message: {
                        paystack: 'Payment successful! Redirecting...',
                        bank_transfer: "Awesome! You'll be notified once payment is confirmed.",
                    }[method]
                })
                //Delay so user can see notification
                setTimeout(() => {
                    props.history.push(props.redirectTo ?? '/services')
                }, 5000)
            })
            .catch((e) => {
                setPayXhrStatus({
                    error: true,
                    message: "We could not verify your payment at this time, but we'll keep trying.\n" +
                        "However, you can contact admin with the receipt sent to your email for manual verification"
                })
            })
            .finally(() => {
                hidePageLoader();
            });
    }

    const validate = (options) => {
        if (!method) {
            return "Select payment method"
        } else if (method === 'paystack' && !validateEmail(email)) {
            return "Please enter a valid email address"
        } else if (method === 'paystack' && !paystackConfig.publicKey) {
            return "Something went wrong, please try again later"
        }

    }

    const startPayProcess = (e) => {
        const errorMessage = validate();
        if (errorMessage) {
            setPayXhrStatus({error: true, message: errorMessage})
            return;
        }

        switch (method) {
            case 'paystack':
                payWithPaystack();
                break;
            case 'bank_transfer':
            case 'bitcoin':
                verifyPayment();
                break;
            default:
                setPayXhrStatus({
                    error: true,
                    message: 'Payment not supported'
                })
                break;
        }
    }

    const payWithPaystack = () => {
        const customerName = parseName(order.buyer_name)
        setPaystackConfig({
            email: email,
            phone: order.buyer_phone,
            amount: order.total,
            firstname: customerName.firstName,
            lastname: customerName.lastName,
            reference: order.reference,
            onSuccess: verifyPayment,
            onClose: null,
            showModal: true
        });
    }

    useEffect(() => {
        //Fetch payment methods and settings
        setPayMethodXhrStatus({loading: true})
        Endpoint.getPaymentMethods()
            .then((xhr) => {
                setPaystackConfig({
                    publicKey: xhr.data.data.paystack.public
                })
                setBankTransferConfig(xhr.data.data.bank_transfer)
            }).catch(handleAxiosError)
            .finally(() => setPayMethodXhrStatus({loading: false}));

        //Fetch order
        if (props.orderID) {
            setOrderXhrStatus({loading: true})
            Endpoint.getOrderAsUser(props.orderID)
                .then((xhr) => {
                    setOrder(xhr.data.data)
                }).catch(handleAxiosError)
                .finally(() => setOrderXhrStatus({loading: false}));
        }
    }, []);

    const override = {
        display: 'block',
        margin: '0 auto',
    };
    return <>
        <div className="row">

            <section className="col-lg-8 pt-2 pt-lg-4 pb-4 mb-3">
                <div className="pt-2 px-4 pr-lg-0 pl-xl-5">
                    <h2>Choose Payment Method</h2>

                    {payMethodXhrStatus.loading || orderXhrStatus.loading ?
                        <div className="sweet-loading mt-5 mr-3 text-center">
                            <ClipLoader
                                css={override}
                                size={30}
                                color={"#FF9595"}
                                loading={true}
                            />
                        </div>
                        :
                        <>
                            <div className="">
                                <div className='pb-2'>
                                    <div className="custom-control custom-checkbox">
                                        <input className="custom-control-input" type="radio"
                                               checked={method === 'paystack'} value='paystack'
                                               onChange={(e) => setMethod(e.target.value)}
                                               name='method' id="paystack_radio"/>
                                        <label className="custom-control-label h6" htmlFor="paystack_radio">
                                            <i className="czi-card font-size-lg mr-2 mt-n1 align-middle"/>
                                            Pay With PayStack
                                        </label>
                                    </div>
                                    <div
                                        className={`p-4 grey lighten-4 rounded ${method !== 'paystack' ? 'd-none' : ''}`}>
                                        <p>Proceed to make payment with PayStack</p>
                                        <img src={cardPaymentImage} className='' alt='Supported Cards'/>
                                    </div>
                                </div>
                                {/*<div className='pb-2'>*/}
                                {/*    <div className="custom-control custom-checkbox">*/}
                                {/*        <input className="custom-control-input" type="radio"*/}
                                {/*               checked={method === 'bitcoin'} value='bitcoin'*/}
                                {/*               onChange={(e) => setMethod(e.target.value)}*/}
                                {/*               name='method' id="bitcoin_radio"/>*/}
                                {/*        <label className="custom-control-label h6" htmlFor="bitcoin_radio">*/}
                                {/*            <i className="czi-coin font-size-lg mr-2 mt-n1 align-middle"/>*/}
                                {/*            Pay With Bitcoin</label>*/}
                                {/*    </div>*/}
                                {/*    <div*/}
                                {/*        className={`p-4 grey lighten-4 rounded ${method !== 'bitcoin' ? 'd-none' : ''}`}>*/}
                                {/*        <p>Transfer to the following wallet address and upload a proof of payment</p>*/}
                                {/*        <div>*/}

                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <div className='pb-2'>
                                    <div className="custom-control custom-checkbox">
                                        <input className="custom-control-input" type="radio"
                                               checked={method === 'bank_transfer'} value='bank_transfer'
                                               onChange={(e) => setMethod(e.target.value)}
                                               name='method' id="transfer_radio"/>
                                        <label className="custom-control-label h6" htmlFor="transfer_radio">
                                            <i className="czi-money-box font-size-lg mr-2 mt-n1 align-middle"/>
                                            Bank Transfer</label>
                                    </div>
                                    <div
                                        className={`p-4 grey lighten-4 rounded ${method !== 'bank_transfer' ? 'd-none' : ''}`}>
                                        <p>
                                            Transfer the total of {currencyFormat(order.total)} to the bank
                                            account
                                            below{parseInt(bankTransferConfig.proof_required) ? ', upload proof of payment' : ''} and
                                            click "I've made Payment"
                                        </p>
                                        <div>
                                            <p>Account Name: <b>{bankTransferConfig.name}</b></p>
                                            <p>Account Number: <b>{bankTransferConfig.number}</b></p>
                                            <p>Bank: <b>{bankTransferConfig.bank}</b></p>
                                        </div>
                                        <small>
                                            You can contact admin on <b>+234 704 841 3179, +234 705 253 0185</b> or
                                            email <b>info@vianhubs.com</b> to confirm your payment.
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                </div>
            </section>
            <aside className="col-lg-4">
                <hr className="d-lg-none"/>
                <div className="cz-sidebar-static h-100 ml-auto border-left">
                    <div className="widget mb-3">
                        <h2 className="widget-title text-center">Order summary</h2>

                        <div className="border-bottom mb-4">
                            <h3 className="text-center mb-3 pb-1">
                                {order.reference}<br/>
                                <small className='small'>Order No</small>
                            </h3>
                            <hr/>
                            <p className='small py-2 m-0'>Subtotal: {currencyFormat(order.sub_total)}</p>
                            <hr/>
                            <p className='small py-2 m-0'>Discount: {currencyFormat(order.discount)}</p>
                            <hr/>
                            <p className='small py-2 m-0'>VAT (7.5%): {currencyFormat(order.tax)}</p>
                            <hr/>
                            <h6 className="m-0 py-4">Amount: {currencyFormat(order.total)}</h6>
                        </div>

                        <div className={`border-bottom mb-4 pb-3 ${method !== 'paystack' ? 'd-none' : ''}`}>
                            <p>Please enter an email for your receipt</p>
                            <input type="email" placeholder="Email Address" name="email"
                                   defaultValue={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   className="form-control form-control-sm prepended-form-control my-2"/>
                        </div>

                        {payXhrStatus.error || payXhrStatus.success ?
                            <div className={(payXhrStatus.error ? 'bg-danger' : 'bg-success')
                            + " fade show border-rad-1 text-center p-2 mb-3"}>
                                <p className="small text-light mb-0">
                                    <i className="czi-bell mr-2"/> {payXhrStatus.message}
                                </p>
                            </div>
                            : null
                        }

                        <div>
                            <button className="btn btn-pink btn-shadow btn-block mt-4"
                                    disabled={payMethodXhrStatus.loading || orderXhrStatus.loading}
                                    onClick={startPayProcess}>
                                <i className="czi-cart mr-2"/>
                                {{
                                    paystack: 'Proceed with PayStack',
                                    bank_transfer: "I've made Payment",
                                    none: 'Proceed'
                                }[method]}
                            </button>
                        </div>

                    </div>
                </div>
            </aside>
        </div>

        {paystackConfig.showModal ? <PaystackOrderHook {...paystackConfig}/> : ''}

    </>
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserPayment));