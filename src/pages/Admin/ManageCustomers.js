import React, {Component} from "react";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys,} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import {Col, Modal, Row} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import {Link} from "react-router-dom";

class ManageCustomers extends Component {
    state = {
        successMssg: "",
        toastSuccessful: false,
        //   passCorrect:'unequal'
    };

    comparePassword = () => {
        const pass = this.state.password;
        if (this.state.password === this.state.password_confirm) {
            this.setState({passCorrect: "equal"});
        } else {
            this.setState({passCorrect: "unequal"});
        }
    };
    changeText = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };

    getShopCustomers = () => {
        Endpoint.getShopCustomers().then((res) => {
            this.setState({shopCustomers: res.data.data.data});
            console.log(this.state.shopCustomers, "Shop Customers");
        });
    };


    handleDeleteShopCustomer = () => {
        this.setState({deleteModal: false});
        Endpoint.deleteShopCustomer(this.state.id)
            .then((res) => {
                this.componentDidMount();
            })
            .catch((error) => console.log(error + "error"));

    };

    promptDelete = (a) => {
        this.loadData(a);
        this.setState({deleteModal: true});
    };

    loadData = (data) => {
        this.setState({

            first_name: data.first_name,
            last_name: data.last_name,
            other_names: data.other_names,
            phone: data.phone,
            email: data.email,
            id: data.id,
            name: data.name

        });
    };

    loadEditData = (data) => {
        this.setState({
            first_name: data.first_name,
            last_name: data.last_name,
            other_names: data.other_names,
            phone: data.phone,
            editCustomerCard: true,
            email: data.email,
            id: data.id
        })
        console.log(data, "Customer Data")
    }

    handleUpdateCustomer = () => {
        this.setState({spinner: true})
        const payload = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            other_names: this.state.other_names,
            phone: this.state.phone,
            email: this.state.email,
        }

        Endpoint.updateShopCustomer(payload, this.state.id)
            .then((res) => {
                this.setState({successMsg: true, spinner: false, editCustomerCard: false});
                this.componentDidMount();
            })
            .catch((error) => {
                console.log(error + "error")
                this.setState({
                    errorMsg: true,
                    content_message: "Oops! An error occured. Check that you have an active internet connection and try again",
                })

                setTimeout(() => {
                    this.setState({
                        errorMsg: false
                    })
                }, 4000)
            });

    }

    handleCreateCustomer = () => {
        if (!this.state.first_name || !this.state.last_name || !this.state.email || !this.state.password || !this.state.phone) {
            this.setState({errorMsg: true, content_message: "All fields are required"});

            setTimeout(() => {
                this.setState({errorMsg: false})
            }, 3000);
            return false
        }
        this.setState({spinner: true});

        const payload = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirm,
            phone: this.state.phone,
        };

        Endpoint.createCustomer(payload)
            .then((res) => {
                this.setState({
                    spinner: false,
                    createCustomer: false,
                    toastSuccessful: true,
                    successMssg: "Customer added successfully!"
                });

                let currentState = this;
                setTimeout(function () {
                    currentState.setState({toastSuccessful: false});
                }, 5000);
                this.componentDidMount();
            })
            .catch((error) => {
                this.setState({
                    errorMsg: true,
                    spinner: false,
                    content_message: "Oops! Unable to process request. Please try again later"
                });
                setTimeout(() => {
                    this.setState({errorMsg: false})
                }, 3000)
            });
    };

    componentDidMount() {
        this.props.setState("home", stateKeys.PAGE_CLASS);
        this.props.setState("Sample content for dialog", stateKeys.DIALOG_CONTENT);
        this.getShopCustomers();
    }

    render() {
        const override = {
            display: "block",
            margin: "0 auto",
        };
        return (
            <>
                <Modal show={this.state.successMsg} size="sm">
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <p>Customer was updated successfully !</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-custom"
                            onClick={() => {
                                this.setState({successMsg: false});
                            }}
                        >
                            Ok
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.deleteModal} size="sm">
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <p>
                            Delete {this.state.name}?
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-custom"
                            onClick={this.handleDeleteShopCustomer}
                        >
                            <i className="czi-check mr-2"/>
                            Confirm
                        </button>

                        <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                                this.setState({deleteModal: false});
                            }}
                        >
                            Close
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

                            <li className="breadcrumb-item text-nowrap active" aria-current="page">
                                Customers
                            </li>
                        </ol>
                    </nav>

                    <div className="d-flex justify-content-between flex-wrap align-items-center">
                        <h2 className="mt-lg-1 pt-lg-1">Registered Shop Customers</h2>

                        <button className="btn btn-pink mt-2"
                                onClick={() => {
                                    this.setState({createCustomer: true, successMsg: false});
                                }}>
                            <i className="czi-add-user mr-2"/> Add Customer
                        </button>
                    </div>

                </div>

                <div className="pt-1 pb-5">
                    <section className="border-bottom pb-4">
                        <div className="row">
                            <div className="col-md-6 col-lg-3">
                                {/* <div className="card-body">
                  <button
                    className="btn btn-custom btn-sm mt-2"
                    onClick={() => {
                      this.setState({ createShopWorker: true, successMsg:false });
                    }}
                  >
                    <i className="czi-add mr-2" />
                    Create Shop Worker
                  </button>
                </div> */}
                            </div>
                        </div>
                    </section>

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
                                                    <td>Customer Name</td>
                                                    <td>Email</td>
                                                    <td>Phone</td>
                                                    <td>Last Seen</td>
                                                    <td>Action</td>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                {this.state.shopCustomers &&
                                                this.state.shopCustomers.map((a, b) => {
                                                    return (
                                                        <tr>
                                                            <td>{b + 1}</td>
                                                            <td>{a.name}</td>
                                                            <td>{a.email}</td>
                                                            <td>{a.phone}</td>
                                                            <td>
                                                                {a.last_seen == null
                                                                    ? a.last_seen
                                                                    : a.last_seen.slice(0, 16)}
                                                            </td>
                                                            <td>
                                                                <button className="btn btn-outline-green-dark btn-sm"
                                                                        onClick={() => this.loadEditData(a)}>
                                                                    <i className="czi-edit"/>
                                                                </button>
                                                                &nbsp;
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => this.promptDelete(a)}
                                                                >
                                                                    <i className="czi-trash"/>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}

                                                {!this.state.shopCustomers ? (
                                                    <tr>
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
                                                    </tr>
                                                ) : null}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </section>


                    <Modal show={this.state.editCustomerCard} size="lg">
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Edit Shop Customer Details
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

                        {this.state.errorMsg ? (
                            <div className="bg-danger border-rad-2 text-center p-2 mb-3">
                                <p className="small text-light mb-0">
                                    <i className="czi-bell mr-2"/> {this.state.content_message}
                                </p>
                            </div>
                        ) : null}
                        <Modal.Body>

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
                                            name="first_name"
                                            defaultValue={this.state.first_name}
                                            required
                                            id="fn"

                                        />
                                    </div>
                                </Col>
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
                                            name="last_name"
                                            defaultValue={this.state.last_name}
                                            required
                                            id="ln"
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6} md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
                    <span className="input-group-text">
                      <i className="czi-time"/>
                    </span>
                                        </div>
                                        <input
                                            className="form-control prepended-form-control"
                                            type="text"
                                            onChange={this.changeText}
                                            name="other_names"
                                            defaultValue={this.state.other_names}
                                            required
                                            id="on"
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
                    <span className="input-group-text">
                      <i className="czi-phone">
                      
                        </i>
                    </span>
                                        </div>
                                        <input
                                            className="form-control prepended-form-control"
                                            type="text"
                                            onChange={this.changeText}
                                            name="phone"
                                            defaultValue={this.state.phone}
                                            required
                                            id="phn"
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6} md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
                    <span className="input-group-text">
                    <i className="czi-mail">
                      
                        </i>
                    </span>
                                        </div>
                                        <input
                                            className="form-control prepended-form-control"
                                            type="text"
                                            onChange={this.changeText}
                                            name="email"
                                            defaultValue={this.state.email}
                                            required
                                            id="em"
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


                            <button
                                className="btn btn-custom"
                                onClick={this.handleUpdateCustomer}
                            >
                                <i className="czi-save mr-2"/>
                                Save
                            </button>

                            <button
                                className="btn btn-outline-danger"
                                onClick={() => {
                                    this.setState({editCustomerCard: false});
                                }}
                            >
                                Close
                            </button>
                        </Modal.Footer>
                    </Modal>


                    <Modal show={this.state.createCustomer} size="lg">
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Create a Customer
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <div className="d-flex justify-content-between">
                                <h5 className="mr-2">Customer Information</h5>
                            </div>
                            <hr/>
                            <br/>

                            {this.state.errorMsg ? (
                                <div className="bg-danger border-rad-2 text-center p-2 mb-3">
                                    <p className="small text-light mb-0">
                                        <i className="czi-bell mr-2"/> {this.state.content_message}
                                    </p>
                                </div>
                            ) : null}

                            <Row>
                                <Col md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
											<span className="input-group-text">
											  <i className="czi-user"/>
											</span>
                                        </div>

                                        <input
                                            className="form-control prepended-form-control"
                                            type="text"
                                            onChange={this.changeText}
                                            name="first_name"
                                            placeholder="First name"
                                            required
                                        />
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
											<span className="input-group-text">
											  <i className="czi-user"/>
											</span>
                                        </div>
                                        <input
                                            className="form-control prepended-form-control"
                                            type="text"
                                            onChange={this.changeText}
                                            name="last_name"
                                            placeholder="Last name"
                                            required
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
											<span className="input-group-text">
											  <i className="czi-mail"/>
											</span>
                                        </div>

                                        <input
                                            className="form-control prepended-form-control"
                                            type="email"
                                            onChange={this.changeText}
                                            name="email"
                                            placeholder="Email address"
                                            required
                                        />
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
											<span className="input-group-text">
											  <i className="czi-phone"/>
											</span>
                                        </div>

                                        <input
                                            className="form-control prepended-form-control"
                                            type="text"
                                            onChange={this.changeText}
                                            name="phone"
                                            placeholder="Phone"
                                            required
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
											<span className="input-group-text">
											  <i className="czi-unlocked"/>
											</span>
                                        </div>

                                        <input
                                            className="form-control prepended-form-control"
                                            type="password"
                                            onChange={this.changeText}
                                            name="password"
                                            placeholder="Password"
                                            required
                                        />
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
											<span className="input-group-text">
											  <i className="czi-unlocked"/>
											</span>
                                        </div>

                                        <input className="form-control prepended-form-control" type="password"
                                               onChange={this.changeText} onKeyUp={this.comparePassword}
                                               name="password_confirm" placeholder="Confirm Password" required
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <div className="col-sm-6">
                                <div className="form-group">
                                    {this.state.passCorrect === "unequal" ? (
                                        <div className="small text-danger my-2">
                                            <i className="czi-close-circle mr-2"/> Passwords do not
                                            match!
                                        </div>
                                    ) : null}
                                    {this.state.passCorrect === "equal" ? (
                                        <div className="small text-success my-2">
                                            <i className="czi-check-circle mr-2"/>
                                            Passwords match!
                                        </div>
                                    ) : null}
                                </div>
                            </div>

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
                            <button className="btn btn-custom" onClick={this.handleCreateCustomer}>
                                <i className="czi-add-user mr-2"/>
                                Create Customer
                            </button>

                            <button className="btn btn-outline-danger"
                                    onClick={() => {
                                        this.setState({createCustomer: false});
                                    }}>
                                Close
                            </button>
                        </Modal.Footer>
                    </Modal>
                </div>


                <div className="toast-container toast-bottom-center" style={{zIndex: '1070',}}>
                    <div className={this.state.toastSuccessful ? "toast mb-3 fade show" : "toast mb-3 fade hide"}
                         id="cart-toast" data-delay="5000" role="alert"
                         aria-live="assertive" aria-atomic="true">
                        <div className="toast-header bg-success text-white">
                            <i className="czi-check-circle mr-2"/>
                            <h6 className="font-size-sm text-white mb-0 mr-auto">Successful</h6>
                            <button className="close text-white ml-2 mb-1" type="button"
                                    onClick={() => this.toggleToastAdded()}
                                    aria-label="Close"><span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="toast-body">{this.state.successMssg}</div>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCustomers);
