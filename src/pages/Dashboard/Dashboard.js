import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import LinesEllipsis from "react-lines-ellipsis";
import "react-datepicker/dist/react-datepicker.css";
import {currencyFormat} from "../../utils/helpers";
import Moment from "react-moment";
import {Link} from "react-router-dom";
import ServiceCardCollection from "../../components/Cards/Services/ServiceCardCollection";
import ClipLoader from "react-spinners/ClipLoader";

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            loadingAppointments: false
        };
    }

    loadDataFromServer = () => {
        this.setState({loadingAppointments: true})
        //My Appointments
        Endpoint.getCustomerSessions('paid')
            .then(res => {
                this.setState({appointments: res.data.data.data.slice(0, 4)});
            })
            .finally(() => this.setState({loadingAppointments: false}));

    };

    componentDidMount() {
        this.loadDataFromServer();
    }

    render() {

        const override = {
            display: 'block',
            margin: '0 auto',
        };

        return (
            <>
                <div className="border-bottom mt-lg-2 mt-5 pt-5 pb-2 mb-2">
                    <nav className="mb-4 mt-5" aria-label="breadcrumb">
                        <ol className="breadcrumb flex-lg-nowrap">
                            <li className="breadcrumb-item">
                                <a className="text-nowrap" href="">
                                    <i className="czi-home"/>Home
                                </a>
                            </li>

                            <li className="breadcrumb-item text-nowrap active" aria-current="page">Dashboard</li>
                        </ol>
                    </nav>

                    <div className="d-flex justify-content-between">
                        <h2 className="mt-lg-1 pt-lg-1 font-weight-600">Dashboard</h2>
                        <Link to="/dashboard/cart" className="btn btn-pink my-auto">
                            <i className="czi-cart mr-2"/> Go To Cart
                        </Link>
                    </div>
                </div>

                <div className="pt-1 pb-5">
                    <div>
                        <h1 className="h4 text-dark mb-0">My Upcoming Appointments</h1>
                        <section className='border-bottom pb-4'>
                            <div className="row">

                                {this.state.loadingAppointments ?
                                    <>
                                        <ClipLoader
                                            css={override}
                                            size={30}
                                            color={"#FF9595"}
                                            loading={true}
                                        />
                                    </> :
                                    (this.state.appointments.length ?
                                        this.state.appointments.map(appointment => {
                                            return (
                                                <div className="col-md-6 col-lg-3">
                                                    <div className="card product-card mt-3 box-shadow">
                                                        {/*<img src={hairm} className="card-img-top" alt="Card image"/>*/}

                                                        <div className="card-body">
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <h6 className="card-title">
                                                                    <LinesEllipsis
                                                                        text={appointment.service_name}
                                                                        maxLine='2'
                                                                        ellipsis='...'
                                                                        trimRight
                                                                        basedOn='letters'
                                                                    />
                                                                </h6>

                                                                <div className="product-price">

                                                                    {
                                                                        appointment.old_cost ?
                                                                            <span
                                                                                className="text-muted product-meta font-size-sm strikethrough-red">
																				{currencyFormat(appointment.old_cost)}
                                                                                <br/>
																			</span>
                                                                            :
                                                                            null
                                                                    }

                                                                    <span className="text-accent">
																		{currencyFormat(appointment.cost)}
																	</span>
                                                                </div>
                                                            </div>
                                                            <p className="card-text font-size-sm text-muted mb-1">
																<span className="text-accent mr-2"> <i
                                                                    className="czi-user"/> </span>
                                                                {appointment.worker_name}
                                                            </p>

                                                            <p className="card-text font-size-sm text-muted mb-1">
																<span className="text-accent mr-2"> <i
                                                                    className="czi-bell"/> </span>
                                                                <Moment format="D MMM YYYY" withTitle>
                                                                    {appointment.start_at}
                                                                </Moment>
                                                            </p>

                                                            <p className="card-text font-size-sm text-muted mb-1">
																<span className="text-accent mr-2"> <i
                                                                    className="czi-time"/> </span>
                                                                <Moment format="hh:mm:ss" withTitle>
                                                                    {appointment.start_at}
                                                                </Moment>
                                                                &nbsp;to&nbsp;
                                                                <Moment format="hh:mm:ss" withTitle>
                                                                    {appointment.end_at}
                                                                </Moment>
                                                            </p>
                                                        </div>

                                                    </div>
                                                </div>
                                            )
                                        }) :
                                        "No appointments yet")
                                }
                            </div>
                        </section>
                    </div>

                    <section>
                        <div className="pt-1 pb-5">
                            <h1 className="h4 text-dark mb-0 mt-4">Services</h1>

                            <section className="mb-5 pb-5">
                                <div className="mt-3">
                                    <div className="row">
                                        <ServiceCardCollection/>
                                    </div>
                                </div>
                            </section>

                        </div>

                    </section>
                </div>

            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);