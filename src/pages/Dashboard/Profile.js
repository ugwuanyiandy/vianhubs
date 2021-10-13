import React from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import ClipLoader from "react-spinners/ClipLoader";
import {handleFormSubmissionError, useMergeState} from "../../utils/helpers";
import {Link} from "react-router-dom";
import {getUser, updateUserInfo} from "../../utils/auth";

const Profile = props => {

    const user = getUser();
    const [state, setState] = useMergeState({
        pageLoading: false,
        loading: false,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        formIncomplete: false,
        updateLoading: false,
    });


    const updateUser = () => {
        setState({formIncomplete: false});

        if (!state.first_name || !state.last_name || !state.email || !state.phone) {
            setState({formIncomplete: true});
            return false
        } else if (state.first_name && state.last_name && state.email && state.phone) {

            const updateDetails = {
                first_name: state.first_name,
                last_name: state.last_name,
                other_names: state.other_names,
                email: state.email,
                phone: state.phone,
            };

            setState({loading: true});
            Endpoint.updateUserProfile(updateDetails)
                .then(res => {
                    updateUserInfo(updateDetails);
                })
                .catch((error) => handleFormSubmissionError(error, this))
                .finally(() => setState({loading: false}));
        }
    };

    const override = {
        display: 'block',
        margin: '0 auto',
    };

    return <>
        <div className="border-bottom mt-lg-2 mt-5 pt-5 pb-2 mb-2">
            <nav className="mb-4 mt-5" aria-label="breadcrumb">
                <ol className="breadcrumb flex-lg-nowrap">
                    <li className="breadcrumb-item">
                        <Link className="text-nowrap" to="">
                            <i className="czi-home"/>Home
                        </Link>
                    </li>

                    <li className="breadcrumb-item">
                        <Link className="text-nowrap" to="">
                            <i className="czi-"/> Dashboard
                        </Link>
                    </li>

                    <li className="breadcrumb-item text-nowrap active" aria-current="page">Profile</li>
                </ol>
            </nav>

            <h2 className="mt-lg-1 pt-lg-1">Profile</h2>
        </div>

        <div className="">
            <div className="">
                <div className="">
                    <div className="container my-5 pb-3 min-vh-65">

                        <div className="bg-light box-shadow-lg rounded-lg overflow-hidden ">
                            {
                                state.pageLoading ?
                                    <div className="sweet-loading mt-20vh mr-3">
                                        <ClipLoader
                                            css={override}
                                            size={30}
                                            color={"#FF9595"}
                                            loading={state.pageLoading}
                                        />
                                    </div>
                                    :
                                    <div className="row">

                                        <section className="col pt-lg-4 pb-4 mb-3">
                                            <div className="pt-2 px-4 pl-lg-0 px-xl-5">

                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <div className="form-group">
                                                            <label htmlFor="dashboard-fn">
                                                                First Name
                                                            </label>
                                                            <input className="form-control" type="text"
                                                                   id="first_name" value={state.first_name}
                                                                   onChange={(e) => setState({first_name: e.target.value})}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="form-group">
                                                            <label htmlFor="dashboard-ln">
                                                                Last Name
                                                            </label>
                                                            <input className="form-control" type="text"
                                                                   id="last_name" value={state.last_name}
                                                                   onChange={(e) => setState({last_name: e.target.value})}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6">
                                                        <div className="form-group">
                                                            <label htmlFor="dashboard-email">
                                                                Email address
                                                            </label>
                                                            <input className="form-control" type="email"
                                                                   id="email" value={state.email}
                                                                   onChange={(e) => setState({email: e.target.value})}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-6">
                                                        <div className="form-group">
                                                            <label htmlFor="dashboard-email">
                                                                Phone
                                                            </label>
                                                            <input className="form-control" type="text"
                                                                   id="phone" value={state.phone}
                                                                   onChange={(e) => setState({phone: e.target.value})}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/*<div className="col-sm-6">*/}
                                                    {/*	<div className="form-group">*/}
                                                    {/*		<label htmlFor="dashboard-address">*/}
                                                    {/*			Address*/}
                                                    {/*		</label>*/}
                                                    {/*		<input className="form-control" type="text"*/}
                                                    {/*			   id="address" value={state.address}*/}
                                                    {/*			   onChange={(e) => setState({address: e.target.value }) }*/}
                                                    {/*		/>*/}
                                                    {/*	</div>*/}
                                                    {/*</div>*/}

                                                    {state.formIncomplete ?
                                                        <div className="col-sm-6 mt-auto">
                                                            <div
                                                                className="bg-primary border-rad-2 text-center p-2 mb-3">
                                                                <p className="small text-light mb-0">
                                                                    <i className="czi-bell mr-2"/> Please fill
                                                                    in all fields.
                                                                </p>
                                                            </div>
                                                        </div>
                                                        : null
                                                    }

                                                    {state.error ?
                                                        <div className="col-sm-6 mt-auto">
                                                            <div
                                                                className="bg-danger border-rad-2 text-center p-2 mb-3">
                                                                <p className="small text-light mb-0">
                                                                    <i className="czi-bell mr-2"/> {state.errorMessage}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        : null
                                                    }

                                                    <div className="col-12">
                                                        <hr className="mt-2 mb-3"/>

                                                        {state.loading ?
                                                            <div
                                                                className="d-flex flex-wrap justify-content-end align-items-center">
                                                                <div className="sweet-loading mr-3">
                                                                    <ClipLoader
                                                                        css={override}
                                                                        size={30}
                                                                        color={"#FF9595"}
                                                                        loading={state.loading}
                                                                    />
                                                                </div>
                                                            </div>
                                                            :
                                                            <div
                                                                className="d-flex flex-wrap justify-content-end align-items-center">
                                                                <button
                                                                    className="btn btn-green-dark mt-3 mt-sm-0"
                                                                    type="button" onClick={updateUser}>
                                                                    Save changes
                                                                </button>
                                                            </div>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                            }

                        </div>
                    </div>

                </div>
            </div>
        </div>

    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);