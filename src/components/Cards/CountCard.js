import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import {Link} from "react-router-dom";


const CountCard = ({cardTitle, cardCount, cardLink, cardIcon, props}) => {
    return <>
        <div className="card admin-card-2 mt-3 box-shadow">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <Link to={cardLink ? cardLink : '#'} className='h5'>
                        <i className={cardIcon}/> {cardTitle}
                    </Link>
                    <div className="product-price">
                        <h1 className="text-green-light">{cardCount}</h1>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(CountCard);