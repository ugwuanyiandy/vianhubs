import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import Moment from "react-moment";
import Endpoint from "../../utils/endpoint";
import {currencyFormat, handleFormSubmissionError} from "../../utils/helpers";
import ClipLoader from "react-spinners/ClipLoader";
import {Link} from "react-router-dom";

class CashierAttendantSchedule extends Component {

    state = {
        confirmAppointment: false,
        receivedAttendant: this.props.location.state.data,
        attendant: [],
        schedule: [],
        filter: "all",
        apptTotal: "",
        earnedTotal: "",
    };


    filterSchedule = (filter) => {
        this.setState({loading: true});
        const attendantId = this.state.receivedAttendant.user.id;

        Endpoint.getAttendantAppointments(attendantId, filter)
            .then(res => {
                this.setState({schedule: res.data.data.data, filter: filter, loading: false});
            })
            .catch((error) => handleFormSubmissionError(error, this));
    };

    loadDataFromServer = () => {
        this.setState({loading: true});
        const attendantId = this.state.receivedAttendant.user.id;

        Endpoint.getAttendantAppointments(attendantId)
            .then(res => {
                this.setState({schedule: res.data.data.data});
                console.log(res.data.data);

                let arr = this.state.schedule;

                let paid = [];
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].served) {
                        paid.push(arr[i]);
                    }
                }

                const earnedTotal = paid.reduce((earnedTotal, obj) => obj.service.cost + earnedTotal, 0);
                this.setState({earnedTotal: earnedTotal, loading: false});

                const total = arr.reduce((total, obj) => obj.service.cost + total, 0);
                this.setState({apptTotal: total, loading: false});
            })
            .catch((error) => handleFormSubmissionError(error, this));
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
                                    <i className="czi-home"/>
                                    Home
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link className="text-nowrap" to="">
                                    <i className="czi-"/> Dashboard
                                </Link>
                            </li>

                            <li className="breadcrumb-item text-nowrap active" aria-current="page"> Schedule
                            </li>
                        </ol>
                    </nav>

                    <div className="d-flex flex-wrap justify-content-between">
                        <h2 className="mt-lg-1 pt-lg-1">
                            {this.state.receivedAttendant.user.first_name} {this.state.receivedAttendant.user.last_name} Schedule
                            <span className="h4 text-muted">/{this.state.filter}</span>
                        </h2>

                        <div>
                            <button className="btn btn-sm btn-outline-accent"
                                    onClick={() => this.filterSchedule("all")}>All
                            </button>
                            <button className="btn btn-sm btn-outline-accent"
                                    onClick={() => this.filterSchedule("active")}>Active
                            </button>
                            <button className="btn btn-sm btn-outline-accent"
                                    onClick={() => this.filterSchedule("paid")}>Paid
                            </button>
                            <button className="btn btn-sm btn-outline-accent"
                                    onClick={() => this.filterSchedule("unpaid")}>UnPaid
                            </button>
                        </div>
                    </div>

                </div>

                <div className="pt-1 pb-5">
                    <h1 className="h4 text-dark font-weight-normal">Today's Appointments</h1>
                    <h5 className="my-auto mb-5 text-custom font-weight-light"><Moment format="D MMM YYYY"
                                                                                       withTitle>{new Date()}</Moment>
                    </h5>

                    <div className="row mt-5">
                        <div className="col-lg-8 border-right">

                            {this.state.loading ?
                                <div className="sweet-loading mt-5 mr-3">
                                    <ClipLoader
                                        css={override}
                                        size={30}
                                        color={"#FF9595"}
                                        loading={this.state.loading}
                                    />
                                </div>
                                :

                                this.state.schedule ?
                                    this.state.schedule.map((appt) => {
                                        return (
                                            <div className="row my-2">
                                                <div className="col-md-9">
                                                    <div className="card box-shadow bg-light">
                                                        <div className="card-body">
                                                            <div className="d-flex justify-content-between">

                                                                <div className='d-flex'>
                                                                    <p className="h4 ml-lg-4 mr-3 my-auto"><i
                                                                        className="czi-time text-custom"/></p>

                                                                    <div className='border-left pl-4'>
                                                                        <h6 className='text-custom mb-2'>{appt.service.name}</h6>
                                                                        <p className="font-weight-light text-custom mb-0">{appt.order.buyer_name}</p>
                                                                    </div>

                                                                </div>

                                                                <p className='text-custom my-auto font-weight-bold'>
                                                                    {/*<Moment format="D MMM YYYY" withTitle>{appt.start_at}</Moment>*/}
                                                                    {currencyFormat(appt.service.cost)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        )

                                    })
                                    :
                                    <h3 className='text-center mt-4'>No appointments made yet </h3>
                            }

                        </div>

                        <div className="col-lg-4">

                            <div className="card bg-secondary shadow-none border-0">
                                <div className="card-body">
                                    <p className="card-title mb-0">Total Appointments</p>
                                    <p className="h2 card-text">{this.state.schedule.length}</p>
                                </div>
                            </div>
                            <hr/>

                            <div className="card bg-secondary shadow-none border-0">
                                <div className="card-body">
                                    <p className="card-title mb-0">Confirmed Appointments</p>
                                    <p className="h2 card-text">0</p>
                                </div>
                            </div>
                            <hr/>

                            <div className="card bg-secondary shadow-none border-0">
                                <div className="card-body">
                                    <p className="card-title mb-0">Amount Earned</p>
                                    <p className="h2 card-text text-custom">
                                        {
                                            this.state.earnedTotal ?
                                                currencyFormat(this.state.earnedTotal)
                                                :
                                                "₦0.00"
                                        }
                                    </p>
                                </div>
                            </div>
                            <hr/>

                            <div className="card bg-secondary shadow-none border-0">
                                <div className="card-body">
                                    <p className="card-title mb-0">Potential Earnings</p>
                                    <p className="h2 card-text text-accent">{currencyFormat(this.state.apptTotal)}</p>
                                </div>
                            </div>
                            <hr/>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CashierAttendantSchedule);