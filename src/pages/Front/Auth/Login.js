import React, {Component} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../../redux/actions";
import {Link} from "react-router-dom"
import {handleFormSubmissionError} from "../../../utils/helpers";
import Endpoint from "../../../utils/endpoint";
import ClipLoader from "react-spinners/ClipLoader";
import {loginUser} from "../../../utils/auth";

class Login extends Component {
    state = {
        email: '',
        password: '',
        remember_me: false,
        formIncomplete: false,
    };

    handleInput = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };


    login = (e) => {
        e.preventDefault();
        this.setState({loading: true, success: false, error: false});

        if (!this.state.email || !this.state.password) {
            this.setState({formIncomplete: true, loading: false});
            return
        }

        const LoginProps = {
            email: this.state.email,
            password: this.state.password,
        };

        Endpoint.login(LoginProps)
            .then((res) => {
                this.setState({error: false, success: true, loading: false});
                loginUser(res.data.data.token, res.data.data.user, this.state.remember_me, true);
            })
            .catch((error) => handleFormSubmissionError(error, this));

        return false;
    };

    componentDidMount() {
        this.props.setState('home', stateKeys.PAGE_CLASS);
    }

    render() {
        const override = {
            display: 'block',
            margin: '0 auto',
            // borderColor: 'red',
        };


        return (
            <>
                <div className="container py-4 py-lg-5 my-4">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card border-0 box-shadow">
                                <div className="card-body">
                                    <h2 className="h4 mb-1">Login</h2>

                                    <hr/>

                                    <h3 className="font-size-base pt-4 pb-2">Using form below</h3>

                                    {this.state.formIncomplete ?
                                        <div className="bg-danger border-rad-2 text-center p-2 mb-3">
                                            <p className="small text-light mb-0">
                                                <i className="czi-bell mr-2"/> Please fill in all fields.
                                            </p>
                                        </div>
                                        : null
                                    }

                                    {this.state.error ?
                                        <div className="bg-danger border-rad-2 text-center p-2 mb-3">
                                            <p className="small text-light mb-0">
                                                <i className="czi-bell mr-2"/> {this.state.errorMessage}
                                            </p>
                                        </div>
                                        : null
                                    }
                                    <form className="needs-validation" noValidate onSubmit={this.login}>
                                        <div className="input-group-overlay form-group">
                                            <div className="input-group-prepend-overlay">
                                                <span className="input-group-text">
                                                    <i className="czi-mail"/>
                                                </span>
                                            </div>
                                            <input className="form-control prepended-form-control" type="email"
                                                   checked={this.state.remember_me}
                                                   onChange={this.handleInput} name='email' placeholder="Email"
                                                   required/>
                                        </div>

                                        <div className="input-group-overlay form-group">
                                            <div className="input-group-prepend-overlay">
                                                <span className="input-group-text">
                                                    <i className="czi-locked"/>
                                                </span>
                                            </div>
                                            <div className="password-toggle">
                                                <input className="form-control prepended-form-control" type="password"
                                                       onChange={this.handleInput} name='password'
                                                       placeholder="Password"
                                                       required/>

                                                <label className="password-toggle-btn">
                                                    <input className="custom-control-input" type="checkbox"/>
                                                    {/*<i className="czi-eye password-toggle-indicator"/>*/}
                                                    {/*<span className="sr-only">Show password</span>*/}
                                                </label>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-wrap justify-content-between">
                                            <div className="custom-control custom-checkbox">
                                                <input className="custom-control-input" type="checkbox"
                                                       onChange={this.handleInput}
                                                       name='remember_me'
                                                       id="remember_me"/>
                                                <label className="custom-control-label" htmlFor="remember_me">Remember
                                                    me</label>
                                            </div>

                                            <Link className="nav-link-inline font-size-sm text-green-light"
                                                  to="#">
                                                Forgot password?
                                            </Link>
                                        </div>

                                        <hr className="mt-4"/>

                                        <div className="d-flex justify-content-between pt-4">
                                            <p>Don't have an account?
                                                <span className='font-weight-bold '>
													<Link to={'/register'}> Register</Link>
												</span>
                                            </p>

                                            {this.state.loading ?
                                                <div className="sweet-loading">
                                                    <ClipLoader
                                                        css={override}
                                                        size={30}
                                                        color={"#FF9595"}
                                                        loading={this.state.loading}
                                                    />
                                                </div>
                                                :
                                                <button className="btn btn-green-dark" type="submit">
                                                    <i className="czi-sign-in mr-2 ml-n21"/>Sign In
                                                </button>
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
