import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import ClipLoader from "react-spinners/ClipLoader";
import {currencyFormat, handleFormSubmissionError} from "../../utils/helpers";
import moment from "moment";
import LinesEllipsis from "react-lines-ellipsis";
import {Link} from "react-router-dom";
import CountCard from "../../components/Cards/CountCard";


class AdminDash extends Component {

    state = {
        addToCart: false,
        stat: {
            customers_count: 0,
            earnings: 0,
            orders_count: 0,
            paid_orders_count: 0,
            services_count: 0,
            sessions_count: 0,
            workers_count: 0
        },
        toastAdded: false,
        confirmAppointment: false,
        toastConfirmed: false,
        shopEarnings: [],
        loading: false,
        upcomingAppointments: [],
    };

    toggleAddToCart = () => {
        this.setState({addToCart: !this.state.addToCart});
    };
    toggleToastAdded = () => {
        this.setState({toastAdded: !this.state.toastAdded});
        let currentState = this;
        setTimeout(function () {
            currentState.setState({toastAdded: false});
        }, 5000);
    };

    toggleConfirmAppointment = () => {
        this.setState({confirmAppointment: !this.state.confirmAppointment});
    };

    toggleToastConfirmed = () => {
        this.setState({toastConfirmed: !this.state.toastConfirmed});
        let currentState = this;
        setTimeout(function () {
            currentState.setState({toastConfirmed: false});
        }, 5000);
    };

    loadDataFromServer = () => {
        this.setState({loading: true});

        Endpoint.getStatForAdminDashboard()
            .then((res) => {
                this.setState({stat: res.data.data});
            })
            .catch((error) => handleFormSubmissionError(error, this));


        Endpoint.getUpcomingAppointmentsAdmin()
            .then((res) => {
                this.setState({upcomingAppointments: res.data.data.data, loading: false});
            })
            .catch((error) => handleFormSubmissionError(error, this));
    };

    componentDidMount() {
        this.props.setState('home', stateKeys.PAGE_CLASS);

        this.props.setState('Sample content for dialog', stateKeys.DIALOG_CONTENT);
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
                                <Link className="text-nowrap" to="">
                                    <i className="czi-home"/>Home
                                </Link>
                            </li>

                            <li className="breadcrumb-item text-nowrap active" aria-current="page">Dashboard</li>
                        </ol>
                    </nav>

                    <h2 className="mt-lg-1 pt-lg-1">Admin Dashboard</h2>
                </div>

                <div className="pt-1 pb-5">
                    <section className='border-bottom pb-4'>
                        <>
                            <div className="row">
                                <div className="col-md-6 col-lg-4">
                                    <CountCard
                                        cardLink={'/admin/ManageShopCustomers'}
                                        cardTitle={'Customers'}
                                        cardIcon="czi-user"
                                        cardCount={this.state.stat.customers_count}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <CountCard
                                        cardLink={'/admin/ManageShopOrders'}
                                        cardTitle={'Orders (Paid)'}
                                        cardIcon="czi-book"
                                        cardCount={this.state.stat.paid_orders_count}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <CountCard
                                        cardLink={'/admin/ShopEarnings'}
                                        cardTitle={'Earnings'}
                                        cardIcon="czi-money-bag"
                                        cardCount={currencyFormat(this.state.stat.earnings)}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 col-lg-4">
                                    <CountCard
                                        cardLink={'/admin/ManageShopWorkers'}
                                        cardTitle={'Workers'}
                                        cardIcon="czi-server"
                                        cardCount={this.state.stat.workers_count}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <CountCard
                                        cardLink={'/admin/ManageShopServices'}
                                        cardTitle={'Services'}
                                        cardIcon="czi-gift"
                                        cardCount={this.state.stat.services_count}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <CountCard
                                        cardLink={'/admin/ManageShopAppointments'}
                                        cardTitle={'Appointments'}
                                        cardIcon="czi-time"
                                        cardCount={this.state.stat.sessions_count}
                                    />
                                </div>
                            </div>
                        </>
                    </section>

                    <section>
                        <h4 className="mt-lg-1 pt-lg-1">Upcoming Appointments</h4>
                        <div className="row">
                            {this.state.loading ?
                                <div className='mx-auto text-center'>
                                    <div className="sweet-loading mt-5 mr-3">
                                        <ClipLoader
                                            css={override}
                                            size={30}
                                            color={"#FF9595"}
                                            loading={this.state.loading}
                                        />
                                    </div>
                                </div>
                                :
                                this.state.upcomingAppointments.map((a, i) =>
                                    <div key={i} className="col-md-6">
                                        <div className="card product-card mt-3 box-shadow">
                                            {/*<img src={hairm} className="card-img-top" alt="Card image"/>*/}

                                            <div className="card-body">
                                                <div className="">
                                                    <h6 className="card-title font-weight-bold">
                                                        <LinesEllipsis
                                                            text={a.order?.buyer_name}
                                                            maxLine='2'
                                                            ellipsis='...'
                                                            trimRight
                                                            basedOn='letters'
                                                        />
                                                    </h6>
                                                </div>

                                                <hr className="my-3"/>

                                                <div className={'mb-2'}>
                                                    <h4 className="text-accent mb-0 font-size-sm font-weight-bold">
                                                        <i className="czi-gift mr-2"/> Service</h4>
                                                    <p className="card-text text-green-dark mb-1">
                                                        {a.service_name}
                                                    </p>
                                                </div>

                                                <div className="mb-2">
                                                    <h4 className="text-accent mb-0 font-size-sm font-weight-bold">
                                                        <i className="czi-tag mr-2 text-accent"/> Cost
                                                    </h4>
                                                    <span className="card-text text-green-dark mb-1">
                                                                {currencyFormat(a.cost)}
															</span>
                                                </div>

                                                <div className={'mb-2'}>
                                                    <h4 className="text-accent mb-0 font-size-sm font-weight-bold">
                                                        <i className="czi-time mr-2"/> Time</h4>
                                                    <p className="card-text text-green-dark mb-1">
                                                        {moment(a.start_at).format("dddd, MMMM Do YYYY, h:mma")} to {moment(a.end_at).format("h:mma")}
                                                    </p>
                                                </div>

                                                <div className={'mb-2'}>
                                                    <h4 className="text-accent mb-0 font-size-sm font-weight-bold">
                                                        <i className="czi-user mr-2"/> Attendant</h4>
                                                    <p className="card-text text-green-dark mb-1">
                                                        {a.worker_name}
                                                    </p>
                                                </div>
                                                {/*<button className="btn btn-outline-green-dark btn-sm mt-2">*/}
                                                {/*	<i className="czi-check mr-2"/> Confirm Appointment*/}
                                                {/*</button>*/}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </section>

                </div>

            </>

        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminDash);