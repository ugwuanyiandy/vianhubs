import React, {Component} from "react";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys,} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import {currencyFormat} from "../../utils/helpers";
import ClipLoader from "react-spinners/ClipLoader";
import {Link} from "react-router-dom";


class ShopEarnings extends Component {
    state = {
        toastAdded: false,
        confirmAppointment: false,
        toastConfirmed: false,
        startDate: null,
        endDate: null,
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
    getShopEarnings = () => {
        this.setState({shopEarnings: false})
        Endpoint.getShopEarnings(this.state.startDate, this.state.endDate)
            .then((res) => {
                this.setState({shopEarnings: res.data.data});
                console.log(this.state.shopEarnings, "shop");
            });
    };


    componentDidMount() {
        Endpoint.getShopEarningsLazy()
            .then((res) => {
                this.setState({shopEarnings: res.data.data});
                console.log(this.state.shopEarnings, "shop");
            });
        this.getShopEarnings();
        this.props.setState("home", stateKeys.PAGE_CLASS);

        this.props.setState("Sample content for dialog", stateKeys.DIALOG_CONTENT);
    }

    render() {
        const override = {
            display: 'block',
            margin: '0 auto',
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
                                    <i className="czi-"/> Dashboard
                                </Link>
                            </li>

                            <li className="breadcrumb-item text-nowrap active" aria-current="page">
                                Earningd
                            </li>
                        </ol>
                    </nav>

                    <h2 className="mt-lg-1 pt-lg-1">Shop Earnings</h2>
                </div>
                <div className="form-inline">
                    <label>From: &nbsp; </label>
                    <input type="date" className="form-control col-4"
                           onChange={(e) => this.setState({startDate: e.target.value.substring(0, 10)})}/>
                    &nbsp; &nbsp; &nbsp;
                    <label>To: &nbsp; </label>
                    <input type="date" className="form-control col-4"
                           onChange={(e) => this.setState({endDate: e.target.value.substring(0, 10)})}/>
                    &nbsp; &nbsp; &nbsp;
                    <button className="btn btn-green-dark" onClick={this.getShopEarnings}>Load</button>
                </div>
                <br/>

                <div className="pt-1 pb-5">
                    {/* <h1 className="h4 text-dark mb-0">My Upcoming Appointments</h1> */}

                    <section>
                        <div className="box-shadow rounded-lg overflow-hidden p-3 bg-white">
                            <div className="pt-1 pb-5">
                                <h1 className="h4 text-dark mb-0 mt-4 mr-3 d-inline">
                                    Total Earnings
                                </h1>{" "}
                                <h5 className="text-accent d-inline">
                                    {
                                        this.state.shopEarnings ?
                                            currencyFormat(this.state.shopEarnings.total)
                                            : currencyFormat(0)
                                    }

                                    {/*{currencyFormat(*/}
                                    {/*	this.state.shopEarnings == null*/}
                                    {/*		? "0"*/}
                                    {/*		: parseInt(this.state.shopEarnings?.total)*/}
                                    {/*)}*/}
                                </h5>
                                <section className="mb-3">
                                    <div className="mt-3">
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead className="thead-light">
                                                <tr className="font-weight-bold">
                                                    <td>S/No</td>
                                                    <td>Customer</td>
                                                    <td>Reference No.</td>
                                                    <td>Amount Paid</td>
                                                    <td>Date</td>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.shopEarnings != null &&
                                                this.state.shopEarnings.orders?.data.map((a, i) => {
                                                    return (
                                                        <tr>
                                                            <td>{i + 1}</td>
                                                            <td>{a.buyer_name}</td>
                                                            <td>{a.reference}</td>
                                                            <td>{currencyFormat(a.total)}</td>
                                                            <td>
                                                                {a.updated_at == null
                                                                    ? "-"
                                                                    : a.updated_at.slice(0, 10)}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                {!this.state.shopEarnings ? <tr>
                                                    <td>&nbsp;</td>
                                                    <td>&nbsp;</td>
                                                    <td>
                                                        <div className="sweet-loading">
                                                            <ClipLoader
                                                                css={override}
                                                                size={60}
                                                                color={"#FF9595"}
                                                                loading={this.state.spinner}
                                                            />
                                                        </div>
                                                    </td>

                                                </tr> : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopEarnings);
