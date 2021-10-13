import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import Endpoint from '../../utils/endpoint';
import Hero from "../../assets/images/model.png"
import salon from "../../assets/images/salon.jpg"
import attendantIcon from "../../assets/images/user 1.svg"
import {useMergeState} from "../../utils/helpers";
import moment from "moment";
import starful from "../../assets/images/starful.svg";
import {Link} from "react-router-dom";
import ServiceCardCollection from "../../components/Cards/Services/ServiceCardCollection";
import ClipLoader from "react-spinners/ClipLoader";

import vh1 from "../../assets/images/home/vh1.jpg";
import vh2 from "../../assets/images/home/vh2.jpg";
import vh3 from "../../assets/images/home/vh3.jpg";
import vh4 from "../../assets/images/home/vh4.jpg";
import vh5 from "../../assets/images/home/vh5.jpg";
import vh6 from "../../assets/images/home/vh6.jpg";

const Home = props => {
    const [state, setState] = useMergeState({
        featured: [],
        attendants: [],
        shopSchedule: []
    })

    const [servicesXhrStatus, setServicesXhrStatus] = useMergeState({
        message: '', success: false, error: false, warning: false, loading: false
    });
    const [hoursXhrStatus, setHoursXhrStatus] = useMergeState({
        message: '', success: false, error: false, warning: false, loading: false
    });
    const [attendantsXhrStatus, setAttendantsXhrStatus] = useMergeState({
        message: '', success: false, error: false, warning: false, loading: false
    });

    useEffect(() => {
        setServicesXhrStatus({loading: true})
        setAttendantsXhrStatus({loading: true})
        setHoursXhrStatus({loading: true})
        Endpoint.getShopServices({featured: true})
            .then(res => {
                setState({featured: res.data.data.slice(0, 4)});
            })
            .finally(() => setServicesXhrStatus({loading: false}));

        Endpoint.getShopAttendants()
            .then(res => {
                setState({attendants: res.data.data.slice(0, 3)});
            })
            .finally(() => setAttendantsXhrStatus({loading: false}));

        Endpoint.getShopDetails()
            .then(res => {
                res.data.data.opening_hours.sort((a, b) => a - b)
                setState({
                    shop: res.data.data,
                    shopSchedule: res.data.data.opening_hours
                });
            })
            .finally(() => setHoursXhrStatus({loading: false}));
    }, [])

    const override = {
        display: 'block',
        margin: '0 auto',
    };
    return <>
        {/*Hero section*/}
        <section className="mb-4 mb-lg-5">
            <div style={{backgroundColor: '#fac6bf'}}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 order-lg-2 min-vh-40"
                             style={{backgroundImage: `url(${Hero})`, backgroundSize: 'cover',}}>
                        </div>
                        <div className="col-lg-6 order-lg-1">
                            <div className="hero-text">
                                <h1 className="  font-weight-bold">Instantly book salons</h1>
                                <p className="">Get unforgettable beauty and wellness experience with
                                    Vian Hub Salon</p>
                                <p>
                                    <img className='d-inline-block' src={starful} style={{height: '30px'}}/>
                                    <img className='d-inline-block' src={starful} style={{height: '30px'}}/>
                                    <img className='d-inline-block' src={starful} style={{height: '30px'}}/>
                                    <img className='d-inline-block' src={starful} style={{height: '30px'}}/>
                                    <img className='d-inline-block' src={starful} style={{height: '30px'}}/>
                                </p>
                                <p className="text-muted small">With over 200 reviews from customers</p>
                                <Link to="/services" className="btn btn-block btn-outline-green-dark">Book
                                    Appointment</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="mb-5 pb-5">
            <div className="container">
                <h2 className="font-weight-bold mb-4">
                    Featured
                    <Link to={'/services'}><span className="small text-underline ml-2 text-dark">view all</span></Link>
                </h2>

                <div className="row position-relative">
                    <ServiceCardCollection services={state.featured}>
                        {servicesXhrStatus.loading ?
                            <ClipLoader
                                css={override}
                                size={30}
                                color={"#FF9595"}
                                loading={true}/> :
                            <div className='col-sm-12 text-center p-5'>
                                <p>No featured services</p>
                            </div>
                        }
                    </ServiceCardCollection>
                </div>
            </div>
        </section>

        <section className="bg-soft">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 py-5 my-auto">
                        <h6 className="font-weight-600">
                            Vian Hub Salon is a true reflection of style and provides luxurious, celebrity
                            treatment to all visitors – high-end beauty experience with a very comfortable
                            approach. Our boundless commitment is underlined by our continued search for the
                            very best stylists...
                            <br/><br/>
                            Incorporating all the services offered that include hair styling, haircuts, manicure
                            and nails, pedicure and more, the salon is led by respected
                            beauty-world experts.
                            <br/><br/>

                            Services offered ;

                            <br/>
                            Hair styling,
                            Haircuts,
                            Pedicure,
                            Manicure and nails
                            <br/> <br/>
                            Location: <br/>
                            Shop 20, Cappador's place plaza, 134 Adetokunbo Ademola Cres, Wuse 2, Abuja
                        </h6>
                    </div>

                    <div className="col-lg-6">
                        <img src={salon} className="my--4" alt=""/>
                    </div>
                </div>
            </div>
        </section>
        
        <section className=" mt-5 mb-5 pt-5 pb-5 border-bottom">
            <div className="container">
                <div className="row">
                    <div className="col-lg-2 col-md-4">
                        <div className="store-img" style={{backgroundImage: 'url(' + vh4 + ')' }}> </div>
                    </div>
                    
                    <div className="col-lg-2 col-md-4">
                        <div className="store-img" style={{backgroundImage: 'url(' + vh2 + ')' }}> </div>
                    </div>
                    
                    <div className="col-lg-2 col-md-4">
                        <div className="store-img" style={{backgroundImage: 'url(' + vh3 + ')' }}> </div>
                    </div>
                
                    <div className="col-lg-2 col-md-4">
                        <div className="store-img" style={{backgroundImage: 'url(' + vh1 + ')' }}> </div>
                    </div>
                
                    <div className="col-lg-2 col-md-4">
                        <div className="store-img" style={{backgroundImage: 'url(' + vh5 + ')' }}> </div>
                    </div>
                
                    <div className="col-lg-2 col-md-4">
                        <div className="store-img" style={{backgroundImage: 'url(' + vh6 + ')' }}> </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="mb-5 pb-5">
            <div className="container">
                <h2 className="font-weight-bold mb-4">Book with the best </h2>

                <div className="row mt-4">
                    <div className="col-md-6 border-right position-relative">
                        <p className='mb-5'>Choose from our highly rated staff</p>
                        {attendantsXhrStatus.loading ?
                            <ClipLoader
                                css={override}
                                size={30}
                                color={"#FF9595"}
                                loading={true}/> :
                            (state.attendants.length ?
                                state.attendants.map((attendant, i) =>
                                    <div key={i} className="d-flex border-bottom pt-2">
                                        <img src={attendantIcon} style={{height: '75px'}} alt=""/>
                                        <div className="ml-2">
                                            <h6 className="text-green-dark font-weight-bold mt-1">{attendant.user.first_name} {attendant.user.last_name}</h6>
                                            <p className='mb-1'>
                                                <img className='d-inline-block' src={starful}
                                                     style={{height: '15px'}}/>
                                                <img className='d-inline-block' src={starful}
                                                     style={{height: '15px'}}/>
                                                <img className='d-inline-block' src={starful}
                                                     style={{height: '15px'}}/>
                                                <img className='d-inline-block' src={starful}
                                                     style={{height: '15px'}}/>
                                                <img className='d-inline-block' src={starful}
                                                     style={{height: '15px'}}/>
                                            </p>
                                            <p className="small font-weight-light">{attendant.type.name}</p>
                                        </div>
                                    </div>
                                ) :
                                <>
                                    <div className='text-center'>
                                        <p>No featured attendant</p>
                                    </div>
                                </>)
                        }
                    </div>

                    <div className="col-md-6 position-relative">
                        <p className='mb-5 ml-3'>At a convenient schedule</p>
                        <div className="mx-lg-5">
                            {hoursXhrStatus.loading ?
                                <ClipLoader
                                    css={override}
                                    size={30}
                                    color={"#FF9595"}
                                    loading={true}/> :
                                (state.shopSchedule.length ?
                                    state.shopSchedule.map((day, i) => {
                                        var d = new Date();
                                        var n = d.getDay();
                                        var boldClass = "d-flex justify-content-between pt-2 font-weight-bold";
                                        var regClass = "d-flex justify-content-between pt-2";

                                        switch (day.weekday) {
                                            case 0: {
                                                var start = new Date();
                                                var end = new Date();

                                                const sTimes = day.start_time.split(':');
                                                start.setHours(sTimes[0]);
                                                start.setMinutes(sTimes[1]);
                                                start.setSeconds(sTimes[2]);

                                                const eTimes = day.end_time.split(':');
                                                end.setHours(eTimes[0]);
                                                end.setMinutes(eTimes[1]);
                                                end.setSeconds(eTimes[2]);
                                            }

                                                return (
                                                    day.weekday === n ?
                                                        <div key={i} className={boldClass}>
                                                            <p>Sunday</p>
                                                            <p>
                                                                {moment(start).format("LT")} - {moment(end).format("LT")}
                                                            </p>
                                                        </div>
                                                        :
                                                        <div key={i} className={regClass}>
                                                            <p>Sunday</p>
                                                            <p>
                                                                {moment(start).format("LT")} - {moment(end).format("LT")}
                                                            </p>
                                                        </div>
                                                );

                                            case 1: {
                                                var start2 = new Date();
                                                var end2 = new Date();

                                                const sTimes = day.start_time.split(':');
                                                start2.setHours(sTimes[0]);
                                                start2.setMinutes(sTimes[1]);
                                                start2.setSeconds(sTimes[2]);

                                                const eTimes = day.end_time.split(':');
                                                end2.setHours(eTimes[0]);
                                                end2.setMinutes(eTimes[1]);
                                                end2.setSeconds(eTimes[2]);
                                            }
                                                return (
                                                    day.weekday === n ?
                                                        <div key={i} className={boldClass}>
                                                            <p>Monday</p>
                                                            <p>
                                                                {moment(start2).format("LT")} - {moment(end2).format("LT")}
                                                            </p>
                                                        </div>
                                                        :
                                                        <div key={i} className={regClass}>
                                                            <p>Monday</p>
                                                            <p>
                                                                {moment(start2).format("LT")} - {moment(end2).format("LT")}
                                                            </p>
                                                        </div>
                                                );

                                            case 2: {
                                                var start3 = new Date();
                                                var end3 = new Date();

                                                const sTimes = day.start_time.split(':');
                                                start3.setHours(sTimes[0]);
                                                start3.setMinutes(sTimes[1]);
                                                start3.setSeconds(sTimes[2]);

                                                const eTimes = day.end_time.split(':');
                                                end3.setHours(eTimes[0]);
                                                end3.setMinutes(eTimes[1]);
                                                end3.setSeconds(eTimes[2]);
                                            }
                                                return (
                                                    day.weekday === n ?
                                                        <div key={i} className={boldClass}>
                                                            <p>Tuesday</p>
                                                            <p>
                                                                {moment(start3).format("LT")} - {moment(end3).format("LT")}
                                                            </p>
                                                        </div>
                                                        :
                                                        <div key={i} className={regClass}>
                                                            <p>Tuesday</p>
                                                            <p>
                                                                {moment(start3).format("LT")} - {moment(end3).format("LT")}
                                                            </p>
                                                        </div>
                                                );

                                            case 3: {
                                                var start4 = new Date();
                                                var end4 = new Date();

                                                const sTimes = day.start_time.split(':');
                                                start4.setHours(sTimes[0]);
                                                start4.setMinutes(sTimes[1]);
                                                start4.setSeconds(sTimes[2]);

                                                const eTimes = day.end_time.split(':');
                                                end4.setHours(eTimes[0]);
                                                end4.setMinutes(eTimes[1]);
                                                end4.setSeconds(eTimes[2]);
                                            }
                                                return (
                                                    day.weekday === n ?
                                                        <div key={i} className={boldClass}>
                                                            <p>Wednesday</p>
                                                            <p>
                                                                {moment(start4).format("LT")} - {moment(end4).format("LT")}
                                                            </p>
                                                        </div>
                                                        :
                                                        <div key={i} className={regClass}>
                                                            <p>Wednesday</p>
                                                            <p>
                                                                {moment(start4).format("LT")} - {moment(end4).format("LT")}
                                                            </p>
                                                        </div>
                                                );

                                            case 4: {
                                                var start5 = new Date();
                                                var end5 = new Date();

                                                const sTimes = day.start_time.split(':');
                                                start5.setHours(sTimes[0]);
                                                start5.setMinutes(sTimes[1]);
                                                start5.setSeconds(sTimes[2]);

                                                const eTimes = day.end_time.split(':');
                                                end5.setHours(eTimes[0]);
                                                end5.setMinutes(eTimes[1]);
                                                end5.setSeconds(eTimes[2]);
                                            }
                                                return (
                                                    day.weekday === n ?
                                                        <div key={i} className={boldClass}>
                                                            <p>Thursday</p>
                                                            <p>
                                                                {moment(start5).format("LT")} - {moment(end5).format("LT")}
                                                            </p>
                                                        </div>
                                                        :
                                                        <div key={i} className={regClass}>
                                                            <p>Thursday</p>
                                                            <p>
                                                                {moment(start5).format("LT")} - {moment(end5).format("LT")}
                                                            </p>
                                                        </div>
                                                );

                                            case 5: {
                                                var start6 = new Date();
                                                var end6 = new Date();

                                                const sTimes = day.start_time.split(':');
                                                start6.setHours(sTimes[0]);
                                                start6.setMinutes(sTimes[1]);
                                                start6.setSeconds(sTimes[2]);

                                                const eTimes = day.end_time.split(':');
                                                end6.setHours(eTimes[0]);
                                                end6.setMinutes(eTimes[1]);
                                                end6.setSeconds(eTimes[2]);
                                            }
                                                return (
                                                    day.weekday === n ?
                                                        <div key={i} className={boldClass}>
                                                            <p>Friday</p>
                                                            <p>
                                                                {moment(start6).format("LT")} - {moment(end6).format("LT")}
                                                            </p>
                                                        </div>
                                                        :
                                                        <div key={i} className={regClass}>
                                                            <p>Friday</p>
                                                            <p>
                                                                {moment(start6).format("LT")} - {moment(end6).format("LT")}
                                                            </p>
                                                        </div>
                                                );

                                            case 6: {
                                                var start7 = new Date();
                                                var end7 = new Date();

                                                const sTimes = day.start_time.split(':');
                                                start7.setHours(sTimes[0]);
                                                start7.setMinutes(sTimes[1]);
                                                start7.setSeconds(sTimes[2]);

                                                const eTimes = day.end_time.split(':');
                                                end7.setHours(eTimes[0]);
                                                end7.setMinutes(eTimes[1]);
                                                end7.setSeconds(eTimes[2]);
                                            }
                                                return (
                                                    day.weekday === n ?
                                                        <div key={i} className={boldClass}>
                                                            <p>Saturday</p>
                                                            <p>
                                                                {moment(start7).format("LT")} - {moment(end7).format("LT")}
                                                            </p>
                                                        </div>
                                                        :
                                                        <div key={i} className={regClass}>
                                                            <p>Saturday</p>
                                                            <p>
                                                                {moment(start7).format("LT")} - {moment(end7).format("LT")}
                                                            </p>
                                                        </div>
                                                );
                                        }
                                    })
                                    :
                                    <>
                                        <div className=''>
                                            <p>Opening hours not set</p>
                                        </div>
                                    </>)
                            }
                        </div>

                    </div>
                </div>
            </div>
        </section>

    </>
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);