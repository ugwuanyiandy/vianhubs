import React, {Component} from "react";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys,} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import {currencyFormat} from "../../utils/helpers";
import ClipLoader from "react-spinners/ClipLoader";
import moment from "moment";
import {Link} from "react-router-dom";
import {getUser} from "../../utils/auth";

class AttendantSchedule extends Component {
    state = {
        toastAdded: false,
        confirmAppointment: false,
        toastConfirmed: false,
        filter: "active"
    };

    toggleToastAdded = () => {
        this.setState({toastAdded: !this.state.toastAdded});
        let currentState = this;
        setTimeout(function () {
            currentState.setState({toastAdded: false});
        }, 5000);
    };
    toggleToastConfirmed = () => {
        this.setState({toastConfirmed: !this.state.toastConfirmed});
        let currentState = this;
        setTimeout(function () {
            currentState.setState({toastConfirmed: false});
        }, 5000);
    };

    getSessions = () => {
        this.setState({loading: true});
        const user = getUser();
        Endpoint.getAttendantSessionsDefault(user.worker_profile.id).then(
            (res) => {
                this.setState({
                    attendantSessions: res.data.data.data,
                    loading: false,
                });
                console.log("Sessions", res.data.data.data);
            }
        );
    };
    getEarnings = () => {
        var todayDate = new Date();
        var day = todayDate.getDate();
        var endDay = todayDate.getDate() + 1;
        var month = todayDate.getMonth() + 1;
        var year = todayDate.getFullYear();
        var start = year + "-" + month + "-" + day;
        var end = year + "-" + month + "-" + endDay;
        this.setState({attendantEarnings: false});

        const user = getUser();
        Endpoint.getAttendantEarnings(
            start, end, user.worker_profile?.id
        ).then((res) => {
            this.setState({attendantEarnings: res.data.data});
            console.log("Earnings", this.state.attendantEarnings);
        });
    };

    componentDidMount() {
        this.getSessions();
        this.getEarnings();
    }

    filterSchedule = (e) => {
        this.setState({filter: e.target.value, loading: true, attendantSessions: false});
        setTimeout(() => {
            this.componentDidMount();
        }, 2000)
    };

    filterSchedules = (value) => {
        this.setState({filter: value, loading: true, attendantSessions: false});
        setTimeout(() => {
            this.componentDidMount();
        }, 2000)
    };

    render() {
        const override = {
            display: "block",
            margin: "0 auto",
            // borderColor: 'red',
        };
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
                                    <i className="czi-"/>Dashboard
                                </Link>
                            </li>

                            <li
                                className="breadcrumb-item text-nowrap active"
                                aria-current="page"
                            >
                                Appointments
                            </li>
                        </ol>
                    </nav>


                    <div className="d-flex justify-content-between flex-wrap">
                        <h2 className="mt-lg-1 pt-lg-1">
                            Appointments
                            <span className="h4 text-muted">/{this.state.filter}</span>
                        </h2>

                        <div>
                            <button className={"btn btn-sm btn-outline-green-dark "
                            + (this.state.filter === 'active' ? 'btn-green-dark text-white' : '')}
                                    onClick={() => this.filterSchedules("active")}>Active
                            </button>
                            {/*<button className={"btn btn-sm btn-outline-accent "*/}
                            {/*+ (this.state.filter === 'paid' ? 'btn-accent text-white' : '')}*/}
                            {/*		onClick={() => this.filterSchedules("paid")}>Paid*/}
                            {/*</button>*/}
                            {/*<button className={"btn btn-sm btn-outline-accent "*/}
                            {/*+ (this.state.filter === 'unpaid' ? 'btn-accent text-white' : '')}*/}
                            {/*		onClick={() => this.filterSchedules("unpaid")}>UnPaid*/}
                            {/*</button>*/}
                            <button className={"btn btn-sm btn-outline-green-dark "
                            + (this.state.filter === 'all' ? 'btn-green-dark text-white' : '')}
                                    onClick={() => this.filterSchedules("all")}>All
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-1 pb-5">
                    {/* <h1 className="h4 text-dark mb-0">My Upcoming Appointments</h1> */}

                    <section className="border-bottom pb-4">
                        <div className="row">
                            {this.state.attendantSessions &&
                            this.state.attendantSessions.map((a) => {
                                return (
                                    <div className="col-md-6 col-lg-3">
                                        <div className="card product-card mt-3 box-shadow">
                                            {/*<img src={hairm} className="card-img-top" alt="Card image"/>*/}

                                            <div className="card-body">
                                                <div className="">
                                                    <h6 className="card-title">{a.service_name}</h6>
                                                </div>

                                                <hr className="my-3"/>

                                                <div className="product-price">
													<span className="text-green-dark font-weight-bold">
														<i className="czi-tag mr-2 text-accent"/>
                                                        {currencyFormat(a.cost)}
													</span>
                                                </div>

                                                <p className="card-text font-size-sm text-green-dark font-weight-bold mb-1">
													<span className="text-accent mr-2">
													  {" "}
                                                        <i className="czi-user"/>{" "}
													</span>
                                                    {a.order?.buyer_name}
                                                </p>

                                                <p className="card-text font-size-sm text-green-dark font-weight-bold mb-1">
													<span className="text-accent mr-2">
													  {" "}
                                                        <i className="czi-bell"/>{" "}
													</span>
                                                    {moment(a.created_at).format("lll")}
                                                </p>

                                                <p className="card-text font-size-sm text-green-dark font-weight-bold mb-1">
													<span className="text-accent mr-2">
													  {" "}
                                                        <i className="czi-time"/>{" "}
													</span>
                                                    {moment(a.created_at).format("lll")}
                                                </p>

                                                <button className="btn btn-outline-green-dark btn-sm mt-2">
                                                    <i className="czi-check mr-2"/> Confirm Appointment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {!this.state.attendantSessions ? (
                                <div className="sweet-loading" style={{paddingLeft: "200px"}}>
                                    <ClipLoader
                                        css={override}
                                        size={60}
                                        color={"#FF9595"}
                                        loading={this.state.spinner}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </section>

                    <section>
                        <div className="box-shadow rounded-lg overflow-hidden p-3 bg-white">
                            <div className="pt-1 pb-5">
                                <h1 className="h4 text-dark mb-0 mt-4 mr-3 d-inline">
                                    Today's Earnings
                                </h1>{" "}
                                <h5 className="text-accent d-inline">
                                    {currencyFormat(
                                        this.state.attendantEarnings == null
                                            ? ""
                                            : parseInt(this.state.attendantEarnings?.session_sum)
                                    )}
                                </h5>
                                <section className="mb-3">
                                    <div className="mt-3">
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead className="thead-light">
                                                <tr className="font-weight-bold">
                                                    <td>S/No</td>
                                                    <td>Service</td>
                                                    <td>Cost</td>
                                                    <td>Booked On</td>
                                                    <td>Appointment Time</td>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.attendantEarnings?.sessions?.data &&
                                                this.state.attendantEarnings?.sessions?.data.map(
                                                    (a, i) => {
                                                        return (
                                                            <tr>
                                                                <td>{i + 1}</td>
                                                                <td>{a.service_name}</td>
                                                                <td>{currencyFormat(a.cost)}</td>
                                                                <td>
                                                                    {moment(a.created_at).format("lll")}
                                                                </td>
                                                                <td>
                                                                    {moment(a.start_at).format("lll")}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </section>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AttendantSchedule);
