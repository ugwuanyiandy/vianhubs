import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import {Link} from "react-router-dom";
import Endpoint from "../../utils/endpoint";
import ClipLoader from "react-spinners/ClipLoader";
import {currencyFormat, durationCovert, PAGINATOR_DEFAULT, useMergeState} from "../../utils/helpers";
import CountCard from "../../components/Cards/CountCard";

const CartItems = (props) => {
    const [page, setPage] = useState(1);

    const [summary, setSummary] = useState({
        amount: 0, count: 0, most_selected: []
    });
    const [summaryXhrStatus, setSummaryXhrStatus] = useMergeState({
        message: '', success: false, error: false, warning: false, loading: false
    });

    const [services, setServices] = useState(PAGINATOR_DEFAULT);
    const [servicesXhrStatus, setServicesXhrStatus] = useMergeState({
        message: '', success: false, error: false, warning: false, loading: false
    });

    const [users, setUsers] = useState(PAGINATOR_DEFAULT);
    const [usersXhrStatus, setUsersXhrStatus] = useMergeState({
        message: '', success: false, error: false, warning: false, loading: false
    });

    useEffect(() => {
        props.setState('home', stateKeys.PAGE_CLASS);

        setUsersXhrStatus({loading: true});
        setSummaryXhrStatus({loading: true})
        setServicesXhrStatus({loading: true})

        Endpoint.getUsersCarts()
            .then(res => {
                setUsers(res.data.data)
            }).finally(() => setSummaryXhrStatus({loading: false}))

        Endpoint.getServicesInCarts()
            .then(res => {
                setServices(res.data.data)
            }).finally(() => setServicesXhrStatus({loading: false}))

        Endpoint.getUsersCartSummary()
            .then(res => {
                setSummary(res.data.data)
            }).finally(() => setUsersXhrStatus({loading: false}))
    }, []);

    const override = {
        display: 'block',
        margin: '0 auto',
    };

    return <>
        <div className="border-bottom mt-lg-2 mt-5 pt-5 pb-2 mb-2">
            <nav className="mb-4 mt-5" aria-label="breadcrumb">
                <ol className="breadcrumb flex-lg-nowrap">
                    <li className="breadcrumb-item">
                        <Link className="text-nowrap" to="/admin">
                            <i className="czi-home"/> Home
                        </Link>
                    </li>

                    <li className="breadcrumb-item">
                        <Link className="text-nowrap" to="">
                            <i className="czi-"/> Dashboard
                        </Link>
                    </li>

                    <li className="breadcrumb-item text-nowrap active" aria-current="page">Customer's Cart</li>
                </ol>
            </nav>

            <div className="row mb-2">
                <div className="col-auto d-block">
                    <h2 className="mt-lg-1 pt-lg-1">Customer's Cart</h2>
                </div>

                <div className="col-auto ml-auto">
                    <div className="row">

                        <div className="col-auto">
                            <button className="btn mr-1 btn-outline-green-dark d-inline"
                                    disabled={page === 1}
                                    onClick={() => setPage(1)}>
                                <i className="czi-gift mr-2"/>
                                View By Services
                            </button>
                            <button className="btn btn-outline-green-dark d-inline"
                                    disabled={page === 2}
                                    onClick={() => setPage(2)}>
                                <i className="czi-user mr-2"/>
                                View By Users
                            </button>
                        </div>

                    </div>

                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <CountCard
                        cardTitle={'Total'}
                        cardCount={summary.count}/>
                </div>
                <div className="col-md-6">
                    <CountCard
                        cardTitle={'Amount'}
                        cardCount={currencyFormat(summary.amount)}/>
                </div>
            </div>
        </div>

        <div className="pt-1 pb-5">
            <section>
                <div className="pt-1 pb-5">

                    <section className="mb-5 pb-5">
                        <div className="mt-3">
                            {{
                                1: <>
                                    <section className='border-bottom pb-4'>
                                        <div className="row">
                                            <div className='col-md-6 mb-2'>
                                                <div className='card'>
                                                    <div className='card-body'>
                                                        <h4>Services</h4>
                                                        {
                                                            servicesXhrStatus.loading ?
                                                                <div className="sweet-loading my-5vh mr-3">
                                                                    <div className="row justify-content-center">
                                                                        <div className="col-md-3">
                                                                            <div
                                                                                className=" product-card box-shadow">
                                                                                <div className="card-body">
                                                                                    <ClipLoader
                                                                                        css={override}
                                                                                        size={70}
                                                                                        color={"#FF9595"}
                                                                                        loading={servicesXhrStatus.loading}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className='table-responsive'>
                                                                    <table className="table table-hover">
                                                                        <thead className="thead-light">
                                                                        <tr className="font-weight-bold">
                                                                            <td>Service Name</td>
                                                                            <td>Total</td>
                                                                            <td>Duration</td>
                                                                            <td>Cost</td>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {services.data.map((a, i) =>
                                                                            <tr key={i}>
                                                                                <td>{a.name}</td>
                                                                                <td>{a.cart_count}</td>
                                                                                <td>{durationCovert(a.duration)}</td>
                                                                                <td>{currencyFormat(a.cost)}</td>
                                                                            </tr>
                                                                        )
                                                                        }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-md-6 mb-2'>
                                                <div className='card'>
                                                    <div className='card-body'>
                                                        <h4>Most Added</h4>
                                                        {
                                                            summaryXhrStatus.loading ?
                                                                <div className="sweet-loading my-5vh mr-3">
                                                                    <div className="row justify-content-center">
                                                                        <div className="col-md-3">
                                                                            <div
                                                                                className=" product-card box-shadow">
                                                                                <div className="card-body">
                                                                                    <ClipLoader
                                                                                        css={override}
                                                                                        size={70}
                                                                                        color={"#FF9595"}
                                                                                        loading={summaryXhrStatus.loading}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <>
                                                                    <div className='table-responsive'>
                                                                        <table className="table table-hover">
                                                                            <thead className="thead-light">
                                                                            <tr className="font-weight-bold">
                                                                                <td>Service Name</td>
                                                                                <td>Total</td>
                                                                                <td>Duration</td>
                                                                                <td>Cost</td>
                                                                            </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                            {
                                                                                summary.most_selected.map((a, i) =>
                                                                                    <tr key={i}>
                                                                                        <td>{a.name}</td>
                                                                                        <td>{a.cart_count}</td>
                                                                                        <td>{durationCovert(a.duration)}</td>
                                                                                        <td>{currencyFormat(a.cost)}</td>
                                                                                    </tr>
                                                                                )
                                                                            }
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </>,
                                2: <>
                                    <div className='card'>
                                        <div className='card-body'>
                                            <h4>User's Cart Items</h4>
                                            {usersXhrStatus.loading ?
                                                <div className="sweet-loading my-5vh mr-3">
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-3">
                                                            <div
                                                                className=" product-card box-shadow">
                                                                <div className="card-body">
                                                                    <ClipLoader
                                                                        css={override}
                                                                        size={70}
                                                                        color={"#FF9595"}
                                                                        loading={usersXhrStatus.loading}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <div className="table-responsive">
                                                    <table className="table table-hover">
                                                        <thead className="thead-light">
                                                        <tr className="font-weight-bold">
                                                            <td>Customer</td>
                                                            <td>Total</td>
                                                            <td>Cart</td>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {users.data.map((a, i) =>
                                                            <tr key={i}>
                                                                <td>
                                                                    <span>{a.name}</span><br/>
                                                                    <small>{a.email}</small>, <small>{a.phone}</small>
                                                                </td>
                                                                <td>{a.cart_count}</td>
                                                                <td>
                                                                    {a.cart.map((item, i) =>
                                                                        <p key={i}>{item.service.name} ({item.qty ? item.qty : 1})</p>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </>
                            }[page]}
                        </div>
                    </section>
                </div>
            </section>
        </div>
    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItems);