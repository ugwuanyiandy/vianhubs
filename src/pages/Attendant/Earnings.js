import React, {useEffect} from "react";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps,} from "../../redux/actions";
import {Link} from "react-router-dom";
import Endpoint from "../../utils/endpoint";
import {currencyFormat, useMergeState} from "../../utils/helpers";
import ClipLoader from "react-spinners/ClipLoader";
import {getUser} from "../../utils/auth";

const AttendantEarnings = (props) => {
    const [state, setState] = useMergeState({
        toastAdded: false,
        confirmAppointment: false,
        toastConfirmed: false,
        startDate: null,
        endDate: null,
    });
    //const user = props[stateKeys.USER];
    const user = getUser();

    const getEarnings = () => {
        setState({attendantEarnings: false});
        Endpoint.getAttendantEarnings(
            state.startDate,
            state.endDate,
            user.worker_profile?.id
        ).then((res) => {
            setState({attendantEarnings: res.data.data});
            console.log(state.attendantEarnings, "shop");
        });
    };

    useEffect(() => {
        Endpoint.getAttendantEarningsLazy(user.worker_profile?.id).then(
            (res) => {
                setState({attendantEarnings: res.data.data});
                console.log(state.attendantEarnings, "shop");
            }
        );
    }, [])

    const override = {
        display: "block",
        margin: "0 auto",
        // borderColor: 'red',
    };

    return <>
        <div className="border-bottom mt-lg-2 mt-5 pt-5 pb-2 mb-2">
            <nav className="mb-4 mt-5" aria-label="breadcrumb">
                <ol className="breadcrumb flex-lg-nowrap">
                    <li className="breadcrumb-item">
                        <Link className="text-nowrap" to="/">
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
                        Earnings
                    </li>
                </ol>
            </nav>

            <h2 className="mt-lg-1 pt-lg-1">My Earnings</h2>
        </div>
        <div className="form-inline">
            <label>From: &nbsp; </label>
            <input
                type="date"
                className="form-control col-4"
                onChange={(e) =>
                    setState({startDate: e.target.value.substring(0, 10)})
                }
            />
            &nbsp; &nbsp; &nbsp;
            <label>To: &nbsp; </label>
            <input
                type="date"
                className="form-control col-4"
                onChange={(e) =>
                    setState({endDate: e.target.value.substring(0, 10)})
                }
            />
            &nbsp; &nbsp; &nbsp;
            <button className="btn btn-green-dark" onClick={getEarnings}>
                Load
            </button>
        </div>
        <br/>

        <div className="pt-1 pb-5">
            {/* <h1 className="h4 text-dark mb-0">My Upcoming Appointments</h1> */}
            <section className="border-bottom pb-4">
                <div className="row">
                    <div className="col-md-6 col-lg-4">
                        <div className="card admin-card-2 mt-3 box-shadow">
                            {/*<img src={hairm} className="card-img-top" alt="Card image"/>*/}

                            <div className="card-body">
                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                    <h6 className=""><i className="czi-wallet"/> Total Earnings</h6>

                                    <div className="product-price">
                                        <h1 className="text-green-light">
                                            {currencyFormat(
                                                state.attendantEarnings == null
                                                    ? "-"
                                                    : parseInt(state.attendantEarnings?.earning)
                                            )}
                                        </h1>
                                    </div>
                                </div>
                                <p className="card-text font-size-sm text-muted mb-1">
                                    {/* <span className="text-primary mr-2"> <i className="czi-user"/> </span> */}
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-6 col-lg-4">
                        <div className="card admin-card-2 mt-3 box-shadow">
                            {/*<img src={hairm} className="card-img-top" alt="Card image"/>*/}

                            <div className="card-body">
                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                    <h6 className=""><i className='czi-time'/> Total Sessions</h6>

                                    <div className="product-price">
                                        <h1 className="text-green-light">
                                            {state.attendantEarnings?.session_count}
                                        </h1>
                                    </div>
                                </div>
                                <p className="card-text font-size-sm text-muted mb-1">
                                    {/* <span className="text-primary mr-2"> <i className="czi-user"/> </span> */}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-4">
                        <div className="card admin-card-2 mt-3 box-shadow">
                            {/*<img src={hairm} className="card-img-top" alt="Card image"/>*/}

                            <div className="card-body">
                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                    <h6 className=""><i className='czi-check-circle'/> Sessions served</h6>

                                    <div className="product-price">
                                        <h1 className="text-green-light">
                                            {state.attendantEarnings?.session_served_sum}
                                        </h1>
                                    </div>
                                </div>
                                <p className="card-text font-size-sm text-muted mb-1">
                                    {/* <span className="text-primary mr-2"> <i className="czi-user"/> </span> */}
                                </p>
                            </div>
                        </div>
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
                                            <td>Service Name</td>
                                            <td>Cost</td>
                                            <td>Session Date</td>
                                            <td>Serve Status</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {state.attendantEarnings?.sessions?.data !=
                                        null &&
                                        state.attendantEarnings?.sessions?.data.map(
                                            (a, i) => {
                                                return (
                                                    <tr>
                                                        <td>{i + 1}</td>
                                                        <td>{a.service_name}</td>
                                                        <td>{currencyFormat(a.cost)}</td>
                                                        <td>
                                                            {a.created_at == null
                                                                ? "-"
                                                                : a.created_at.slice(0, 10)}
                                                        </td>
                                                        <td>
                                                            {a.served == 0 ? (
                                                                <span className="badge badge-danger badge-sm">
                                          Not-served
                                        </span>
                                                            ) : (
                                                                <span className="badge badge-success badge-sm">
                                          Served
                                        </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                        {!state.attendantEarnings?.sessions?.data ? (
                                            <tr>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>
                                                    <div className="sweet-loading">
                                                        <ClipLoader
                                                            css={override}
                                                            size={60}
                                                            color={"#FF9595"}
                                                            loading={state.spinner}
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
        </div>
    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(AttendantEarnings);
