import React, {useRef, useState} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import {currencyFormat, handleAxiosErrorWithState, useMergeState} from "../../utils/helpers";
import ClipLoader from "react-spinners/ClipLoader";
import Endpoint from "../../utils/endpoint";
import {getCart, getCartAmount, getCartCount} from "../../utils/cart";


const Checkout = (props) => {

    let cartAmount = getCartAmount();
    let cartCount = getCartCount();

    const [discount, setDiscount] = useState(0);

    const [checkoutData, setCheckoutData] = useMergeState({
        coupon: null,
        buyer_name: null,
        phone: null,
        description: null
    });

    const [xhrStatus, setXhrStatus] = useMergeState({
        message: '', success: false, error: false, warning: false, loading: false
    });

    let timer = useRef();
    const handleCoupon = (e) => {
        setXhrStatus({message: '', success: false, error: false});
        if (timer.current)
            clearTimeout(timer.current)

        const coupon = e.target.value;
        setCheckoutData({coupon: coupon})
        if (coupon) {
            timer.current = setTimeout(() => {
                //Show page loader
                setXhrStatus({loading: true})
                Endpoint.estimateCoupon(coupon, cartAmount)
                    .then((xhr) => setDiscount(xhr.data.data.discount))
                    .catch((e) => handleAxiosErrorWithState(e, setXhrStatus))
                    .finally(() => setXhrStatus({loading: false}))
            }, 1000)
        }
    };

    const changeText = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setCheckoutData({
            [name]: value
        });
    };

    const checkout = () => {
        if (!cartCount) {
            setXhrStatus({message: 'Cart is empty', success: false, error: true});
            return false
        } else if (!checkoutData.buyer_name || !checkoutData.buyer_phone) {
            setXhrStatus({message: 'Form is incomplete', success: false, error: true});
            return false
        } else {
            let cart_items = [];
            const cart = getCart();
            const cartKeys = Object.keys(cart);
            cartKeys.forEach((key, i) => cart_items.push({
                service_id: key,
                worker_id: cart[key].worker_id,
                start_at: cart[key].start_at,
                qty: cart[key].qty,
            }))
            let data = checkoutData;
            if (!data.coupon)
                delete data.coupon;
            if (!data.description)
                delete data.description;
            const CheckoutProps = Object.assign({}, data, {cart_items: cart_items});

            //Check for error in child component
            if (typeof props.errorCheck === 'function') {
                const message = props.errorCheck(CheckoutProps);
                if (message) {
                    setXhrStatus({message: message, success: false, error: true});
                    return;
                }
            }

            setXhrStatus({loading: true, error: false})
            props.endpoint(CheckoutProps)
                .then((res) => {
                    setXhrStatus({
                        message: 'Checkout successful. Order ID is ' + res.data.data.reference,
                        success: true,
                        error: false
                    });
                    props.checkoutSuccess(res)
                })
                .catch((error) => handleAxiosErrorWithState(error, setXhrStatus))
                .finally(e => setXhrStatus({loading: false}));
        }

    };

    const override = {
        display: 'block',
        margin: '0 auto',
    };

    return <>
        <div className="text-center mb-4 pb-3 border-bottom">
            <h2 className="h6 mb-3 pb-1">Cart total</h2>
            <h3 className="">{currencyFormat(Math.max(0, cartAmount - discount))}</h3>
            <p className='small'>
                Subtotal: {currencyFormat(cartAmount)} |
                Discount: {currencyFormat(discount)}
            </p>
        </div>
        <div className="mb-4 pb-3 border-bottom">
            <div className="form-group">
                <input type="text"
                       className="form-control form-control-sm prepended-form-control my-2"
                       onChange={changeText}
                       placeholder="Name" name="buyer_name"/>

                <input type="text"
                       className="form-control form-control-sm prepended-form-control my-2"
                       onChange={changeText}
                       placeholder="Phone Number" name="buyer_phone"/>

                <textarea className="form-control form-control-sm prepended-form-control my-2"
                          onChange={changeText}
                          placeholder="Note (Optional)" name="description"/>
                <input type="text"
                       className="form-control form-control-sm prepended-form-control my-2"
                       onKeyUp={handleCoupon}
                       placeholder="Coupon Code (Optional)" name="coupon"/>
            </div>


            {xhrStatus.error || xhrStatus.success ?
                <div className={(xhrStatus.error ? 'bg-danger' : 'bg-success')
                + " fade show border-rad-1 text-center p-2 mb-3"}>
                    <p className="small text-light mb-0">
                        <i className="czi-bell mr-2"/> {xhrStatus.message}
                    </p>
                </div>
                : null
            }

        </div>
        <div>
            {props.children}
        </div>
        {xhrStatus.loading ?
            <div className="sweet-loading mr-3">
                <ClipLoader
                    css={override}
                    size={30}
                    color={"#FF9595"}
                    loading={xhrStatus.loading}
                />
            </div>
            :
            <div>
                <button className="btn btn-pink btn-shadow btn-block mt-4"
                        onClick={() => checkout()}>
                    <i className="czi-cart mr-2"/>
                    {props.buttonText ?? 'Checkout'}
                </button>
            </div>
        }
    </>
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
