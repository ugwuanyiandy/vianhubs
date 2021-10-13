import {usePaystackPayment} from "react-paystack";
import React from "react";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";

const PaystackOrderHook = (props) => {
    const initializePayment = usePaystackPayment({
        publicKey: props.publicKey,
        email: props.email,
        amount: props.amount,
        metadata: {
            firstname: props.first_name,
            lastname: props.last_name,
            phone: props.phone,
        },
        reference: props.reference
    });

    initializePayment(props.onSuccess, props.onClose);
    return (<></>);
};

export default connect(mapStateToProps, mapDispatchToProps)(PaystackOrderHook);
