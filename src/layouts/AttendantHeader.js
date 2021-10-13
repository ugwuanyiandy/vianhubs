import React, {useState} from 'react'
import {Link, NavLink} from "react-router-dom";
import Logo from "../assets/images/logo/vhub.png";
import {getUser, logOutUser} from "../utils/auth"
import {Nav, Navbar} from "react-bootstrap";


const AttendantHeader = (props) => {

    const [expanded, setExpanded] = useState(false);
    const user = getUser();

    return (
        <>

            <header className="box-shadow-sm d-lg-none d-md-inline-block fixed-top">

                <Navbar bg="light" expand="lg" expanded={expanded}>
                    <div className="container">
                        <Navbar.Brand href="/" className='mr-6rem'>
                            <img src={Logo} className="mr-auto" alt="" style={{height: '60px'}}/>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"
                                       onClick={() => setExpanded(expanded ? false : "expanded")}/>
                        <Navbar.Collapse id="basic-navbar-nav" className="z-index-10">
                            <Nav className="mx-auto" onClick={() => setTimeout(() => {
                                setExpanded(false)
                            }, 150)}>
                                <NavLink to="/attendant/home" className='pt-3 pb-2 mx-3'>
                                    <i className="czi-home mr-2"/> Dashboard
                                </NavLink>

                                <NavLink to="/attendant/schedule" className='pt-3 pb-2 mx-3'>
                                    <i className="czi-time mr-2"/> Appointments
                                </NavLink>

                                <NavLink to="/attendant/earnings" className='pt-3 pb-2 mx-3'>
                                    <i className="czi-wallet mr-2"/> Earnings
                                </NavLink>

                                <NavLink to="/" className='pt-3 pb-2 mx-3' onClick={logOutUser}>
                                    <i className="czi-sign-out mr-2"/> Logout
                                </NavLink>
                            </Nav>

                        </Navbar.Collapse>
                    </div>
                </Navbar>

            </header>

            <header
                className="navbar navbar-expand navbar-light fixed-top bg-light box-shadow-sm px-3 px-lg-4 d-none d-lg-flex"
                data-scroll-header>
                <Link className="navbar-brand d-lg-none mr-auto" to="/" style={{minWidth: '7rem'}}>
                    <img src={Logo} alt="Vian Hub Salon" style={{height: '53px'}}/>
                </Link>

                <ul className="navbar-nav ml-auto d-none d-lg-flex">

                </ul>

                <button className="navbar-toggler d-block d-lg-none" type="button" data-toggle="collapse"
                        data-target="#components-nav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="navbar-tool ml-1 ml-lg-0 mr-n1 mr-lg-2 my-auto">
                    <div className="navbar-tool-icon-box"><i className="navbar-tool-icon czi-user"/></div>
                    <div className="navbar-tool-text ml-n3">
                        {user.first_name + " " + user.last_name}
                    </div>
                </div>
            </header>

            <aside className="sidenav collapse bg-green-dark" id="components-nav">
                <header className="sidenav-header bg-light d-none d-lg-block text-center">
                    <Link className="navbar-brand py-0 my-0" to="/" style={{minWidth: '7rem'}}>
                        <img src={Logo} alt="Vian Hub Salon" style={{height: '45px'}}/>
                    </Link>
                </header>
                <div className="sidenav-body" data-simplebar data-simplebar-auto-hide="true">
                    <div className="pt-4 pb-3 mt-3">

                        <div className="widget widget-links widget-light mb-4 pb-2">
                            <h3 className="widget-title text-white">Dashboard</h3>
                            <ul className="widget-list">
                                <NavLink to={'/attendant/home'}>
                                    <li className="widget-list-item">
                                        <p className="widget-list-link"><i className="czi-home mr-2"/> Dashboard</p>
                                    </li>
                                </NavLink>

                                <NavLink to={'/attendant/schedule'}>
                                    <li className="widget-list-item">
                                        <p className="widget-list-link"><i className="czi-time mr-2"/> Appointments</p>
                                    </li>
                                </NavLink>

                                <NavLink to={'/attendant/earnings'}>
                                    <li className="widget-list-item">
                                        <p className="widget-list-link"><i className="czi-wallet mr-2"/> Earnings</p>
                                    </li>
                                </NavLink>

                                <Link to={'#'} onClick={() => logOutUser()}>
                                    <li className="widget-list-item">
                                        <p className="widget-list-link"><i className="czi-sign-out mr-2"/> Logout</p>
                                    </li>
                                </Link>
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
};

export default AttendantHeader
