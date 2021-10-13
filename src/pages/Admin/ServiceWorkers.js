import React, {Component} from "react";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps,} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import {Col, Modal, Row} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import {currencyFormat, durationCovert, handleAxiosError} from "../../utils/helpers"
import {Redirect, Link} from "react-router-dom";


class ServiceWorkers extends Component {
	state = {
		// service: this.props.location.state.data,
	};
	
	loadUsersData = () => {
		this.setState({
			slug: this.state.shopService.slug,
			addServiceWorkerCard: true,
			successMsg: false,
		})
	};
	
	setEditData = (data) => {
		this.setState({
			edit_slug: this.state.shopService.slug,
			edit_worker: data.pivot.worker_id,
			edit_worker_name: data.user.first_name + " " + data.user.last_name,
			edit_pct: data.pivot.worker_percentage,
			editServiceWorkerCard: true,
			successMsg: false,
		});
	};
	
	setSelectedWorker = (e) => {
		this.setState({selectedWorker: e.target.value});
	};
	
	setEditWorkerPercentage = (e) => {
		this.setState({edit_worker_pct: e.target.value});
	};
	
	setWorkerPercentage = (e) => {
		this.setState({percentage: e.target.value});
	};
	
	setRemovedWorker = (worker) => {
		this.setState({
			selectedWorker: worker.id,
			selectedWorkerName: worker.user.first_name + " " + worker.user.last_name,
			removeServiceWorkerCard: true,
		});
	};
	
	handleAddServiceWorker = () => {
		if (this.state.selectedWorker == null || this.state.percentage == null) {
			this.setState({errorMsg: true, content_message: "All fields are required"});
			setTimeout(() => {
				this.setState({errorMsg: false})
			}, 3000);
			return false
		}
		
		this.setState({spinner: true});
		const payload = {
			slug: this.state.shopService.slug,
			worker_id: this.state.selectedWorker,
			percentage: this.state.percentage
		};
		
		Endpoint.createServiceWorker(payload, this.state.slug)
			.then((res) => {
				this.setState({successMsgAddWorker: true, addServiceWorkerCard: false});
				this.loadData();
			})
			.catch((error) => handleAxiosError(error))
			.finally(() => this.setState({spinner: false}));
	};
	
	handleEditServiceWorker = () => {
		if (this.state.edit_worker_pct == null) {
			this.setState({errorMsg: true, content_message: "All fields are required"});
			setTimeout(() => {
				this.setState({errorMsg: false})
			}, 3000);
			return false
		}
		
		this.setState({spinner: true});
		const payload = {
			slug: this.state.edit_slug,
			worker_id: this.state.edit_worker,
			percentage: this.state.edit_worker_pct
		};
		
		Endpoint.editServiceWorker(payload, this.state.edit_slug, this.state.edit_worker)
			.then((res) => {
				this.setState({successMsgEditWorker: true, editServiceWorkerCard: false});
				this.loadData();
			})
			.catch((error) => handleAxiosError(error))
			.finally(() => this.setState({spinner: false}));
	};
	
	handleRemoveServiceWorker = () => {
		this.setState({spinner: true});
		
		Endpoint.deleteServiceWorker(this.state.shopService.slug, this.state.selectedWorker)
			.then((res) => {
				this.setState({successMsgRemoveWorker: true, removeServiceWorkerCard: false});
				this.loadData();
			})
			.catch((error) => handleAxiosError(error))
			.finally(() => this.setState({spinner: false}));
	};
	
	loadData = () => {
		if (!this.props.location.state) {
			return <Redirect to={`/admin/ManageServices`}/>
			// console.log(this.props.location.state.data)
		}
		
		Endpoint.getShopWorkers()
			.then(res => {
				this.setState({shopWorkers: res.data.data});
			});
		
		Endpoint.getShopService(this.props.location.state.data.slug)
			.then(res => {
				this.setState({shopService: res.data.data});
			})
		
	};
	
	componentDidMount() {
		this.loadData();
	}
	
	render() {
		
		const override = {
			display: 'block',
			margin: '0 auto',
			// borderColor: 'red',
		};
		return (
			<>
				
				<Modal show={this.state.successMsgAddWorker} size="sm">
					<Modal.Header></Modal.Header>
					<Modal.Body>
						<p>Service Worker added successfully !</p>
					</Modal.Body>
					<Modal.Footer>
						<button
							className="btn btn-custom"
							onClick={() => {
								this.setState({successMsgAddWorker: false});
							}}>
							Ok
						</button>
					</Modal.Footer>
				</Modal>
				
				<Modal show={this.state.successMsgEditWorker} size="sm">
					<Modal.Header></Modal.Header>
					<Modal.Body>
						<p>Service Worker edited successfully !</p>
					</Modal.Body>
					<Modal.Footer>
						<button
							className="btn btn-custom"
							onClick={() => {
								this.setState({successMsgEditWorker: false});
							}}>
							Ok
						</button>
					</Modal.Footer>
				</Modal>
				
				<Modal show={this.state.successMsgRemoveWorker} size="sm">
					<Modal.Header></Modal.Header>
					<Modal.Body>
						<p>Service Worker removed successfully !</p>
					</Modal.Body>
					<Modal.Footer>
						<button
							className="btn btn-custom"
							onClick={() => {
								this.setState({successMsgRemoveWorker: false});
							}}>
							Ok
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
							<li className="breadcrumb-item text-nowrap">
								Services
							</li>
							<li className="breadcrumb-item text-nowrap active"
								aria-current="page">
								{this.state.shopService ? this.state.shopService.name : "Service"} Workers
							</li>
						</ol>
					</nav>
					
					<div className="d-flex flex-wrap justify-content-between align-items-center">
						<h2 className="mt-lg-1 pt-lg-1">Service Workers |
							<span className="font-weight-light h5"> {this.state.shopService ? this.state.shopService.name : " No Service Selected"}</span>
						</h2>
						
						<button className="btn btn-pink mt-2" onClick={() => this.loadUsersData()}>
							<i className="czi-add mr-2"/>
							Add Worker
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
													<th>S/No</th>
													<th>Worker Name</th>
													<th>Worker Email</th>
													<th>Pay Percentage</th>
													<th>Actions</th>
												</tr>
												</thead>
												
												<tbody>
													{
														this.state.shopService &&
															this.state.shopService.available_workers.map((worker, n) => {
																return (
																	<tr  key={n}>
																		<td>{n+1}</td>
																		<td>{worker.user.first_name} {worker.user.last_name}</td>
																		<td>{worker.user.email}</td>
																		<td>{worker.pivot.worker_percentage}</td>
																		<td>
																			<button className="btn btn-outline-green-dark mr-2" onClick={() => this.setEditData(worker)}>
																				<i className="czi-edit"/>
																			</button>
																			
																			<button className="btn btn-outline-danger" onClick={() => this.setRemovedWorker(worker)}>
																				<i className="czi-trash"/>
																			</button>
																		</td>
																	</tr>
																)
															})
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
				
				<form>
					
					<Modal show={this.state.removeServiceWorkerCard}>
						<Modal.Header>
							<Modal.Title>Remove Worker from Service.</Modal.Title>
						</Modal.Header>
						
						<Modal.Body>
							{this.state.errorMsg ? (
								<div className="bg-danger border-rad-1 text-center p-2 mb-3">
									<p className="small text-light mb-0">
										<i className="czi-bell mr-2"/> {this.state.content_message}
									</p>
								</div>
							) : null}
							
							Are you sure you want to remove {this.state.selectedWorkerName} from the service?
						</Modal.Body>
						
						<Modal.Footer>
							<button className="btn btn-green-dark"
									onClick={() => this.handleRemoveServiceWorker()}>
								Remove
							</button>
							
							<button className="btn btn-outline-danger"
									onClick={() => {
										this.setState({removeServiceWorkerCard: false})
									}}>
								Close
							</button>
						
						</Modal.Footer>
					</Modal>
					
					<Modal show={this.state.addServiceWorkerCard}>
						<Modal.Header>
							<Modal.Title>Add Worker to Service.</Modal.Title>
						</Modal.Header>
						
						<Modal.Body>
							{this.state.errorMsg ? (
								<div className="bg-danger border-rad-1 text-center p-2 mb-3">
									<p className="small text-light mb-0">
										<i className="czi-bell mr-2"/> {this.state.content_message}
									</p>
								</div>
							) : null}
							
							<div className="">
								<label>Select Worker</label>
								<select className="form-control" onChange={this.setSelectedWorker}>
									<option value="">Select Worker to Add</option>
									{
										this.state.shopWorkers &&
										this.state.shopWorkers.map((worker, n) => {
											return (
												<option value={worker.id} key={n}>{worker.user.first_name} {worker.user.last_name}</option>
											)
										})
									}
								</select>
							</div>
							
							<div className="mt-2">
								<label>Pay Percentage</label>
								<input type="number" className="form-control" placeholder="Pay percentage for service"
									   onChange={this.setWorkerPercentage}/>
							</div>
						</Modal.Body>
						
						<Modal.Footer>
							<button className="btn btn-green-dark"
									onClick={() => this.handleAddServiceWorker()}>
								Add
							</button>
							
							<button className="btn btn-outline-danger"
									onClick={() => {
										this.setState({addServiceWorkerCard: false})
									}}>
								Close
							</button>
						</Modal.Footer>
					</Modal>
					
					<Modal show={this.state.editServiceWorkerCard}>
						<Modal.Header>
							<Modal.Title>Edit Service Worker.</Modal.Title>
						</Modal.Header>
						
						<Modal.Body>
							{this.state.errorMsg ? (
								<div className="bg-danger border-rad-1 text-center p-2 mb-3">
									<p className="small text-light mb-0">
										<i className="czi-bell mr-2"/> {this.state.content_message}
									</p>
								</div>
							) : null}
							
							<div className="">
								<label>Worker Name</label>
								<input type="text" value={this.state.edit_worker_name} readOnly className="form-control"/>
							</div>
							
							<div className="mt-2">
								<label>Pay Percentage</label>
								<input type="number" className="form-control" placeholder="Pay percentage for service"
									   onChange={this.setEditWorkerPercentage} defaultValue={this.state.edit_pct} name="edit_worker_pct"/>
							</div>
						</Modal.Body>
						
						<Modal.Footer>
							<button className="btn btn-green-dark"
									onClick={() => this.handleEditServiceWorker()}>
								Add
							</button>
							
							<button className="btn btn-outline-danger"
									onClick={() => {
										this.setState({editServiceWorkerCard: false})
									}}>
								Close
							</button>
						</Modal.Footer>
					</Modal>
					
				</form>
			
			</>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceWorkers);
