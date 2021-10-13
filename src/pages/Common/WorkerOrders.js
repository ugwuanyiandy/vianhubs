import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import ClipLoader from "react-spinners/ClipLoader";
import Pagination from "react-js-pagination";
import {currencyFormat, handleAxiosError} from "../../utils/helpers";
import {printOrder} from "../../utils/cart";
import {Modal} from "react-bootstrap";

class WorkerOrders extends Component {

    state = {
        toastAdded: false,
        allOrders: [],
        loading: false,
        activePage: 1,
        searchText: "",
        searching: false,
        nothingFound: false,
    };

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
    }

    toggleSearching = () => {
        this.setState({searching: !this.state.searching});
    };

    setSearchText = (e) => {
        var text = e.target.value;
        this.setState({searchText: text, searchQuery: text});
    };

    searchWithQuery = () => {
        this.setState({searching: true});
        const payload = {
            search: this.state.searchQuery,
        };

        Endpoint.searchOrders(payload)
            .then(res => {
                this.setState({allOrders: res.data.data.data, searching: true, loading: false});
            })
            .catch((error) => {
                console.log(error + "error");
                handleAxiosError(error);

                setTimeout(() => {
                    this.setState({
                        loading: false
                    })
                }, 4000)
            });
    };

    promptApprove = (order) => {
        // this.loadData(a);
        this.setState({
            approveModal: true,
            selectedRef: order.reference,
        })
    };

    approvePayment = () => {
        this.setState({approveModal: false, loading: true});

        Endpoint.approvePayment(this.state.selectedRef)
            .then((res) => {
                this.setState({successMsg: true});
                this.loadDataFromServer()
            })
            .catch((e) => handleAxiosError(e))
            .finally(() => this.setState({loading: false}));

    };

    toggleToastAdded = () => {
        this.setState({toastAdded: !this.state.toastAdded});
        let currentState = this;
        setTimeout(function () {
            currentState.setState({toastAdded: false});
        }, 5000);
    };

    loadDataFromServer = () => {
        this.setState({loading: true});

        Endpoint.getAllOrders()
            .then(res => {
                this.setState({allOrders: res.data.data.data, listReviewData: res.data.data});
            })
            .finally(() => this.setState({loading: false}));
    };

    hasUnassignedSession = order => {
        return order.sessions.slice(0)  // create copy of "array" for iterating
            .reduce((acc, session, i, arr) => {
                if (!session.worker_name)
                    arr.splice(1);    // eject early by mutating iterated copy

                return !session.worker_name;
            }, '');
    }

    componentDidMount() {
        this.loadDataFromServer()
    }

    render() {
        const override = {
            display: 'block',
            margin: '0 auto',
        };

        return (
            <>
                <Modal show={this.state.approveModal} size="sm">
                    <Modal.Header>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Approve Payment with reference {this.state.selectedRef}?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <button className="btn btn-green-dark"
                                onClick={() => this.approvePayment()}>
                            <i className="czi-check mr-2"/>
                            Confirm
                        </button>

                        <button className="btn btn-outline-danger" onClick={() => {
                            this.setState({approveModal: false})
                        }}>Close
                        </button>
                    </Modal.Footer>
                </Modal>

                <div className="border-bottom mt-lg-2 mt-5 pt-5 pb-2 mb-2">
                    <nav className="mb-4 mt-5" aria-label="breadcrumb">
                        <ol className="breadcrumb flex-lg-nowrap">
                            <li className="breadcrumb-item">
                                <a className="text-nowrap" href="">
                                    <i className="czi-home"/>Home
                                </a>
                            </li>

                            <li className="breadcrumb-item text-nowrap active" aria-current="page">Orders</li>
                        </ol>
                    </nav>

                    <div className="row mb-2">
                        <div className="col-auto d-block">

                            {this.state.searching ?
                                <h2 className="mt-lg-1 pt-lg-1">Search Results</h2>
                                :
                                <h2 className="mt-lg-1 pt-lg-1">All Orders</h2>
                            }
                        </div>

                        <div className="col-auto ml-auto">
                            <div className="input-group mb-3">
                                <input type="text" className="form-control"
                                       placeholder="Order No or Customer Name"
                                       onChange={this.setSearchText}/>
                                <button className="btn btn-green-dark" type="button"
                                        id="button-addon2" onClick={() => this.searchWithQuery()}>Search
                                </button>
                            </div>

                        </div>
                    </div>

                </div>

                <div className="pt-1 pb-5">
                    <section>
                        <div className="pt-1 pb-5">

                            <section className="mb-5 pb-5">
                                <div className="mt-3">

                                    <div className="">
                                        {
                                            this.state.searching ?
                                                <>
                                                    <p className="cursor-pointer col-12 font-weight-bold"
                                                       onClick={() => this.toggleSearching()}>
                                                        <i className="czi-arrow-left-circle mr-2"/>
                                                        Show All Orders
                                                    </p>
                                                    <br/>
                                                </>
                                                : ''
                                        }
                                        {
                                            this.state.loading ?
                                                <div className="sweet-loading my-5vh mr-3">
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-3">
                                                            <div className=" product-card box-shadow">
                                                                <div className="card-body">
                                                                    <ClipLoader
                                                                        css={override}
                                                                        size={70}
                                                                        color={"#FF9595"}
                                                                        loading={this.state.loading}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <section className='border-bottom pb-4'>
                                                    <div className="row">

                                                        <div className='table-responsive'>
                                                            <table className="table">
                                                                <thead>
                                                                <tr className="font-weight-bold">
                                                                    <td>Order No.</td>
                                                                    <td>Customer</td>
                                                                    <td>Services</td>
                                                                    <td>Total</td>
                                                                    <td>Sub Total</td>
                                                                    <td>Discount</td>
                                                                    <td>Created On</td>
                                                                    <td>Status</td>
                                                                    <td>Actions</td>
                                                                </tr>
                                                                </thead>

                                                                <tbody>
                                                                {
                                                                    this.state.allOrders ?
                                                                        this.state.allOrders.map((order, index) =>
                                                                            <tr key={index}>
                                                                                <td className="font-weight-bold">{order.reference}</td>
                                                                                <td>
                                                                                    {order.buyer_name}<br/>{order.buyer_phone}
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        order.sessions.length ?
                                                                                            order.sessions.map((session, index) =>
                                                                                                <p key={index}>
                                                                                                    {session.service_name}<br/>
                                                                                                    <small>Attendant: {session.worker_name ?? 'Not assigned'}</small>
                                                                                                </p>
                                                                                            )
                                                                                            :
                                                                                            null
                                                                                    }
                                                                                </td>
                                                                                <td>{currencyFormat(order.total)}</td>
                                                                                <td>{currencyFormat(order.sub_total)}</td>
                                                                                <td>{currencyFormat(order.discount)}</td>
                                                                                <td>
                                                                                    {new Date(order.created_at).toDateString()}
                                                                                </td>
                                                                                <td>{order.paid_at ? "Paid" : "Unpaid"}</td>
                                                                                <td>
                                                                                    {/*{order.pay_verified_at ?
                                                                                        (
                                                                                            this.hasUnassignedSession(order) ?
                                                                                                <button
                                                                                                    className="btn btn-sm btn-primary">
                                                                                                    <i className='fa fa-edit mr-1'/>
                                                                                                    Assign
                                                                                                </button>
                                                                                                :
                                                                                                <button
                                                                                                    onClick={() => printOrder(order)}
                                                                                                    className="btn btn-sm btn-outline-green-dark">
                                                                                                    <i className='fa fa-print mr-1'/>
                                                                                                    Print
                                                                                                </button>
                                                                                        )
                                                                                        :
                                                                                        <button
                                                                                            onClick={() => this.promptApprove(order)}
                                                                                            className="btn btn-sm btn-green-dark">
                                                                                            <i className='fa fa-check mr-1'/>
                                                                                            Approve
                                                                                        </button>
                                                                                    }*/}
                                                                                    {order.pay_verified_at ?
                                                                                        <button
                                                                                            onClick={() => printOrder(order)}
                                                                                            className="btn btn-sm btn-outline-green-dark">
                                                                                            <i className='fa fa-print mr-1'/>
                                                                                            Print
                                                                                        </button>
                                                                                        :
                                                                                        <button
                                                                                            onClick={() => this.promptApprove(order)}
                                                                                            className="btn btn-sm btn-green-dark">
                                                                                            <i className='fa fa-check mr-1'/>
                                                                                            Approve
                                                                                        </button>
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                        :
                                                                        <tr>
                                                                            <h5 className="text-center mt-3">Nothing
                                                                                Found</h5>
                                                                        </tr>

                                                                }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </section>
                                        }

                                    </div>
                                </div>
                            </section>
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
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkerOrders);