import React, {useState} from 'react'
import {Link, NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../redux/actions";
import Logo from "../assets/images/logo/vhub.png";
import {Nav, Navbar} from "react-bootstrap";
import CartIcon from "../components/Cart/CartIcon";
import {userLoggedIn} from "../utils/auth";

const FrontHeader = (props) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <header className="box-shadow-sm">
            {/*Topbar*/}
            <div className="topbar topbar-dark bg-dark2">
                <div className="container justify-content-center">
                    <div className="row">
                        <div className="topbar-text text-nowrap d-md-none d-sm-inline-block bg-auth-btn py-1 px-3">
                            <Link to={'/login'}>
                                <p className='text-white mb-0'>Login/Register</p>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="container justify-content-between">
                    <div className="topbar-text text-nowrap d-none d-md-inline-block">
                        <i className="czi-support text-light"/>
                        <span className="text-muted mr-1">Support:</span>
                        <a className="topbar-link text-white" href="tel:07048413179"> +234 704 841 3179</a>,
                        <a className="topbar-link text-white" href="tel:07052530185"> +234 705 253 0185</a>
                    </div>

                    <div className="topbar-text text-nowrap d-none d-md-inline-block">
                        <i className="czi-mail text-light"/>
                        <span className='text-white'>Email: info@vianhubs.com</span>
                    </div>

                    <div className="topbar-text text-nowrap d-none d-md-inline-block bg-light py-1 px-3">
                        <Link to={'/login'}>
                            <p className='text-green-dark mb-0'>
                                {userLoggedIn() ? 'Dashboard' : 'Login | Register'}
                            </p>
                        </Link>
                    </div>
                </div>
            </div>

            <Navbar bg="light" expand="lg" expanded={expanded}>
                <div className="container">
                    <Navbar.Brand href="/" className='mr-4'>
                        <img src={Logo} className="mr-auto" alt="" style={{height: '60px'}}/>
                    </Navbar.Brand>
                    <Navbar.Text className='d-lg-none'>
                        <div className="navbar-tool">
                            <CartIcon/>
                        </div>
                    </Navbar.Text>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"
                                   onClick={() => setExpanded(expanded ? false : "expanded")}/>
                    <Navbar.Collapse id="basic-navbar-nav" className="z-index-10">
                        <Nav className="mx-auto" onClick={() => setTimeout(() => {
                            setExpanded(false)
                        }, 150)}>
                            <NavLink to="/home" activeStyle={{fontWeight: 'bold', color: '#27423B'}}
                                     className='pt-3 pb-2 mx-3'>Home</NavLink>
                            <NavLink to="/direction" activeStyle={{fontWeight: 'bold', color: '#27423B'}}
                                     className='pt-3 pb-2 mx-3'>Direction</NavLink>
                            <NavLink to="/services" activeStyle={{fontWeight: 'bold', color: '#27423B'}}
                                     className='pt-3 pb-2 mx-3'>Services</NavLink>
                            <NavLink to="/about" activeStyle={{fontWeight: 'bold', color: '#27423B'}}
                                     className='pt-3 pb-2 mx-3'>About Us</NavLink>
                            <NavLink to="/contact" activeStyle={{fontWeight: 'bold', color: '#27423B'}}
                                     className='pt-3 pb-2 mx-3'>Contact</NavLink>
                        </Nav>

                        <Nav className='ml-auto d-none d-lg-inline-block'>
                            <div className="navbar-tool mx-4">
                                <CartIcon/>
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>

        </header>
    )
};

export default connect(mapStateToProps, mapDispatchToProps)(FrontHeader);
