import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import {Link} from "react-router-dom";
import avatar from "../../assets/images/user 2.svg"
import Endpoint from "../../utils/endpoint";
import ClipLoader from "react-spinners/ClipLoader";
import Pagination from "react-js-pagination";
import {currencyFormat} from "../../utils/helpers";

class WorkerAppointments extends Component {

    state = {
        toastAdded: false,
        attendants: [],
        allAppointments: [],
        loading: false,
        viewAttendants: false,
        activePage: 1,
    };

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    }

    toggleToastAdded = () => {
        this.setState({toastAdded: !this.state.toastAdded});
        let currentState = this;
        setTimeout(function () {
            currentState.setState({toastAdded: false});
        }, 5000);
    };

    loadDataFromServer = () => {
        this.setState({loading: true});

        Endpoint.getShopAttendants()
            .then(res => {
                console.log(res.data);
                this.setState({loading: false, attendants: res.data.data})
            })

        Endpoint.getAllAppointments()
            .then(res => {
                this.setState({allAppointments: res.data.data.data, listReviewData: res.data.data});
                console.log(this.state.listReviewData);
            })
    };

    componentDidMount() {
        this.loadDataFromServer()
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
                                <Link className="text-nowrap" to="/admin">
                                    <i className="czi-home"/> Home
                                </Link>
                            </li>

                            <li className="breadcrumb-item">
                                <Link className="text-nowrap" to="">
                                    <i className="czi-"/>Dashboard
                                </Link>
                            </li>

                            <li className="breadcrumb-item text-nowrap active" aria-current="page">Appointments</li>
                        </ol>
                    </nav>

                    {
                        this.state.viewAttendants ?
                            <div className="d-flex flex-row flex-wrap justify-content-between align-items-center">
                                <h2 className="mt-lg-1 pt-lg-1">Appointments by Attendant</h2>

                                <button className="btn btn-outline-green-dark"
                                        onClick={() => this.setState({viewAttendants: false})}>
                                    <i className="czi-eye mr-2"/>
                                    View All
                                </button>
                            </div>
                            :
                            <div className="row mb-2">
                                <div className="col-auto d-block">
                                    <h2 className="mt-lg-1 pt-lg-1">All Appointments</h2>
                                </div>

                                <div className="col-auto ml-auto">
                                    <div className="row">

                                        <div className="col-auto">
                                            <button className="btn btn-outline-green-dark d-inline"
                                                    onClick={() => this.setState({viewAttendants: true})}>
                                                <i className="czi-eye mr-2"/>
                                                View By Attendant
                                            </button>
                                        </div>

                                    </div>

                                </div>
                            </div>
                    }
                </div>

                <div className="pt-1 pb-5">
                    <section>
                        <div className="pt-1 pb-5">

                            <section className="mb-5 pb-5">
                                <div className="mt-3">

                                    <div className="">
                                        {
                                            this.state.loading ?
                                                <div className="sweet-loading my-5vh mr-3">
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-3">
                                                            <div className=" product-card box-shadow">
                                                                <div className="card-body">
                                                                    <ClipLoader
                                                                        css={override}
                                                                        size={70}
                                                                        color={"#FF9595"}
                                                                        loading={this.state.loading}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <section className='border-bottom pb-4'>
                                                    {
                                                        this.state.viewAttendants ?
                                                            <div className="row">
                                                                {
                                                                    this.state.attendants ?
                                                                        this.state.attendants.map((attendant, i) => {
                                                                            return (
                                                                                <div key={i}
                                                                                     className="col-lg-2 col-md-4 my-2">
                                                                                    <div
                                                                                        className="text-center border p-3">
                                                                                        <img src={avatar}
                                                                                             className="card-img-top"
                                                                                             alt="Card image"
                                                                                             style={{width: '80px'}}/>
                                                                                        <div className="card-body">
                                                                                            <div
                                                                                                className="d-flex justify-content-center">
                                                                                                <Link to={{
                                                                                                    pathname: "/cashier/attendantSchedule",
                                                                                                    state: {data: attendant}
                                                                                                }}>
                                                                                                    <h6 className="card-title text-center text-accent">
                                                                                                        {attendant.user.last_name} {attendant.user.first_name}
                                                                                                    </h6>
                                                                                                </Link>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                        :
                                                                        <h5 className="text-center mt-3">No attendants
                                                                            created</h5>
                                                                }
                                                            </div>
                                                            :
                                                            <div className="row">

                                                                <div className='table-responsive'>
                                                                    <table className="table">
                                                                        <thead>
                                                                        <tr className="font-weight-bold">
                                                                            <td>Customer</td>
                                                                            <td>Service</td>
                                                                            <td>Amount</td>
                                                                            <td>Start Time</td>
                                                                            {/*<td>Actions</td>*/}
                                                                        </tr>
                                                                        </thead>

                                                                        <tbody>
                                                                        {
                                                                            this.state.allAppointments ?
                                                                                this.state.allAppointments.map((appointment, index) =>
                                                                                    <tr key={index}>
                                                                                        <td>{appointment.order.buyer_name}</td>
                                                                                        <td>
                                                                                            {appointment.service_name}<br/>
                                                                                            <small>Attendant: {appointment.worker_name ?? 'Not assigned'}</small>
                                                                                        </td>
                                                                                        <td>{currencyFormat(appointment.service.cost)}</td>
                                                                                        <td>
                                                                                            {new Date(appointment.start_at).toDateString()}
                                                                                        </td>
                                                                                        {/*
                                                                                        <td>
                                                                                            <button
                                                                                                className="btn btn-sm btn-primary">
                                                                                                <i className='fa fa-edit'/> Edit
                                                                                            </button>
                                                                                        </td>
                                                                                        */}
                                                                                    </tr>
                                                                                )
                                                                                :
                                                                                <h5 className="text-center mt-3">No
                                                                                    appointments currently</h5>
                                                                        }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                    }
                                                </section>
                                        }
                                    </div>
                                </div>
                            </section>
                        </div>

                        {this.state.listReviewData ?
                            this.state.listReviewData.last_page > 1 ?
                                <div className="row justify-content-center">
                                    <Pagination
                                        activePage={this.state.activePage ? this.state.activePage : null}
                                        itemsCountPerPage={this.state.listReviewData ? this.state.listReviewData.per_page : null}
                                        totalItemsCount={this.state.listReviewData ? this.state.listReviewData.total : null}
                                        pageRangeDisplayed={5}
                                        onChange={this.handlePageChange.bind(this)}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                    />
                                </div>
                                :
                                null
                            :
                            null
                        }

                    </section>
                </div>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkerAppointments);