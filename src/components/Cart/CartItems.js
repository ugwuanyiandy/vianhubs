import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import hairm from "../../assets/images/asset2.png";
import {currencyFormat, useMergeState} from "../../utils/helpers";
import moment from "moment";
import Moment from "moment";
import {clearCart, editCartProduct, getCart, getCartCount, removeItemFromCart, updateCart} from "../../utils/cart";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import {Modal} from "react-bootstrap";
import DatePicker from "react-datepicker";
import ClipLoader from "react-spinners/ClipLoader";
import Endpoint from "../../utils/endpoint";

import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";


const CartItems = (props) => {

    const cart = getCart();
    const count = getCartCount();
    const cartKeys = Object.keys(cart);
    const [editItem, setEditItem] = useMergeState({
        editModal: false,
        selectedService: [],
        serviceDateTime: '',
        shopSchedule: [],
        attendantId: '',
        newAttendantId: '',
    });
    
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
    };
    const [state, setState] = useMergeState(initialState);
    
    const selectedService = props[stateKeys.ADD_TO_CART_MODAL_SERVICE];
    
    const [shopSchedule, setShopSchedule] = useMergeState({
        shopSchedule: []
    });
    
    const editCartItem = (service_id) => {
        for (const item of cartKeys) {
            if (cart[item].service) {
                if (cart[item].service.id === service_id) {
                    setEditItem({selectedService: cart[item],});
                    setEditItem({editModal: true});
                }
                
            }
            
        }
    };
    
    function findWorkerInService(worker_id, service) {
        let worker = null;
        if (worker_id) {
            for (let i = 0; i < service.available_workers.length; i++) {
                if (service.available_workers[i].id == worker_id) {
                    worker = service.available_workers[i];
                    break;
                }
            }
        }
        
        return worker;
    }
    
    const updateItem = () => {
        let worker = findWorkerInService(editItem.newAttendantId, editItem.selectedService.service);
        let data = [];
        
        data["worker_id"] = editItem.newAttendantId;
        data["worker"] = worker;
        data["start_time"] = editItem.serviceDateTime;
        
        if (data["worker"] || data["worker_id"] || data["start_time"]) {
            let res = editCartProduct(editItem.selectedService.service.id, data);
            if (res) {
                setEditItem({editModal: false});
            }
        }
    };
    
    const setServiceDate = (date) => {
        setStartDate(date);
        var timestamp = date.toISOString();
        // setStartDate(date);
        
        setEditItem({serviceDateTime: timestamp});
    };
    
    const [startDate, setStartDate] = useState(new Date());
    
    const includedTimes = shopSchedule.shopSchedule;
    
    const setAttendant = (event) => {
        const value = event.target.value;
        
        setEditItem({newAttendantId: value});
        if (value) {
            getAttendantSchedule(value);
        }
    };
    
    const getAttendantSchedule = (id) => {
        Endpoint.getAttendantSchedule(id)
            .then(res => {
                setSchedule({attendant: res.data.data, checked: true, loading: false});
            })
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
    
    return <>
        <div className="pt-2 px-4 pr-lg-0 pl-xl-5">
            <div
                className="d-flex flex-wrap justify-content-between align-items-center pb-3">
                <div className="d-none d-sm-block py-1 font-size-ms">
                    You have {count} products in your cart
                </div>
                <div className="py-1">
                    <button className="btn btn-outline-danger btn-sm"
                            onClick={() => clearCart()}>
                        <i className="czi-close font-size-xs mr-1 ml-n1"/>Clear Cart
                    </button>
                </div>
            </div>
            {cartKeys.length ?
                cartKeys.map((key, index) => {
                    const item = cart[key];
                    return <div key={index} className="media d-block d-sm-flex align-items-center py-4 border-top">
                            <p className="d-block position-relative mb-3 mb-sm-0 mr-sm-4 mx-auto" style={{width: '6.5rem'}}>
                                <img className="rounded-lg" src={item.service.image ?
                                    item.service.image : hairm} alt="Product"/>
                                    
                                <span className="close-floating" onClick={() => removeItemFromCart(item.service.id)}>
                                        <i className="czi-close"/>
                                </span>
                            </p>

                            <div className="media-body text-center text-sm-left">
                                <div className="d-flex flex-wrap justify-content-between">
                                    <h3 className="h6 product-title mb-2">
                                        <p>{item.service.name}</p>
                                    </h3>
                                    <button className="btn btn-sm btn-outline-danger mb-3" onClick={() => editCartItem(item.service.id)}>
                                        <i className="czi-edit"/>
                                    </button>
                                    
                                </div>
                                
                                
                                <div>
                                    <span className="text-accent">
                                        {currencyFormat(item.service.cost)}
                                    </span>
                                    
                                    {item.worker ?
                                        <Link className="text-accent font-size-ms border-left ml-2 pl-2"
                                              to="#">with <span className='text-green-dark'>
                                                    {item.worker?.user?.first_name} {item.worker?.user?.last_name}</span>
                                        </Link>
                                        : ''}
                                </div>
                                
                                <div>
                                    <div className="d-inline-block mr-2 pr-2">
                                        <small className='font-weight-bold'>
                                            {moment(item.start_at).format("dddd, MMMM Do YYYY, h:mma")}&nbsp;to &nbsp;
                                            {moment(item.start_at).add(item.service.duration, 'minutes').format('LTS')}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>

                })
                :
                <p className="text-center font-weight-bold mt-5">Cart is empty</p>
            }
        </div>
    
        <Modal show={editItem.editModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit Cart Item
                </Modal.Title>
            </Modal.Header>
        
            <Modal.Body>
                <div className="d-flex justify-content-between">
                    <h6 className='mr-2'>{editItem.selectedService.service ? editItem.selectedService.service.name : "No Service Selected"}</h6>
                    <p className='font-weight-bold text-accent ml-2'>
                        {currencyFormat(editItem.selectedService.service ? editItem.selectedService.service.cost : "0.00")}
                    </p>
                </div>
    
                <hr/>
                
                <div className="row mt-3">
                    <div className="col-md-5">
                        <label className="">Current Service Time: </label>
                        <p className="font-weight-bold">{moment(editItem.selectedService.start_at).format("dddd, MMMM Do YYYY, h:mma")}</p>
                    </div>
                    
                    <div className="col-md-7">
                        <label className="">Select New Service Time: </label>
                        <div className="form-group">
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
                                className="form-control "
                            />
                        </div>
                    </div>
                </div>
                
                <div className="row mt-3">
                    <div className="col-md-5">
                        <label className="">Current Attendant: </label>
                        <div>
                            <p className="font-weight-bold">
                                {editItem.selectedService.worker ?
                                    editItem.selectedService.worker.user ?
                                        editItem.selectedService.worker.user.first_name + " " +
                                        editItem.selectedService.worker.user.last_name
                                        : "None selected"
                                    : "None selected"}
                            </p>
                        </div>
                    </div>
                    
                    <div className="col-md-7">
                        <label className="">Select New Attendant: </label>
                        <div className="form-group">
                            <select id="" className="form-control form-control-sm col-10" required
                                    onChange={setAttendant}>
                                <option value='null'>--Select Attendant--</option>
                                {editItem.selectedService.service ?
                                    editItem.selectedService.service.available_workers.map((worker, i) =>
                                        <option key={i} value={worker.user.id}>
                                            {worker.user.name}
                                        </option>
                                    )
                                    :
                                    <option value="">No available attendant</option>
                                }
                            </select>
        
                            {
                                schedule.checked ?
                                    <div className='border border-rad-2 p-3 mt-2 mb-3 col-10'>
                                        <p className='title-small font-weight-bold mb-1'>Booked Times: </p>
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
                    </div>
                </div>
            </Modal.Body>
    
            <Modal.Footer>
                <button className="btn btn-green-dark" onClick={() => updateItem()}>
                    <i className="czi-cart mr-2"/>
                    Edit Cart
                </button>
        
                <button className="btn btn-outline-danger"
                        onClick={() => setEditItem({editModal: false})}>Close
                </button>
            </Modal.Footer>
        </Modal>
    </>
};

export default connect(mapStateToProps, mapDispatchToProps)(CartItems);
