import React, {useState} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import {Link} from "react-router-dom";
import about8 from "../../assets/images/about/08.jpg";
import Endpoint from "../../utils/endpoint";
import {handleAxiosError, useMergeState} from "../../utils/helpers";
import ClipLoader from "react-spinners/ClipLoader";
import {Modal} from "react-bootstrap";


const ContactUsForm = (props) => {
    const [genState, setGenState] = useMergeState({
        incompleteForm: false, successMsg: false, spinner: false,
    });
    const [payloadContent, setpayloadContent] = useMergeState({
        guestName: '', guestMail: '', guestPhone: '', guestMessage: ''
    });

    const changeText = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setpayloadContent({
            [name]: value,
        });
    };

    const sendContactMail = () => {
        //Clear notice
        setGenState({incompleteForm: false, successMsg: false});

        if (!payloadContent.guestName || !payloadContent.guestMail || !payloadContent.guestPhone || !payloadContent.guestMessage) {
            setGenState({incompleteForm: true});
            return false;
        }

        setGenState({spinner: true});
        const payload = {
            name: payloadContent.guestName,
            email: payloadContent.guestMail,
            phone: payloadContent.guestPhone,
            message: payloadContent.guestMessage,
        };

        Endpoint.sendContactMail(payload)
            .then((res) => {
                setGenState({successMsg: true,});
            })
            .catch((error) => handleAxiosError(error))
            .finally(() => setGenState({spinner: false}));

    };

    const override = {
        display: 'block',
        margin: '0 auto',
        // borderColor: 'red',
    };
    return <>
        <section className="row no-gutters">
            <div className="col-md-6 bg-position-center bg-size-cover bg-secondary"
                 style={{minHeight: '15rem', backgroundImage: `url(${about8})`,}}/>
            <div className="col-md-6 px-3 px-md-5 py-5 order-md-1">
                <div className="mx-auto py-lg-5" style={{maxWidth: '35rem'}}>
                    <h2 className="h3 mb-2">Want to get in touch?</h2>
                    <p className="font-size-sm text-muted pb-2">
                        If you want to suggest services or find out more, please fill in the form below.
                    </p>
                    <form className="needs-validation row justify-content-center" method="post" noValidate>
                        <div className="col-sm-12 form-group">
                            <input className="form-control" type="text" placeholder="Your name"
                                   name="guestName" onChange={changeText} required/>
                        </div>
                        <div className="col-sm-6 form-group">
                            <input className="form-control" type="email" placeholder="Your email"
                                   name="guestMail" onChange={changeText} required/>
                        </div>
                        <div className="col-sm-6 form-group">
                            <input className="form-control" type="tel" placeholder="Your phone number"
                                   name="guestPhone" onChange={changeText} required/>
                        </div>
                        <div className="col-12 form-group">
                            <textarea className="form-control" rows="4" placeholder="Message" name="guestMessage"
                                      onChange={changeText}/>
                        </div>

                        {genState.spinner ? (
                            <div className="sweet-loading">
                                <ClipLoader
                                    css={override}
                                    size={30}
                                    color={"#FF9595"}
                                    loading={genState.spinner}
                                />
                            </div>
                        ) : null}

                        {genState.incompleteForm ?
                            <div className="col-11 bg-danger fade show border-rad-1 text-center py-3 px-4 mb-3">
                                <p className="small text-light mb-0">
                                    <i className="czi-bell mr-2"/> Please fill in all fields.
                                </p>
                            </div>
                            : null
                        }

                        {genState.successMsg ?
                            <div className="col-11 bg-success fade show border-rad-1 text-center py-3 px-4 mb-3">
                                <p className="small text-light mb-0">
                                    <i className="czi-bell mr-2"/> Message sent successfully!
                                </p>
                            </div>
                            : null
                        }

                        <div className="col-12">
                            <button className="btn btn-green-dark btn-shadow" type="button" onClick={sendContactMail}>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>

    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactUsForm);