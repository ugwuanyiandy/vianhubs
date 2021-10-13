import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import {removeItemFromCart} from "../../utils/cart";
import {Link} from "react-router-dom";

const AddToCartButton = props => {

    const openAddToCartModal = () => {
        props.setState(props.service, stateKeys.ADD_TO_CART_MODAL_SERVICE)
        props.setState(true, stateKeys.SHOW_ADD_TO_CART_MODAL)
    };

    const removeFromCart = () => {
        removeItemFromCart(props.service.id)
    }

    const inCart = props.service.id in props[stateKeys.CART];
    return <>
        {inCart ?
            <>
                <Link to={props.cart ?? '/cart'} className={props.className}>
                    <i className="czi-arrow-right mr-2"/> Go to Cart
                </Link>
                {/*<button onClick={() => removeFromCart()}*/}
                {/*        className={props.className}>*/}
                {/*    <i className="czi-close mr-2"/> Remove From Cart*/}
                {/*</button>*/}
            </>
            :
            <button onClick={() => openAddToCartModal()}
                    className={props.className}>
                {props.children}
            </button>
        }
    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToCartButton);