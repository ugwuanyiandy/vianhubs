import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../../redux/actions";
import ServiceCard from "./ServiceCard";
import ClipLoader from "react-spinners/ClipLoader";

const ServiceCardCollection = (props) => {
    const services = props.services ?? props[stateKeys.SERVICES];
    const override = {
        display: 'block',
        margin: '0 auto',
    };
    return <>
        {
            services.length ?
                services.map((service, i) =>
                    <ServiceCard key={i} cart={props.cart} service={service}/>) :
                (props.children ?? <ClipLoader
                    css={override}
                    size={30}
                    color={"#FF9595"}
                    loading={true}
                />)
        }
    </>
};


export default connect(mapStateToProps, mapDispatchToProps)(ServiceCardCollection);
