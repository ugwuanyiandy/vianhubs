import React, {Component} from "react";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps,} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import {Col, Modal, Row} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import {currencyFormat, durationCovert} from "../../utils/helpers"
import {Link} from "react-router-dom";


class ManageCoupons extends Component {
	state = {
		// createShopServiceCard:true
	};
	
	changeText = (event) => {
		const target = event.target;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;
		
		this.setState({
			[name]: value,
		});
	};
	
	loadEditData = (data) => {
		this.setState({
			coupon_code: data.code,
			coupon_discount: data.discount,
			percentage: data.percentage,
			start_at: data.start_at,
			end_at: data.end_at,
			createCouponCard: true,
			current_state_title: "Update",
			successMsg: false,
		});
		console.log(data, "Coupon Data")
	};
	
	
	handleCreateCoupon = () => {
		var code = document.getElementById("code").value;
		var discount = document.getElementById("discount").value;
		var start = document.getElementById("start").value;
		var end = document.getElementById("end").value;
		var percent = document.getElementById("percent").value;
		
		if (code == "" || discount == "" || start == "" || end == "" ||
			percent == "") {
			this.setState({errorMsg: true, content_message: "All fields are to be filled"});
			setTimeout(() => {
				this.setState({errorMsg: false})
			}, 3000);
			return false
		}
		
		var begin = document.getElementById("start").value;
		var finish = document.getElementById("end").value;
		
		if (begin > finish) {
			this.setState({errorMsg: true, content_message: "End Date must be after start date"});
			setTimeout(() => {
				this.setState({errorMsg: false})
			}, 3000);
			return false
		}
		
		this.setState({spinner: true});
		const payload = {
			code: this.state.coupon_code,
			discount: this.state.coupon_discount,
			start_at: this.state.start_time,
			end_at: this.state.end_time,
			percentage: document.getElementById("percent").checked ? 1 : 0
		};
		
		Endpoint.createShopCoupon(payload)
			.then((res) => {
				console.log(payload);
				this.setState({successMsg: true, spinner: false, createCouponCard: false});
				this.componentDidMount();
			})
			.catch((error) => {
				console.log(error + "error")
				this.setState({
					spinner: false,
					errorMsg: true,
					content_message: "Oops! Request Failed. Check that you have an active internet connection and try again"
				})
				setTimeout(() => {
					this.setState({errorMsg: false})
				}, 3000)
			});
		
	};
	
	handleUpdateCoupon = () => {
		this.setState({spinner: true});
		const payload = {
			code: this.state.coupon_code,
			discount: this.state.coupon_discount,
			start_at: this.state.start_time,
			end_at: this.state.end_time,
			percentage: document.getElementById("percent").checked ? 1 : 0
		};
		Endpoint.editShopCoupon(payload, this.state.coupon_code)
			.then((res) => {
				this.setState({successMsgUpdate: true, spinner: false, createCouponCard: false});
				this.componentDidMount();
			})
			.catch((error) => {
				console.log(error + "error");
				this.setState({
					errorMsg: true,
					content_message: "Oops! An error occurred. Check that you have an active internet connection and try again",
				});
				
				setTimeout(() => {
					this.setState({
						errorMsg: false
					})
				}, 4000)
			});
	};
	
	getShopCoupons = () => {
		Endpoint.getAllShopCoupons()
			.then(res => {
				this.setState({shopCoupons: res.data.data.data});
				console.log(res.data.data)
			})
	};
	
	
	handleDeleteShopCoupon = () => {
		this.setState({deleteModal: false});
		console.log(this.state.coupon_code);
		Endpoint.deleteShopCoupon(this.state.coupon_code)
			.then((res) => {
				console.log(res)
				this.componentDidMount();
			})
	}
	
	promptDelete = (a) => {
		// this.loadData(a);
		this.setState({
			deleteModal: true,
			coupon_code: a.code,
		})
	}
	
	// loadData = (data) => {
	//   this.setState({
	//     id:data.id
	
	//   })
	// }
	
	
	componentDidMount() {
		this.getShopCoupons();
		// this.getWorkerTypes();
	}
	
	
	render() {
		
		const override = {
			display: 'block',
			margin: '0 auto',
			// borderColor: 'red',
		};
		return (
			<>
				
				<Modal show={this.state.successMsgUpdate} size="sm">
					<Modal.Header></Modal.Header>
					<Modal.Body>
						<p>Shop Service updated successfully !</p>
					</Modal.Body>
					<Modal.Footer>
						<button
							className="btn btn-custom"
							onClick={() => {
								this.setState({successMsgUpdate: false});
							}}
						>
							Ok
						</button>
					</Modal.Footer>
				</Modal>
				<Modal show={this.state.deleteModal} size="sm">
					<Modal.Header>
					</Modal.Header>
					<Modal.Body>
						<p>Delete {this.state.service_name}?</p>
					</Modal.Body>
					<Modal.Footer>
						<button className="btn btn-green-dark"
								onClick={this.handleDeleteShopCoupon}
						>
							<i className="czi-check mr-2"/>
							Confirm
						</button>
						
						<button className="btn btn-outline-danger" onClick={() => {
							this.setState({deleteModal: false})
						}}>Close
						</button>
					</Modal.Footer>
				</Modal>
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
							
							<li className="breadcrumb-item text-nowrap active"
								aria-current="page">
								Coupons
							</li>
						</ol>
					</nav>
					
					<div className="d-flex flex-wrap justify-content-between align-items-center">
						<h2 className="mt-lg-1 pt-lg-1">Manage Coupons</h2>
						
						<button className="btn btn-pink mt-2"
								onClick={() => {
									this.setState({
										createCouponCard: true,
										successMsg: false,
										coupon_code: "",
										coupon_discount: "",
										percentage: true,
										start_at: "",
										end_at: "",
										current_state_title: "Create"
									});
								}}
						>
							<i className="czi-add mr-2"/>
							Add a coupon
						</button>
					</div>
				
				</div>
				
				<div className="pt-1 pb-5">
					<section>
						<div className="box-shadow rounded-lg overflow-hidden p-3 bg-white">
							<div className="pt-1 pb-5">
								<section className="mb-3">
									<div className="mt-3">
										<div className="table-responsive">
											<table className="table table-hover">
												
												<thead className="thead-light">
												<tr className="font-weight-bold">
													<td>S/No</td>
													<td>Coupon Code</td>
													<td>Discount</td>
													<td>Percentage</td>
													<td>Start Date</td>
													<td>End Date</td>
													<td>Action</td>
												</tr>
												</thead>
												
												<tbody>
												{this.state.shopCoupons &&
												this.state.shopCoupons.map((a, b) => {
													return (
														<tr>
															<td>{b + 1}</td>
															<td>{a.code}</td>
															<td>{a.discount}</td>
															<td>{a.percentage}</td>
															<td> {new Date(a.start_at).toDateString()} </td>
															<td> {new Date(a.end_at).toDateString()} </td>
															
															<td>
																<button className="btn btn-outline-green-dark btn-sm"
																		onClick={() => this.loadEditData(a)}
																>
																	<i className="czi-edit"/>
																</button>
																&nbsp;
																<button className="btn btn-outline-danger btn-sm"
																		onClick={() => this.promptDelete(a)}
																>
																	<i className="czi-trash"/>
																</button>
															</td>
														</tr>
													);
												})}
												
												{!this.state.shopCoupons ? <tr>
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
				<form>
					
					<Modal show={this.state.successMsg} size="sm">
						<Modal.Header>
						</Modal.Header>
						<Modal.Body>
							<p>Coupon was created
								successfully !</p>
						</Modal.Body>
						<Modal.Footer>
							<button className="btn btn-green-dark"
									onClick={() => {
										this.setState({successMsg: false})
									}}
							>
								Ok
							</button>
						
						</Modal.Footer>
					</Modal>
					
					<Modal show={this.state.createCouponCard} size="lg">
						<Modal.Header>
							<Modal.Title id="contained-modal-title-vcenter">
								{this.state.current_state_title} Coupon
							</Modal.Title>
						</Modal.Header>
						{/* {this.state.successMsg ? (
            <div className="bg-success border-rad-2 text-center p-2 mb-3">
              <p className="small text-light mb-0">
                <i className="czi-bell mr-2" /> Shop Service was created
                successfully !
              </p>
            </div>
          ) : null} */}
          
						<Modal.Body>
							
							{this.state.errorMsg ? (
								<div className="bg-danger border-rad-2 text-center p-2 mb-3">
									<p className="small text-light mb-0">
										<i className="czi-bell mr-2"/> {this.state.content_message}
									</p>
								</div>
							) : null}
							
							<br/>
							<Row>
								<Col xs={6} md={6}>
									<div className="input-group-overlay form-group">
										<div className="input-group-prepend-overlay">
											<span className="input-group-text">
											  <i className="czi-edit"/>
											</span>
										</div>
										<input
											className="form-control prepended-form-control"
											type="text"
											onChange={this.changeText}
											name="coupon_code"
											defaultValue={this.state.coupon_code}
											placeholder="Coupon Code"
											required
											id="code"
										/>
									</div>
								</Col>
								<Col xs={6} md={6}>
									<div className="input-group-overlay form-group">
										<div className="input-group-prepend-overlay">
											<span className="input-group-text">
											  <i className="czi-discount"/>
											</span>
										</div>
										<input
											className="form-control prepended-form-control"
											type="text"
											onChange={this.changeText}
											name="coupon_discount"
											defaultValue={this.state.coupon_discount}
											placeholder="Coupon Discount"
											required
											id="discount"
										/>
									</div>
								</Col>
							</Row>

							<Row>
								<Col xs={12} md={8}>
									<div className="input-group-overlay form-group">

										<div className="custom-control custom-checkbox">
											<input className="custom-control-input" type="checkbox" name="percentage"
												   id="percent" onChange={this.changeText} />
											<label className="custom-control-label" htmlFor="percent">Percentage</label>
										</div>

										<small> <i className="czi-announcement"/> If unchecked, discount is set to amount instead of percentage</small>
									</div>
								</Col>
							</Row>
							
							<Row>
								<Col xs={6} md={6}>
									<label>Start Date</label>
									<div className="input-group-overlay form-group">
										<div className="input-group-prepend-overlay">
											<span className="input-group-text">
											  <i className="czi-time"/>
											</span>
										</div>
										<input
											className="form-control prepended-form-control"
											type="date"
											onChange={this.changeText}
											name="start_time"
											defaultValue={this.state.start_at}
											placeholder="Start at"
											required
											id="start"
										/>
									</div>
								</Col>
								
								<Col xs={6} md={6}>
									<label>End Date</label>
									<div className="input-group-overlay form-group">
										<div className="input-group-prepend-overlay">
											<span className="input-group-text">
											  <i className="czi-time"/>
											</span>
										</div>
										
										<input
											className="form-control prepended-form-control"
											type="date"
											onChange={this.changeText}
											name="end_time"
											defaultValue={this.state.end_at}
											placeholder="End At"
											required
											id="end"
										
										/>
									</div>
								</Col>
							</Row>
							
							{this.state.spinner ? (
								<div className="sweet-loading">
									<ClipLoader
										css={override}
										size={30}
										color={"#FF9595"}
										loading={this.state.spinner}
									/>
								</div>
							) : null}
						</Modal.Body>
						<Modal.Footer>
							
							{this.state.current_state_title == "Create" ? <button
								className="btn btn-green-dark"
								onClick={this.handleCreateCoupon}
							>
								<i className="czi-add mr-2"/>
								Add Coupon
							</button> : this.state.current_state_title == "Update" ?
								
								<button
									className="btn btn-green-dark"
									onClick={this.handleUpdateCoupon}
								>
									<i className="czi-check mr-2"/>
									Update Coupon
								</button> : null
							}
							
							<button
								className="btn btn-outline-danger"
								onClick={() => {
									this.setState({createCouponCard: false});
								}}
							>
								Close
							</button>
						</Modal.Footer>
					</Modal>
				
				
				</form>
			
			</>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoupons);
