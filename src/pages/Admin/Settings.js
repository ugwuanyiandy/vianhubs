import React, {useEffect, useRef} from "react";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys,} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import {Col, Modal, Row, Tab, Tabs} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import mergeDeep, {getWeekDay, handleAxiosErrorWithState, useMergeState} from "../../utils/helpers"
import {Link} from "react-router-dom";


const Settings = (props) => {
    const [state, setState] = useMergeState({
        deleteWeekday: null,
        deleteModal: false,
        openingHours: [],
        paymentMethods: {paystack: {public: '', _secret: ''}},
        successMsg: false,
        shopOpeningCard: false,
    });
    const [payment, setPayment] = useMergeState({
        paystack: {public: '', _secret: ''},
        bank_transfer: {name: '', number: '', bank: '', proof_required: false},
    });
    const [hoursXhrStatus, setHoursXhrStatus] = useMergeState({
        message: '', success: false, error: false, warning: false, loading: false
    });
    const [paymentXhrStatus, setPaymentXhrStatus] = useMergeState({
        message: '', success: false, error: false, warning: false, loading: false
    });
    const [openingHour, setOpeningHour] = useMergeState({
        weekday: null,
        start_time: null,
        end_time: null
    });

    const getShopOpeningTime = () => {
        Endpoint.getShopOpeningHours()
            .then(res => {
                let days = res.data.data;
                days.sort((a, b) => a.weekday - b.weekday);
                setState({openingHours: days});
            })
    };

    const updateShopOpeningTime = () => {
        setHoursXhrStatus({loading: true})
        Endpoint.updateShopOpeningHours(openingHour)
            .then(res => {
                setState({shopOpeningCard: false})
                getShopOpeningTime();
            }).catch((e) => handleAxiosErrorWithState(e, setHoursXhrStatus))
            .finally(() => setHoursXhrStatus({loading: false}))
    };

    const deleteShopOpeningTime = () => {
        setState({deleteModal: false});
        Endpoint.deleteShopOpeningHours(state.deleteWeekday)
            .then(res => {
                getShopOpeningTime();
            })
            .catch((e) => handleAxiosErrorWithState(e))
    };

    const getShopPaymentSettings = () => {
        setPaymentXhrStatus({loading: true})
        Endpoint.getAllPaymentSettings()
            .then(res => {
                setPayment(res.data.data);
            }).catch((e) => handleAxiosErrorWithState(e, setPaymentXhrStatus))
            .finally(() => setPaymentXhrStatus({loading: false}))
    };

    let timer = useRef();
    const updateShopPaymentSettings = (method, data) => {
        if (timer.current)
            clearTimeout(timer.current);

        timer.current = setTimeout(() => {
            setPaymentXhrStatus({loading: true, error: false})
            setPayment({[method]: {[data.key]: data.value}});
            Endpoint.updateShopPaymentSettings(method, data)
                .catch((e) => handleAxiosErrorWithState(e, setPaymentXhrStatus))
                .finally(() => setPaymentXhrStatus({loading: false}))
        }, 2000);
    };

    const promptDelete = (weekday) => {
        setState({
            deleteWeekday: weekday,
            deleteModal: true
        })
    }


    useEffect(() => {
        getShopOpeningTime();
        getShopPaymentSettings();
    }, []);


    const override = {
        display: 'block',
        margin: '0 auto',
        // borderColor: 'red',
    };

    const SettingInput = props => {
        const id = props.method + '_' + props.pKey;
        return {
            text: <>
                <label htmlFor={id}>{props.title}</label>
                <input id={id}
                       defaultValue={payment[props.method][props.pKey]}
                       className="form-control"
                       onChange={(e) => {
                           updateShopPaymentSettings(props.method, {
                               key: props.pKey,
                               value: e.target.value
                           })
                       }} required/>
            </>,
            checkbox: <>
                <div className="custom-control custom-checkbox">
                    <input className="custom-control-input" type="checkbox" name="percentage" id={id}
                           checked={!!parseInt(payment[props.method][props.pKey])}
                           onChange={(e) => {
                               setPayment({[props.method]: {[props.pKey]: e.target.checked}});
                               updateShopPaymentSettings(props.method, {
                                   key: props.pKey,
                                   value: e.target.checked
                               })
                           }}/>
                    <label className="custom-control-label" htmlFor={id}>{props.title}</label>
                </div>
            </>
        }[props.type ?? 'text'];
    }

    return (
        <>
            <div className="border-bottom mt-lg-2 mt-5 pt-5 pb-2 mb-2">
                <nav className="mb-4 mt-5" aria-label="breadcrumb">
                    <ol className="breadcrumb flex-lg-nowrap">
                        <li className="breadcrumb-item">
                            <Link className="text-nowrap" to="/admin">
                                <i className="czi-home"/>
                                Home
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link className="text-nowrap" to="">
                                <i className="czi-"/> Dashboard
                            </Link>
                        </li>

                        <li className="breadcrumb-item text-nowrap active"
                            aria-current="page">
                            Settings
                        </li>
                    </ol>
                </nav>

                <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <h2 className="mt-lg-1 pt-lg-1 mt-2">Shop Settings</h2>
                    <button className="btn btn-pink mt-2" onClick={() => setState({shopOpeningCard: true})}>
                        Update Hours
                    </button>
                </div>

            </div>

            <div className="pt-1 pb-5">
                <section className="border-bottom pb-4">
                    <div className="row">
                        <div className="col-md-6 col-lg-3">
                        </div>
                    </div>
                </section>

                <section>
                    <div className="box-shadow rounded-lg overflow-hidden p-3 bg-white">
                        <div className="pt-1 pb-5">
                            <section className="mb-3">
                                <div className="mt-3">
                                    <Tabs fill defaultActiveKey="profile" id="uncontrolled-tab-example">
                                        <Tab eventKey="profile" title="Opening Hours">
                                            <div className="table-responsive">
                                                <table className="table table-hover">

                                                    <thead className="thead-light">
                                                    <tr className="font-weight-bold">
                                                        <td>Weekdays</td>
                                                        <td>Open</td>
                                                        <td>Close</td>
                                                        <td>Action</td>
                                                    </tr>
                                                    </thead>

                                                    <tbody>
                                                    {state.openingHours.length ?
                                                        state.openingHours.map((a, b) =>
                                                            <tr key={b}>
                                                                <td>{getWeekDay(a.weekday)}</td>
                                                                <td>{a.start_time == null ? "-" : a.start_time.substring(0, 5)}</td>
                                                                <td>{a.end_time == null ? "-" : a.end_time.substring(0, 5)}</td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-outline-danger btn-sm"
                                                                        onClick={() => promptDelete(a.weekday)}
                                                                    >
                                                                        <i className="czi-trash"/>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ) : <>
                                                            <tr>
                                                                <td colSpan={4}>
                                                                    <div className="sweet-loading">
                                                                        <ClipLoader
                                                                            css={override}
                                                                            size={60}
                                                                            color={"#FF9595"}
                                                                            loading={state.spinner}
                                                                        />
                                                                    </div>
                                                                </td>

                                                            </tr>

                                                        </>
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="payment" title="Payment Settings">
                                            <h4>Paystack</h4>
                                            <Row>
                                                <Col xs={6} className='tiny-margin-top'>
                                                    <SettingInput method={'paystack'} title={'Public Key'}
                                                                  pKey={'public'}/>
                                                </Col>
                                                <Col xs={6} className='tiny-margin-top'>
                                                    <SettingInput method={'paystack'} title={'Secret Key'}
                                                                  pKey={'_secret'}/>
                                                </Col>
                                            </Row>

                                            <h4 className='mt-2'>Bank Transfer</h4>
                                            <Row>
                                                <Col xs={6} className='tiny-margin-top'>
                                                    <SettingInput method={'bank_transfer'} title={'Account Name'}
                                                                  pKey={'name'}/>
                                                </Col>
                                                <Col xs={6} className='tiny-margin-top'>
                                                    <SettingInput method={'bank_transfer'} title={'Account Number'}
                                                                  pKey={'number'}/>
                                                </Col>
                                                <Col xs={6} className='tiny-margin-top'>
                                                    <SettingInput method={'bank_transfer'} title={'Bank'}
                                                                  pKey={'bank'}/>
                                                </Col>
                                                <Col xs={6} className='tiny-margin-top'>
                                                    <SettingInput method={'bank_transfer'} type='checkbox'
                                                                  title={'Require proof of payment'}
                                                                  pKey={'proof_required'}/>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} className='tiny-margin-top'>
                                                    <ClipLoader
                                                        size={30}
                                                        color={"#FF9595"}
                                                        loading={paymentXhrStatus.loading}
                                                    />

                                                    {paymentXhrStatus.error ? (
                                                        <div className="bg-danger border-rad-2 text-center p-2 mb-3">
                                                            <p className="small text-light mb-0">
                                                                <i className="czi-bell mr-2"/> {paymentXhrStatus.message}
                                                            </p>
                                                        </div>
                                                    ) : null}
                                                </Col>
                                            </Row>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </section>
                        </div>
                    </div>
                </section>
            </div>

            <Modal show={state.deleteModal} size="sm">
                <Modal.Header>Delete {getWeekDay(state.deleteWeekday)}?</Modal.Header>
                <Modal.Body>
                    <p>Deleting a weekday means your shop is not open on that day</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-custom" onClick={deleteShopOpeningTime}>
                        <i className="czi-check mr-2"/>
                        Confirm
                    </button>
                    <button className="btn btn-outline-danger" onClick={() => {
                        setState({deleteModal: false})
                    }}>Close
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal show={state.shopOpeningCard} size="md">
                <Modal.Header>Update Opening Hours</Modal.Header>
                <Modal.Body>
                    {hoursXhrStatus.error ? (
                        <div className="bg-danger border-rad-2 text-center p-2 mb-3">
                            <p className="small text-light mb-0">
                                <i className="czi-bell mr-2"/> {hoursXhrStatus.message}
                            </p>
                        </div>
                    ) : null}
                    <br/>
                    <Row>
                        <Col xs={12} md={12}>
                            <div className="input-group-overlay form-group">
                                <select className="form-control" onChange={(e) => setOpeningHour(
                                    {weekday: e.target.value})}>
                                    <option selected disabled>Choose weekday</option>
                                    <option value="0">Sunday</option>
                                    <option value="1">Monday</option>
                                    <option value="2">Tuesday</option>
                                    <option value="3">Wednesday</option>
                                    <option value="4">Thursday</option>
                                    <option value="5">Friday</option>
                                    <option value="6">Saturday</option>
                                </select>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} md={6}>
                            <div className="input-group-overlay form-group">
                                <div className="input-group-prepend-overlay">
                                    <span className="input-group-text"><i className="czi-time"/></span>
                                </div>
                                <input
                                    className="form-control prepended-form-control"
                                    type="time" onChange={(e) => setOpeningHour(
                                    {start_time: e.target.value + ':00'})}
                                    placeholder="Start time"
                                    required/>
                            </div>
                        </Col>
                        <Col xs={6} md={6}>
                            <div className="input-group-overlay form-group">
                                <div className="input-group-prepend-overlay">
                                    <span className="input-group-text"><i className="czi-time"/></span>
                                </div>
                                <input
                                    className="form-control prepended-form-control"
                                    type="time" onChange={(e) => setOpeningHour(
                                    {end_time: e.target.value + ':00'})}
                                    placeholder="End time"
                                    required
                                />
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    {hoursXhrStatus.loading ? (
                        <div className="sweet-loading">
                            <ClipLoader
                                css={override}
                                size={30}
                                color={"#FF9595"}
                                loading={hoursXhrStatus.loading}
                            />
                        </div>
                    ) : <button className="btn btn-custom" onClick={updateShopOpeningTime}>
                        <i className="czi-check mr-2"/>
                        Update</button>
                    }

                    <button className="btn btn-outline-danger"
                            onClick={() => {
                                setState({shopOpeningCard: false});
                            }}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
