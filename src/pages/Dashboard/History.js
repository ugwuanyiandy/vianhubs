import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import Moment from "react-moment";
import {currencyFormat, handleFormSubmissionError} from "../../utils/helpers";
import {Modal} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";

class History extends Component {

    state = {
        orders: [],
        sessions: [],
        loading: false,
        reviewModal: false,
        currentService: "",
        reviewRating: "",
        reviewComment: "",
        reviewLoader: false,
        toastAdded: false,
    };

    reviewModal = (id) => {
        this.setState({reviewModal: true, currentService: id})
    };

    changeText = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    reviewOrder = () => {
        this.setState({reviewLoader: true, success: false, error: false});

        if (!this.state.currentService || !this.state.reviewRating || !this.state.reviewComment) {
            this.setState({formIncomplete: true, cartLoader: false});
            return false
        } else {
            const ReviewProps = {
                service_id: this.state.currentService,
                rating: this.state.reviewRating,
                comment: this.state.reviewComment,
            };

            Endpoint.createCustomerReview(ReviewProps)
                .then(res => {
                    this.setState({reviewModal: false, reviewLoader: false, success: true, error: false});
                    this.toggleToastAdded();
                    this.loadDataFromServer();
                })
        }

    };

    toggleToastAdded = () => {
        this.setState({toastAdded: !this.state.toastAdded});

        let currentState = this;
        setTimeout(function () {
            currentState.setState({toastAdded: false});
        }, 5000);
    };

    toggleReviewModal = () => {
        this.setState({reviewModal: !this.state.reviewModal})
    };

    loadDataFromServer = () => {
        this.setState({loading: true});

        Endpoint.getCustomerOrders()
            .then(res => {
                console.log(res.data.data.data);
                this.setState({orders: res.data.data.data})
            })
            .catch((error) => handleFormSubmissionError(error, this));

        Endpoint.getCustomerSessions()
            .then(res => {
                console.log(res.data.data.data);
                this.setState({sessions: res.data.data.data})
            })
            .catch((error) => handleFormSubmissionError(error, this));
    };

    componentDidMount() {
        this.props.setState('home', stateKeys.PAGE_CLASS);
        this.props.setState('Sample content for dialog', stateKeys.DIALOG_CONTENT);

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
                                <a className="text-nowrap" href="">
                                    <i className="czi-home"/>Home
                                </a>
                            </li>

                            <li className="breadcrumb-item">
                                <a className="text-nowrap" href="">
                                    <i className="czi-"/>Dashboard
                                </a>
                            </li>

                            <li className="breadcrumb-item text-nowrap active" aria-current="page">History</li>
                        </ol>
                    </nav>

                    <h2 className="mt-lg-1 pt-lg-1">Order History</h2>
                </div>

                <div className="container mt-4 mb-5 pb-3">
                    <div className="box-shadow rounded-lg overflow-hidden bg-white">
                        <div className="">

                            <section className="pt-2 pt-lg-4 pb-4 mb-3">
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead className=''>
                                        <tr className='font-weight-bold'>
                                            <th>Order Number</th>
                                            <th>Service</th>
                                            <th>Served by</th>
                                            <th>Time</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.orders.length ?
                                                this.state.sessions.map((session, index) => {
                                                    return (
                                                        <tr>
                                                            <td>{session.order.reference}</td>
                                                            <td>{session.service.name}</td>
                                                            <td>{session.worker_name}</td>
                                                            <td>
                                                                <Moment format="D MMM YYYY hh:mm:ss" withTitle>
                                                                    {session.start_at}
                                                                </Moment>
                                                            </td>
                                                            <td>{currencyFormat(session.service.cost)}</td>
                                                            <td>
                                                                <button className="btn btn-sm btn-green-dark"
                                                                        onClick={() => this.reviewModal(session.service_id)}>
                                                                    <i className="czi-star"/> Review Appointment
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                :
                                                <tr>
                                                    <td colSpan={'6'}>
                                                        <p className='text-center'> No Orders Made Yet. </p>
                                                    </td>
                                                </tr>
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                <Modal
                    show={this.state.reviewModal}
                    size=""
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Review your appointment.
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <form action="">
                            <div className="form-group">
                                <label htmlFor="">Comment</label>
                                <input name="reviewComment" type="text" onChange={this.changeText}
                                       className="form-control"/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="">Rating</label>
                                <select name="reviewRating" id="" onChange={this.changeText} className="form-control">
                                    <option value="5">5</option>
                                    <option value="4">4</option>
                                    <option value="3">3</option>
                                    <option value="2">2</option>
                                    <option value="1">1</option>
                                </select>
                            </div>

                        </form>

                        {this.state.formIncomplete ?
                            <div className="col-10 bg-danger fade show border-rad-1 text-center p-2 mb-3">
                                <p className="small text-light mb-0">
                                    <i className="czi-bell mr-2"/> Please fill in all fields.
                                </p>
                            </div>
                            : null
                        }

                        {this.state.error ?
                            <div className="col-10 bg-danger fade show border-rad-1 text-center p-2 mb-3">
                                <p className="small text-light mb-0">
                                    <i className="czi-bell mr-2"/> {this.state.errorMessage}
                                </p>
                            </div>
                            : null
                        }

                    </Modal.Body>
                    <Modal.Footer>
                        {this.state.reviewLoader ?
                            <div className="sweet-loading mr-3">
                                <ClipLoader
                                    css={override}
                                    size={30}
                                    color={"#FF9595"}
                                    loading={this.state.reviewLoader}
                                />
                            </div>
                            :
                            <button className="btn btn-green-dark" onClick={() => this.reviewOrder()}>
                                <i className="czi-star mr-2"/>
                                Submit
                            </button>
                        }

                        <button className="btn btn-outline-danger" onClick={() => this.toggleReviewModal()}>Close
                        </button>
                    </Modal.Footer>
                </Modal>

                <div className="toast-container toast-bottom-center" style={{zIndex: '1070',}}>
                    <div className={this.state.toastAdded ? "toast mb-3 fade show" : "toast mb-3 fade hide"}
                         id="cart-toast" data-delay="5000" role="alert"
                         aria-live="assertive" aria-atomic="true">
                        <div className="toast-header bg-success text-white">
                            <i className="czi-check-circle mr-2"/>
                            <h6 className="font-size-sm text-white mb-0 mr-auto">Review Sent!</h6>
                            <button className="close text-white ml-2 mb-1" type="button"
                                    onClick={() => this.toggleToastAdded()}
                                    aria-label="Close"><span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="toast-body">Your review has been submitted successfully.</div>
                    </div>
                </div>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(History);