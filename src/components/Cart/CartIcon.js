import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import {Link} from "react-router-dom";
import {getCartCount} from "../../utils/cart";


const CartIcon = (props) => {
    const cartCount = getCartCount();
    return <>
        <Link to={props.cartPage ? props.cartPage : '/cart'}
              className="navbar-tool-icon-box bg-secondary border-0">
            {cartCount > 0 ?
                <span className="navbar-tool-label">{cartCount}</span>
                : null}
            <i className="navbar-tool-icon czi-cart"/>
        </Link>
    </>
};

export default connect(mapStateToProps, mapDispatchToProps)(CartIcon);
