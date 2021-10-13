import React from 'react'
import './DefaultCard.css';

const DefaultCard = (props) => {
    return (
        <div className={'card'}>
            <h1 className={'card-header'}>{props.header}</h1>
            <p className={'card-body'}>{props.body}</p>
        </div>
    )
};

export default DefaultCard
