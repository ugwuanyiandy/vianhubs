import React, {Component} from "react";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys,} from "../../redux/actions";
import {Modal, Tab, Tabs} from "react-bootstrap";
import {Link} from "react-router-dom";
import Endpoint from "../../utils/endpoint";
import {durationCovert} from "../../utils/helpers"
import ClipLoader from "react-spinners/ClipLoader";


class ViewWorkerProfile extends Component {
    state = {
        worker_profile: this.props.location.state.data,
        spinner: false,
        worker_type_id: this.props.location.state.data?.worker_profile?.worker_type_id
    };

    changeText = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };
    comparePassword = () => {
        const pass = this.state.password;
        if (this.state.password === this.state.confirm_password) {
            this.setState({passCorrect: "equal"});
        } else {
            this.setState({passCorrect: "unequal"});
        }
    };
    getWorkerTypes = () => {
        Endpoint.getWorkerTypes().then((res) => {
            this.setState({workerType: res.data.data});
        });
    };

    handleUpdateService = () => {
        this.setState({spinner: true})
        const payload = {
            // worker_id:this.state.worker_profile.id,
            worker_type_id: this.state.worker_type,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            other_names: this.state.other_names,
            email: this.state.email,
            password: this.state.password,
            phone: this.state.phone
        };
        Endpoint.editShopWorker(this.state.worker_profile.id, payload)
            .then((res) => {
                this.setState({successMsg: true, spinner: false});
                this.componentDidMount();
            })
            .catch((error) => {
                console.log(error + "error")
                this.setState({spinner: false})
                alert("oops! Couldn't process your request. please try again")

            });
    };

    componentDidMount() {
        console.log(this.state.worker_profile, "Worker");
        this.getWorkerTypes();
        this.props.setState("home", stateKeys.PAGE_CLASS);

        this.props.setState("Sample content for dialog", stateKeys.DIALOG_CONTENT);
    }

    render() {
        const override = {
            display: 'block',
            margin: '0 auto',
        };
        return (
            <>
                <Modal show={this.state.successMsg} size="sm">
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Worker Profile Updated Successfully!</p>
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

                            <li className="breadcrumb-item">
                                <Link className="text-nowrap" to="">
                                    <i className="czi-"/>
                                    Workers
                                </Link>
                            </li>

                            <li
                                className="breadcrumb-item text-nowrap active"
                                aria-current="page"
                            >
                                Worker Information
                            </li>
                        </ol>
                    </nav>

                    <h2 className="mt-lg-1 pt-lg-1">Worker Information</h2>
                    <br/>
                    <Link
                        className="btn btn-outline-primary btn-sm"
                        to={{
                            pathname: "/admin/ManageShopWorkers",
                        }}
                    >
                        <i className="czi-arrow-left"/>
                    </Link>
                </div>

                <div className="">
                    <div className="">
                        <div className="">
                            <div className="container my-5 pb-3">
                                <div className="bg-light box-shadow-lg rounded-lg overflow-hidden">
                                    <div className="row">
                                        <section className="col pt-lg-4 pb-4 mb-3">
                                            <div className="pt-2 px-4 pl-lg-0 px-xl-5">
                                                <Tabs
                                                    fill
                                                    defaultActiveKey="profile"
                                                    id="uncontrolled-tab-example"
                                                >
                                                    <Tab eventKey="profile" title="Worker Profile">
                                                        <div>
                                                            <div>
                                                                <div className="row">
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <label htmlFor="dashboard-fn">
                                                                                First Name
                                                                            </label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="text"
                                                                                id="dashboard-fn"
                                                                                onChange={this.changeText}
                                                                                name="first_name"
                                                                                defaultValue={
                                                                                    this.state.worker_profile.user
                                                                                        .first_name
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <label htmlFor="dashboard-ln">
                                                                                Last Name
                                                                            </label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="text"
                                                                                id="dashboard-ln"
                                                                                onChange={this.changeText}
                                                                                name="last_name"
                                                                                defaultValue={
                                                                                    this.state.worker_profile.user
                                                                                        .last_name
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <label htmlFor="dashboard-ln">
                                                                                Other Name
                                                                            </label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="text"
                                                                                id="dashboard-ln"
                                                                                onChange={this.changeText}
                                                                                name="other_names"
                                                                                defaultValue={
                                                                                    this.state.worker_profile.user
                                                                                        .other_names
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <label htmlFor="dashboard-ln">
                                                                                Phone
                                                                            </label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="text"
                                                                                id="dashboard-ln"
                                                                                onChange={this.changeText}
                                                                                name="phone"
                                                                                defaultValue={
                                                                                    this.state.worker_profile.user.phone
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <label htmlFor="dashboard-email">
                                                                                Email address
                                                                            </label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="text"
                                                                                id="dashboard-email"
                                                                                onChange={this.changeText}
                                                                                name="email"
                                                                                defaultValue={
                                                                                    this.state.worker_profile.user.email
                                                                                }
                                                                                // disabled
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <label htmlFor="dashboard-email">
                                                                                Worker Type
                                                                            </label>

                                                                            <select
                                                                                className="form-control"
                                                                                onChange={(e) => {
                                                                                    this.setState({
                                                                                        worker_type: parseInt(
                                                                                            e.target.value
                                                                                        ),
                                                                                    });
                                                                                }}
                                                                            >
                                                                                {this.state.workerType &&
                                                                                this.state.workerType.map((w) => {
                                                                                    return (
                                                                                        <option value={w.id}
                                                                                                selected={w.id == this.state.worker_profile?.worker_type_id}
                                                                                        >
                                                                                            {w.name}
                                                                                        </option>
                                                                                    );
                                                                                })}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <label htmlFor="dashboard-ln">
                                                                                Password
                                                                            </label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="password"
                                                                                onChange={(e) => this.setState({password: e.target.value})}
                                                                                value={this.state.password}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <label htmlFor="dashboard-ln">
                                                                                Cofirm Password
                                                                            </label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="password"
                                                                                value={this.state.confirm_password}
                                                                                onChange={(e) => this.setState({confirm_password: e.target.value})}
                                                                                onKeyUp={this.comparePassword}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            {this.state.passCorrect === "unequal" ? (
                                                                                <div className="small text-danger my-2">
                                                                                    <i className="czi-close-circle mr-2"/> Passwords
                                                                                    do not
                                                                                    match!
                                                                                </div>
                                                                            ) : null}
                                                                            {this.state.passCorrect === "equal" ? (
                                                                                <div
                                                                                    className="small text-success my-2">
                                                                                    <i className="czi-check-circle mr-2"/>
                                                                                    Passwords match!
                                                                                </div>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-12">
                                                                        <hr className="mt-2 mb-3"/>
                                                                        <div
                                                                            className="d-flex flex-wrap justify-content-end align-items-center">
                                                                            <button
                                                                                className="btn btn-primary mt-3 mt-sm-0"
                                                                                type="button"
                                                                                onClick={this.handleUpdateService}
                                                                            >
                                                                                Save changes
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    <div className="sweet-loading">
                                                                        <ClipLoader
                                                                            css={override}
                                                                            size={60}
                                                                            color={"#FF9595"}
                                                                            loading={this.state.spinner}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Tab>

                                                    <Tab eventKey="services" title="Services">
                                                        <div>
                                                            <div>
                                                                <div className="bg-secondary rounded-lg p-4 mb-4">
                                                                    <p className="font-size-sm text-muted mb-0">
                                                                        The underlisted are services particular to the
                                                                        selected Shop workerType
                                                                    </p>
                                                                </div>
                                                                <div className="table-responsive font-size-md">
                                                                    <table className="table table-hover mb-0">
                                                                        <thead>
                                                                        <tr>
                                                                            <th>S/N</th>
                                                                            <th>Service Name</th>
                                                                            <th>Description</th>
                                                                            <th>Service Duration</th>
                                                                            <th></th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {this.state.worker_profile && this.state.worker_profile.services != null && this.state.worker_profile.services.map((i, n) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td className="py-3 align-middle">{n + 1}</td>
                                                                                    <td className="py-3 align-middle">{i.name}</td>
                                                                                    <td className="py-3 align-middle">{i.description}</td>
                                                                                    <td className="py-3 align-middle">{durationCovert(i.duration)}</td>


                                                                                </tr>
                                                                            )
                                                                        })}


                                                                        </tbody>
                                                                    </table>
                                                                </div>

                                                                <hr className="pb-4"/>

                                                                {/* <div className="text-sm-right">
                                  <a
                                    className="btn btn-primary"
                                    href="#"
                                    data-toggle="modal"
                                  >
                                    Add payment method
                                  </a>
                                </div> */}
                                                            </div>
                                                        </div>
                                                    </Tab>
                                                </Tabs>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewWorkerProfile);
