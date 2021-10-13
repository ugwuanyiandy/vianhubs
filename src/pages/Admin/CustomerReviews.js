import React, {Component} from "react";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys,} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import {Modal} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import Pagination from "react-js-pagination";
import {Link} from "react-router-dom";

// require("bootstrap/less/bootstrap.less");

class CustomerReviews extends Component {
    state = {
        activePage: 1,
    };

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    }

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

    getCustomerReviews = () => {
        Endpoint.getCustomerReviews()
            .then((res) => {
                this.setState({customerReviews: res.data.data.data, listReviewData: res.data.data});
                console.log(res.data.data, "Customers Reviews");
            });
    };

    handleDeleteReview = () => {
        this.setState({deleteModal: false});
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

    loadReviewData = (data) => {
        this.setState({
            name: data.user.name,
            comment: data.comment,
            created_at: data.created_at,
            service_name: data.service.name,
            reviewCard: true
        })
        console.log(data, "Customer Data")
    };

    componentDidMount() {
        this.props.setState("home", stateKeys.PAGE_CLASS);
        this.props.setState("Sample content for dialog", stateKeys.DIALOG_CONTENT);
        this.getCustomerReviews();
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
                            Delete selected review?
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
                                <Link className="text-nowrap" to="">
                                    <i className="czi-home"/>
                                    Home
                                </Link>
                            </li>

                            <li className="breadcrumb-item">
                                <Link className="text-nowrap" to="">
                                    <i className="czi-"/> Dashboard
                                </Link>
                            </li>

                            <li
                                className="breadcrumb-item text-nowrap active"
                                aria-current="page"
                            >
                                Reviews
                            </li>
                        </ol>
                    </nav>

                    <h2 className="mt-lg-1 pt-lg-1">Shop Customer Reviews</h2>
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
                                                    <td>Service Name</td>
                                                    <td>Comments</td>
                                                    <td>Date</td>
                                                    <td>Action</td>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                {this.state.customerReviews &&
                                                this.state.customerReviews.map((a, b) => {
                                                    return (
                                                        <tr>
                                                            <td>{b + 1}</td>
                                                            <td>{a.user?.name}</td>
                                                            <td>{a.service?.name}</td>
                                                            <td>{a.comment.slice(0, 13) + (a.comment.length > 10 ? "..." : "")}</td>
                                                            <td>
                                                                {a.created_at == null
                                                                    ? a.created_at
                                                                    : a.created_at.slice(0, 10)}
                                                            </td>
                                                            <td>
                                                                <button className="btn btn-outline-green-dark btn-sm"
                                                                        onClick={() => this.loadReviewData(a)}>
                                                                    <i className="czi-eye"/>
                                                                </button>
                                                                &nbsp;
                                                                <button className="btn btn-outline-danger btn-sm"
                                                                        onClick={() => this.promptDelete(a)}>
                                                                    <i className="czi-trash"/>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}

                                                {!this.state.customerReviews && this.state.listReviewData ? (
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

                                    {this.state.listReviewData ?
                                        this.state.listReviewData.last_page > 1 ?
                                            <div className="row justify-content-center">
                                                <Pagination
                                                    activePage={this.state.activePage ? this.state.activePage : null}
                                                    itemsCountPerPage={this.state.listReviewData ? this.state.listReviewData.per_page : null}
                                                    totalItemsCount={this.state.listReviewData ? this.state.listReviewData.total : null}
                                                    pageRangeDisplayed={5}
                                                    onChange={this.handlePageChange.bind(this)}
                                                    itemClass="page-item"
                                                    linkClass="page-link"
                                                />
                                            </div>
                                            :
                                            null
                                        :
                                        null
                                    }

                                </section>
                            </div>
                        </div>
                    </section>


                    <Modal show={this.state.reviewCard} size="lg">
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                {this.state.name}
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            {this.state.errorMsg ? (
                                <div className="bg-danger border-rad-2 text-center p-2 mb-3">
                                    <p className="small text-light mb-0">
                                        <i className="czi-bell mr-2"/> {this.state.content_message}
                                    </p>
                                </div>
                            ) : null}

                            {this.state.comment}
                            <br/>
                        </Modal.Body>

                        <Modal.Footer>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => {
                                    this.setState({reviewCard: false});
                                }}
                            >
                                Close
                            </button>
                        </Modal.Footer>
                    </Modal>

                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerReviews);
