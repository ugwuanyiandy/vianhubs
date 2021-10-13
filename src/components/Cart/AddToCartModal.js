import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import {Modal} from "react-bootstrap";
import {currencyFormat, useMergeState} from "../../utils/helpers";
import saloon from "../../assets/images/asset2.png";
import ClipLoader from "react-spinners/ClipLoader";
import Moment from "moment";
import Endpoint from "../../utils/endpoint";
import {addToCart} from "../../utils/cart";
import {getUser} from "../../utils/auth";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import getDay from "date-fns/getDay";
import moment from "moment";

const AddToCartModal = (props) => {
    
    const [shopSchedule, setShopSchedule] = useMergeState({
        shopSchedule: []
    });
    
    // const attendantOptional = !getUser()?.worker_profile; //Required for workers
    const attendantOptional = true
    const selectedService = props[stateKeys.ADD_TO_CART_MODAL_SERVICE];
    const initialSchedule = {
        attendant: [],
        checked: false,
        loading: false,
        includedTimes: [],
    };
    const [schedule, setSchedule] = useMergeState(initialSchedule);

    const initialState = {
        appointments: [],
        serviceDateTime: '',
        attendantId: '',
        incompleteCart: false,
        timePast: false,
        timeDisorder: false,
        chooseAttendant: !attendantOptional,
    };
    const [state, setState] = useMergeState(initialState);

    const chooseAttendant = (e) => {
        setState({chooseAttendant: e.target.checked})
    };

    const setServiceDate = (date) => {
        setStartDate(date);
        var timestamp = date.toISOString();
        // setStartDate(date);

        setState({serviceDateTime: timestamp});
    };

    const setAttendant = (event) => {
        const value = event.target.value;

        setState({attendantId: value});
        if (value) {
            getAttendantSchedule(value);
        }
    };

    const getAttendantSchedule = (id) => {
        setSchedule({loading: true});
        Endpoint.getAttendantSchedule(id)
            .then(res => {
                setSchedule({attendant: res.data.data, checked: true, loading: false});
            })
    };

    const addServiceToCart = () => {
        setState({timePast: false, incompleteCart: false, timeDisorder: false});

        if (!state.serviceDateTime) {
            setState({incompleteCart: true});
            return false;
        }

        if (!attendantOptional && !state.attendantId) {
            setState({incompleteCart: true});
            return false;
        }

        const startTime = state.serviceDateTime;
        if (new Date() > new Date(startTime)) {
            setState({timePast: true});
            return false
        }

        addToCart(selectedService.id, state.serviceDateTime, state.attendantId, selectedService, 1);
        setState(initialState)
        setSchedule(initialSchedule)
        props.setState(false, stateKeys.SHOW_ADD_TO_CART_MODAL)

        //Validate cart
        // if (userLoggedIn()) {
        //     const CartProps = {
        //         service_id: selectedService.id,
        //         ...(state.attendantId ? {worker_id: state.attendantId} : {}),
        //         start_at: state.serviceDateTime,
        //     };
        //
        //     Endpoint.addToCart(CartProps)
        //         .catch((error) => {
        //             handleAxiosError(error, this);
        //             removeItemFromCart(selectedService.id)
        //         });
        // }
    };
    
    const getShopDetails = () => {
        Endpoint.getShopDetails()
            .then(res => {
    
                let schedule = res.data.data.opening_hours;
                let existingTimes = [];
    
                let maxEndTime=0;
                for (let i = schedule[0].weekday; i < schedule.length; i++) {
                    let eTime = schedule[i].end_time.split(':');
                    if (eTime[0] > maxEndTime) {
                        maxEndTime = eTime[0];
                    }
                }
                    
                    const sTime = schedule[1].start_time.split(':');
                    let startInt = sTime[0];
                    let endInt = maxEndTime;
    
                    for (let i = startInt; i < endInt; i++) {
                        existingTimes.push(setHours(setMinutes(new Date(), 0), i ));
                        existingTimes.push(setHours(setMinutes(new Date(), 15), i ));
                        existingTimes.push(setHours(setMinutes(new Date(), 30), i ));
                        existingTimes.push(setHours(setMinutes(new Date(), 45), i ));
                    }
                
                setState({shop: res.data.data});
                setShopSchedule({shopSchedule: existingTimes});
                
            })
    };
    
    useEffect(() => {
        getShopDetails();
    }, []);
    
    const override = {
        display: 'block',
        margin: '0 auto',
    };
    
    const [startDate, setStartDate] = useState(new Date());
    // const [startDate, setStartDate] = useState(
    //     setHours(setMinutes(new Date(), 0), 8)
    // );

    const includedTimes = shopSchedule.shopSchedule;
    
    return <>
        <Modal show={props[stateKeys.SHOW_ADD_TO_CART_MODAL]} size="lg"
               aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add To Cart
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <div className="d-flex justify-content-between">
                    <h5 className='mr-2'>{selectedService.name}</h5>
                    <h6 className='text-accent ml-2'> {currencyFormat(selectedService.cost)}</h6>
                </div>

                <div>
                    {schedule.shopSchedule}
                </div>
                <div className="row mt-3">
                    <div className="col-lg-4">
                        <img src={selectedService.image ? selectedService.image : saloon}
                             className='' alt=""/>
                    </div>

                    <div className="col-lg-8">
                        <p className='py-2'>
                            {selectedService.description}
                        </p>

                        <div className="form-group">
                            <label className="col-auto">Select Appointment Time: </label>
                            {/*<input type="datetime-local" className="form-control form-control-sm col-10"*/}
                            {/*       onChange={setServiceDate}/>*/}

                            <DatePicker
                                type="datetime"
                                selected={startDate}
                                onChange={setServiceDate}
                                showTimeSelect
                                minDate={moment().toDate()}
                                timeIntervals={15}
                                includeTimes={includedTimes}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                placeholderText="Please Select Date & Time"
                                className="form-control col-auto"
                            />
                        </div>
    
                        {attendantOptional ?
                            <div className="form-group">
                                <div className="custom-control custom-switch">
                                    <input type="checkbox" className="custom-control-input" id="customSwitch1"
                                           checked={state.chooseAttendant}
                                           onChange={chooseAttendant}/>
                                    <label className="custom-control-label" htmlFor="customSwitch1">
                                        Choose attendant?
                                    </label>
                                </div>
                            </div>
                            : ''}
    
                        {state.chooseAttendant ?
                            <div className="form-group">
                                <select id="" className="form-control form-control-sm col-10" required
                                        onChange={setAttendant}>
                                    <option value='null'>--Select Attendant--</option>
                                    {selectedService.available_workers ?
                                        selectedService.available_workers.map((worker, i) =>
                                            <option key={i} value={worker.user.id}>
                                                {worker.user.last_name} {worker.user.first_name}
                                            </option>
                                        )
                                        :
                                        <option value="">No available attendant</option>
                                    }
                                </select>

                                {
                                    schedule.checked ?
                                        <div className='border border-rad-2 p-3 mt-2 mb-3 col-10'>
                                            <p className='title-small mb-1'>Booked Times: </p>
                                            {
                                                schedule.loading ?
                                                    <div className="sweet-loading mr-3">
                                                        <ClipLoader
                                                            css={override}
                                                            size={30}
                                                            color={"#FF9595"}
                                                            loading={schedule.loading}
                                                        />
                                                    </div>
                                                    :
                                                    <div className='border-schedule-timeline p-2 ml-2 pl-4 mt-3'>
                                                        {
                                                            schedule.attendant.length ?
                                                                schedule.attendant.map((time, i) =>
                                                                    <div key={i}
                                                                         className='bg-schedule border-schedule p-2 border-rad-schedule mb-2'>
                                                                        <i className="czi-time mr-2"/>
                                                                        {Moment(time.start_at).format("LT")}
                                                                        &nbsp; to {Moment(time.end_at).format("LT")}
                                                                    </div>
                                                                )
                                                                :
                                                                <p className='text-center mb-0'>
                                                                    No appointment booked.</p>
                                                        }
                                                    </div>
                                            }
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            : null
                        }

                        {state.incompleteCart ?
                            <div className="col-10 bg-danger fade show border-rad-1 text-center p-2 mb-3">
                                <p className="small text-light mb-0">
                                    <i className="czi-bell mr-2"/> Please fill in all fields.
                                </p>
                            </div>
                            : null
                        }

                        {state.timePast ?
                            <div className="col-10 bg-danger fade show border-rad-1 text-center p-2 mb-3">
                                <p className="small text-light mb-0">
                                    <i className="czi-bell mr-2"/> Time for appointment must be in the future.
                                </p>
                            </div>
                            : null
                        }

                        {state.error ?
                            <div className="col-10 bg-danger fade show border-rad-1 text-center p-2 mb-3">
                                <p className="small text-light mb-0">
                                    <i className="czi-bell mr-2"/> {state.errorMessage}
                                </p>
                            </div>
                            : null
                        }
                    </div>

                </div>

            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-green-dark" onClick={() => addServiceToCart()}>
                    <i className="czi-cart mr-2"/>
                    Add to Cart
                </button>

                <button className="btn btn-outline-danger"
                        onClick={() => props.setState(false, stateKeys.SHOW_ADD_TO_CART_MODAL)}>Close
                </button>
            </Modal.Footer>
        </Modal>
    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToCartModal);
