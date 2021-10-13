import React, {Component} from "react";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys,} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import {workerType} from "../../utils/Identifiers";
import {Link} from "react-router-dom";
import {Col, Modal, Row} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";


class ManageShopWorkers extends Component {
    state = {
        //   passCorrect:'unequal'
    };

    comparePassword = () => {
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

    handleCreateShopWorker = () => {
        if (this.state.first_name == null || this.state.last_name == null || this.state.email == null || this.state.password == null || this.state.phone == null) {
            this.setState({errorMsg: true, content_message: "All fields are required"})
            setTimeout(() => {
                this.setState({errorMsg: false})
            }, 3000)
            return false
        }
        this.setState({spinner: true})
        const payload = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            other_names: this.state.othername,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirm,
            phone: this.state.phone,
            worker_type_id: this.state.worker_type,
        };

        Endpoint.createShopWorker(payload)
            .then((res) => {
                this.setState({successMsg: true, spinner: false, createShopWorker: false});
                this.componentDidMount();
            })
            .catch((error) => {
                this.setState({
                    errorMsg: true,
                    spinner: false,
                    content_message: "Oops! Unable to process request. Please check that you have an active internet connection"
                })
                setTimeout(() => {
                    this.setState({errorMsg: false})
                }, 3000)
            });
    };

    getShopWorkers = () => {
        Endpoint.getShopWorkers()
            .then(res => {
                this.setState({shopWorkers: res.data.data});
                console.log(res.data, "Shop Workers")
            })
    };

    getWorkerTypes = () => {
        Endpoint.getWorkerTypes()
            .then(res => {
                this.setState({workerType: res.data.data});
            })
    };

    handleDeleteShopWorker = () => {
        this.setState({deleteModal: false})
        Endpoint.deleteShopWorker(this.state.shop_worker_id)
            .then((res) => {
                console.log(res)
                this.componentDidMount();
            })
    }

    promptDelete = (a) => {
        this.loadData(a);
        this.setState({deleteModal: true})
    }

    loadData = (data) => {
        this.setState({
            shop_worker_id: data.id,
            shop_worker_firstName: data.user.first_name,
            shop_worker_lastName: data.user.last_name
        })
    }

    componentDidMount() {
        this.props.setState("home", stateKeys.PAGE_CLASS);
        this.props.setState("Sample content for dialog", stateKeys.DIALOG_CONTENT);
        this.getShopWorkers();
        this.getWorkerTypes();
    }

    render() {
        const override = {
            display: 'block',
            margin: '0 auto',
            // borderColor: 'red',
        };
        return (
            <>
                <Modal show={this.state.successMsg} size="sm">
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Shop Worker was created
                            successfully !</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-custom"
                                onClick={() => {
                                    this.setState({successMsg: false})
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
                        <p>Delete {this.state.shop_worker_firstName} {this.state.shop_worker_lastName}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-custom"
                                onClick={this.handleDeleteShopWorker}
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
                                <a className="text-nowrap" href="#">
                                    <i className="czi-home"/>
                                    Home
                                </a>
                            </li>
                            <li className="breadcrumb-item">
                                <Link className="text-nowrap" to="">
                                    <i className="czi-"/> Dashboard
                                </Link>
                            </li>

                            <li className="breadcrumb-item text-nowrap active"
                                aria-current="page">
                                Workers
                            </li>
                        </ol>
                    </nav>

                    <div className="d-flex justify-content-between flex-wrap align-items-center">
                        <h2 className="mt-lg-1 pt-lg-1">Shop Workers</h2>

                        <button className="btn btn-pink mt-2"
                                onClick={() => {
                                    this.setState({createShopWorker: true, successMsg: false});
                                }}>
                            <i className="czi-add mr-2"/> Create Shop Worker
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
                                                    <td>Worker Name</td>
                                                    <td>Email</td>
                                                    <td>Phone</td>
                                                    <td>Worker Type</td>
                                                    <td>Action</td>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                {this.state.shopWorkers &&
                                                this.state.shopWorkers.map((a, b) => {
                                                    return (
                                                        <tr>
                                                            <td>{b + 1}</td>
                                                            <td>
                                                                {a.user.last_name} {a.user.first_name}
                                                            </td>
                                                            <td>{a.user.email}</td>
                                                            <td>{a.user.phone}</td>
                                                            <td>
                                                                {a.worker_type_id == workerType.cashier
                                                                    ? "Cashier"
                                                                    : a.worker_type_id == workerType.attendant
                                                                        ? "Attendant"
                                                                        : "Admin"}
                                                            </td>
                                                            <td>
                                                                <Link className="btn btn-outline-green-dark btn-sm"
                                                                      to={{
                                                                          pathname: "/admin/WorkerProfile",
                                                                          state: {data: a},
                                                                      }}
                                                                >
                                                                    <i className="czi-eye"/>
                                                                </Link> &nbsp;
                                                                <button className="btn btn-outline-danger btn-sm"
                                                                        onClick={() => this.promptDelete(a)}
                                                                >
                                                                    <i className="czi-trash"/>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}

                                                {!this.state.shopWorkers ? <tr>
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

                <Modal show={this.state.createShopWorker} size="lg">
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Create a Shop Worker
                        </Modal.Title>
                    </Modal.Header>

                    {this.state.errorMsg ? (
                        <div className="bg-danger border-rad-2 text-center p-2 mb-3">
                            <p className="small text-light mb-0">
                                <i className="czi-bell mr-2"/> {this.state.content_message}
                            </p>
                        </div>
                    ) : null}

                    <Modal.Body>
                        <div className="d-flex justify-content-between">
                            <h5 className="mr-2">Worker Information</h5>
                        </div>
                        <hr/>
                        <br/>

                        <Row>
                            <Col xs={6} md={6}>
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
                                        placeholder="Firstname"
                                        required
                                    />
                                </div>
                            </Col>
                            <Col xs={6} md={6}>
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
                                        placeholder="Lastname"
                                        required
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={6} md={6}>
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
                                        name="othername"
                                        placeholder="Othername"
                                        required
                                    />
                                </div>
                            </Col>
                            <Col xs={6} md={6}>
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
                        </Row>

                        <Row>
                            <Col xs={6} md={6}>
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
                            <Col xs={6} md={6}>
                                <div className="input-group-overlay form-group">
                                    <div className="input-group-prepend-overlay">
                    <span className="input-group-text">
                      <i className="czi-user"/>
                    </span>
                                    </div>

                                    <select
                                        className="form-control prepended-form-control"
                                        onChange={(e) => {
                                            this.setState({worker_type: parseInt(e.target.value)});
                                        }}
                                    >
                                        {this.state.workerType &&
                                        this.state.workerType.map((w) => {
                                            return <option value={w.id}>{w.name}</option>;
                                        })}
                                    </select>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={6} md={6}>
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
                            <Col xs={6} md={6}>
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
                                        onKeyUp={this.comparePassword}
                                        name="password_confirm"
                                        placeholder="Confirm Password"
                                        required
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
                        <button
                            className="btn btn-custom"
                            onClick={this.handleCreateShopWorker}
                        >
                            <i className="czi-add-user mr-2"/>
                            Create Worker
                        </button>

                        <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                                this.setState({createShopWorker: false});
                            }}
                        >
                            Close
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageShopWorkers);
