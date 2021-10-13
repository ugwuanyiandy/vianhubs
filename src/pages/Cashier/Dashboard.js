import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import {Link} from "react-router-dom";
import Endpoint from "../../utils/endpoint";
import {currencyFormat, handleFormSubmissionError} from "../../utils/helpers";

class CashierDash extends Component {

    state = {
        confirmAppointment: false,
        toastConfirmed: false,
        apptLoad: false,
        loading: false,
        orders: [],
        earnTotal: "",
    };

    loadDataFromServer = () => {
        this.setState({apptLoad: true});
        this.setState({earnLoad: true});

        Endpoint.getShopAppointments()
            .then(res => {
                this.setState({appointments: res.data.data.data});

                let arr = this.state.appointments;
                const total = arr.reduce((total, obj) => obj.cost + total, 0);
                this.setState({earnTotal: total, loading: false});
            })
            .catch((error) => handleFormSubmissionError(error, this));

        Endpoint.getShopOrders()
            .then(res => {
                this.setState({apptLoad: false, orders: res.data.data.data});
            })
            .catch((error) => handleFormSubmissionError(error, this));

    };

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

                            <li className="breadcrumb-item text-nowrap active" aria-current="page">My Dashboard</li>
                        </ol>
                    </nav>

                    <div className="d-flex justify-content-between">
                        <h2 className="mt-lg-1 pt-lg-1">Dashboard</h2>
                        <Link to="/cashier/checkout" className="btn btn-sm btn-green-dark my-auto">
                            <i className="czi-cart mr-2"/> Go To Cart
                        </Link>
                    </div>

                </div>

                <div className="pt-1 pb-5">
                    {/*<div className="d-flex flex-wrap justify-content-between">*/}
                    {/*	<h1 className="h4 text-dark mb-2">Upcoming Appointments</h1>*/}
                    {/*	<Link to="/cashier/services" >*/}
                    {/*		<button className="btn btn-outline-green-dark btn-sm mb-2"><i className="czi-add mr-2"/>Add Appointment</button>*/}
                    {/*	</Link>*/}
                    {/*</div>*/}

                    {/*{*/}
                    {/*	this.state.apptLoad ?*/}
                    {/*		<div className="sweet-loading my-5vh mr-3">*/}
                    {/*			<div className="row justify-content-center">*/}
                    {/*				<div className="col-md-3">*/}
                    {/*					<div className=" product-card box-shadow">*/}
                    {/*						<div className="card-body">*/}
                    {/*							<ClipLoader*/}
                    {/*								css={override}*/}
                    {/*								size={70}*/}
                    {/*								color={"#FF9595"}*/}
                    {/*								loading={this.state.apptLoad}*/}
                    {/*							/>*/}
                    {/*						</div>*/}
                    {/*					</div>*/}
                    {/*				</div>*/}
                    {/*			</div>*/}
                    {/*		</div>*/}
                    {/*		:*/}
                    {/*		<section className='border-bottom pb-4'>*/}
                    {/*			<div className="row">*/}

                    {/*				{*/}
                    {/*					this.state.orders.length ?*/}
                    {/*						this.state.orders.map( (order) => {*/}
                    {/*							return (*/}
                    {/*								<div className="col-md-6 col-lg-3">*/}
                    {/*									<div className="card product-card mt-3 box-shadow">*/}
                    {/*										/!*<img src={hairm} className="card-img-top" alt="Card image"/>*!/*/}

                    {/*										<div className="card-body">*/}
                    {/*											<div className="d-flex justify-content-between">*/}
                    {/*												<h6 className="card-title">*/}
                    {/*													<LinesEllipsis*/}
                    {/*														text={order.service.name}*/}
                    {/*														maxLine='2'*/}
                    {/*														ellipsis='...'*/}
                    {/*														trimRight*/}
                    {/*														basedOn='letters'*/}
                    {/*													/>*/}
                    {/*												</h6>*/}

                    {/*												<div className="product-price">*/}
                    {/*													<span className="text-accent">${order.service.cost}</span>*/}
                    {/*												</div>*/}
                    {/*											</div>*/}
                    {/*											<p className="card-text font-size-sm text-muted mb-1">*/}
                    {/*												<span className="text-primary mr-2">*/}
                    {/*													<i className="czi-user"/>*/}
                    {/*												</span>*/}
                    {/*												{order.worker_name}*/}
                    {/*											</p>*/}

                    {/*											<p className="card-text font-size-sm text-muted mb-1">*/}
                    {/*												<span className="text-primary mr-2"> <i*/}
                    {/*													className="czi-bell"/>*/}
                    {/*												</span>*/}
                    {/*												{new Date(order.start_at).toLocaleDateString("en-NG")} &nbsp;*/}
                    {/*												{new Date(order.start_at).toLocaleTimeString("en-NG")}*/}
                    {/*												/!*{order.start_at}*!/*/}
                    {/*											</p>*/}

                    {/*											<p className="card-text font-size-sm text-muted mb-1">*/}
                    {/*												<span className="text-primary mr-2">*/}
                    {/*													<i className="czi-time"/>*/}
                    {/*												</span>*/}
                    {/*												{order.service.duration} mins*/}
                    {/*											</p>*/}

                    {/*											<button className="btn btn-custom btn-sm mt-2">*/}
                    {/*												<i className="czi-check mr-2"/> Confirm Appointment*/}
                    {/*											</button>*/}
                    {/*										</div>*/}

                    {/*									</div>*/}
                    {/*								</div>*/}
                    {/*							)*/}
                    {/*						})*/}
                    {/*						:*/}
                    {/*						<div className='col-12 mt-4'>*/}
                    {/*							<div className='bg-white shadow p-5 text-center border-rad-2'>*/}
                    {/*								<h5 className="text-center mb-0">No appointments made yet.</h5>*/}
                    {/*							</div>*/}
                    {/*						</div>*/}
                    {/*				}*/}
                    {/*			</div>*/}
                    {/*		</section>*/}
                    {/*}*/}

                    <section>
                        <div className="box-shadow rounded-lg overflow-hidden p-3 bg-white">
                            <div className="pt-1 pb-5">
                                <h1 className="h4 text-dark mb-0 mt-4 mr-3 d-inline">Today's Earnings</h1>
                                <h5 className="text-accent d-inline">
                                    {currencyFormat(this.state.earnTotal)}
                                </h5>

                                <section className="mb-3">
                                    <div className="mt-3">
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead className="thead-light">
                                                <tr className='font-weight-bold'>
                                                    <td>S/No</td>
                                                    <td>Customer</td>
                                                    <td>Service</td>
                                                    <td>Amount</td>
                                                    <td>Time</td>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    this.state.orders ?
                                                        this.state.orders.map((order, index) => {
                                                            return (
                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td>{order.order.buyer_name}</td>
                                                                    <td>{order.service.name}</td>
                                                                    <td>{order.service.cost}</td>
                                                                    <td>
                                                                        {/*{new Date(order.start_at).toLocaleDateString("en-NG")} &nbsp;*/}
                                                                        {new Date(order.start_at).toLocaleTimeString("en-NG")}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                        :
                                                        <tr>
                                                            <td colSpan='5'>
                                                                <h5 className="text-center">No earnings yet.</h5>
                                                            </td>
                                                        </tr>
                                                }
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
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CashierDash);