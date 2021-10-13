import React, {Component} from "react";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys,} from "../../redux/actions";
import {Modal, Tab, Tabs} from "react-bootstrap";
import {getUser} from "../../utils/auth";
import Endpoint from "../../utils/endpoint";
import ClipLoader from "react-spinners/ClipLoader";
import {Link} from "react-router-dom";

class AttendantProfile extends Component {
    state = {
        userInfo: getUser(),
        spinner: false,
    };

    changeText = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };

    handleUpdateProfile = () => {
        this.setState({spinner: true});
        const payload = {
            // worker_id:this.state.worker_profile.id,
            // worker_type_id:this.state.worker_type,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            other_names: this.state.other_names,
            email: this.state.email,
            phone: this.state.phone,
            address: this.state.address,
        };
        Endpoint.updateUserProfile(payload)
            .then((res) => {
                this.setState({successMsg: true, spinner: false});
                this.componentDidMount();
            })
            .catch((error) => {
                console.log(error + "error");
                this.setState({spinner: false});
                alert("oops! Couldn't process your request. please try again");
            });
    };

    getUserProfile = () => {
        Endpoint.getUserProfile().then((res) => {
            this.setState({
                userProfile: res.data.data,
                first_name: res.data.data.first_name,
                last_name: res.data.data.last_name,
                other_names: res.data.data.other_names,
                email: res.data.data.email,
                phone: res.data.data.phone,
                address: res.data.data.address,
            });
            console.log(this.state.userProfile, "Profile");
        });
    };

    componentDidMount() {
        this.props.setState("home", stateKeys.PAGE_CLASS);

        this.props.setState("Sample content for dialog", stateKeys.DIALOG_CONTENT);
        this.getUserProfile();
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
                        <p>Profile Updated Successfully!</p>
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
                <div className="border-bottom mt-lg-2 mt-5 pt-5 pb-2 mb-2">
                    <nav className="mb-4 mt-5" aria-label="breadcrumb">
                        <ol className="breadcrumb flex-lg-nowrap">
                            <li className="breadcrumb-item">
                                <Link className="text-nowrap" to="/attendant">
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
                                Profile
                            </li>
                        </ol>
                    </nav>

                    <h2 className="mt-lg-1 pt-lg-1">Profile</h2>
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
                                                    <Tab eventKey="profile" title="Profile">
                                                        <div>
                                                            <div>
                                                                {/* <div className="bg-secondary rounded-lg p-4 mb-4">
                                  <div className="media align-items-center">
                                    <img
                                      src={avatar}
                                      width="90"
                                      alt="Createx Studio"
                                    />
                                    <div className="media-body pl-3">
                                      <button
                                        className="btn btn-light btn-shadow btn-sm mb-2"
                                        type="button"
                                      >
                                        <i className="czi-loading mr-2" />
                                        Change
                                        <span className="d-none d-sm-inline">
                                          avatar
                                        </span>
                                      </button>
                                      <div className="p mb-0 font-size-ms text-muted">
                                        Upload JPG, GIF or PNG image. 300 x 300
                                        required.
                                      </div>
                                    </div>
                                  </div>
                                </div> */}

                                                                {this.state.userProfile ? (
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
                                                                                    defaultValue={this.state.first_name}
                                                                                    name="first_name"
                                                                                    onChange={this.changeText}
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
                                                                                    defaultValue={this.state.last_name}
                                                                                    name="last_name"
                                                                                    onChange={this.changeText}
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
                                                                                    defaultValue={this.state.other_names}
                                                                                    name="other_names"
                                                                                    onChange={this.changeText}
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
                                                                                    defaultValue={this.state.email}
                                                                                    name="email"
                                                                                    onChange={this.changeText}
                                                                                />
                                                                            </div>
                                                                        </div>


                                                                        <div className="col-sm-6">
                                                                            <div className="form-group">
                                                                                <label htmlFor="dashboard-city">
                                                                                    Phone
                                                                                </label>
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    onChange={this.changeText}
                                                                                    name="phone"
                                                                                    defaultValue={this.state.phone}
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        {/* <div className="col-sm-6">
                                    <div className="form-group">
                                      <label htmlFor="dashboard-city">
                                        Address
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        onChange={this.changeText}
                                        name="address"
                                        defaultValue={this.state.address}
                                      />
                                    </div>
                                  </div> */}


                                                                        <div className="col-12">
                                                                            <hr className="mt-2 mb-3"/>
                                                                            <div
                                                                                className="d-flex flex-wrap justify-content-end align-items-center">
                                                                                <button
                                                                                    className="btn btn-green-dark mt-3 mt-sm-0"
                                                                                    type="button"
                                                                                    onClick={this.handleUpdateProfile}
                                                                                >
                                                                                    Save changes
                                                                                </button>
                                                                            </div>
                                                                        </div>

                                                                        <div className="sweet-loading">
                                                                            <ClipLoader
                                                                                css={override}
                                                                                size={30}
                                                                                color={"#FF9595"}
                                                                                loading={this.state.spinner}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="row">
                                                                        <div className="col-sm-5"></div>

                                                                        <div className="col-sm-7">
                                                                            <ClipLoader size={70} color={"#FF9595"}/>
                                                                        </div>
                                                                    </div>
                                                                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(AttendantProfile);
