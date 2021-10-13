import React, {useState} from 'react'
import {Link, NavLink} from "react-router-dom";
import Logo from "../assets/images/logo/vhub.png";
import {getUser, logOutUser} from "../utils/auth";
import {Nav, Navbar} from "react-bootstrap";
import CartIcon from "../components/Cart/CartIcon";


const AdminHeader = (props) => {

    const [expanded, setExpanded] = useState(false);
    const user = getUser();

    return <>

        <header className="box-shadow-sm d-lg-none d-md-inline-block fixed-top">

            <Navbar bg="light" expand="lg" expanded={expanded}>
                <div className="container">
                    <Navbar.Brand href="/" className='mr-6rem'>
                        <img src={Logo} className="mr-auto" alt="" style={{height: '60px'}}/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"
                                   onClick={() => setExpanded(expanded ? false : "expanded")}/>
                    <Navbar.Collapse id="basic-navbar-nav" className="z-index-10"
                                     style={{overflowY: 'scroll', maxHeight: '400px'}}>
                        <Nav className="mx-auto" onClick={() => setTimeout(() => {
                            setExpanded(false)
                        }, 150)}>
                            <NavLink to="/admin/home" className='pt-2 pb-1 mx-3'>
                                <i className="czi-home mr-2"/> Dashboard
                            </NavLink>

                            <NavLink to="/admin/ManageShopServices" className='pt-2 pb-1  mx-3'>
                                <i className="czi-document mr-2"/> Services
                            </NavLink>

                            <NavLink to="/admin/ManageShopWorkers" className='pt-2 pb-1  mx-3'>
                                <i className="czi-user mr-2"/> Workers
                            </NavLink>

                            <NavLink to="/admin/ManageShopCustomers" className='pt-2 pb-1  mx-3'>
                                <i className="czi-user-circle mr-2"/> Customers
                            </NavLink>

                            {/*<NavLink to="/admin/ShopCategories" className='pt-2 pb-1  mx-3'>*/}
                            {/*    <i className="czi-view-grid mr-2"/> Categories*/}
                            {/*</NavLink>*/}

                            <NavLink to="/admin/createOrder" className='pt-2 pb-1  mx-3'>
                                <i className="czi-edit-alt mr-2"/> Create Order
                            </NavLink>

                            <NavLink to="/admin/ManageOrders" className='pt-2 pb-1  mx-3'>
                                <i className="czi-gift mr-2"/> Orders
                            </NavLink>

                            <NavLink to="/admin/ManageAppointments" className='pt-2 pb-1  mx-3'>
                                <i className="czi-book mr-2"/> Appointments
                            </NavLink>

                            <NavLink to="/admin/ShopEarnings" className='pt-2 pb-1  mx-3'>
                                <i className="czi-wallet mr-2"/> Earnings
                            </NavLink>

                            <NavLink to="/admin/ShopEarnings" className='pt-2 pb-1  mx-3'>
                                <i className="czi-star mr-2"/> Reviews
                            </NavLink>

                            <NavLink to="/admin/ShopSettings" className='pt-2 pb-1  mx-3'>
                                <i className="czi-settings mr-2"/> Settings
                            </NavLink>

                            <NavLink to="/admin/CartItems" className='pt-2 pb-1  mx-3'>
                                <i className="czi-cart mr-2"/> Customer Cart
                            </NavLink>

                            <NavLink to="/" className='pt-2 pb-1  mx-3' onClick={logOutUser}>
                                <i className="czi-sign-out mr-2"/> Logout
                            </NavLink>

                            <br/>
                            <br/>

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
            <div className="navbar-tool mx-4">
                <CartIcon cartPage={'/admin/Checkout'}/>
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
                            <NavLink to={'/admin/home'}>
                                <li className="widget-list-item">
                                    <p className="widget-list-link"><i className="czi-home mr-2"/> Dashboard</p>
                                </li>
                            </NavLink>

                            <NavLink to={'/admin/ManageOrders'}>
                                <li className="widget-list-item">
                                    <p className="widget-list-link"><i className="czi-gift mr-2"/> Orders</p>
                                </li>
                            </NavLink>

                            <NavLink to={'/admin/createOrder'}>
                                <li className="widget-list-item">
                                    <p className="widget-list-link"><i className="czi-edit-alt mr-2"/> Create
                                        Order</p>
                                </li>
                            </NavLink>

                            <NavLink to={'/admin/ManageAppointments'}>
                                <li className="widget-list-item">
                                    <p className="widget-list-link"><i className="czi-book mr-2"/> Appointments
                                    </p>
                                </li>
                            </NavLink>

                            <NavLink to={'/admin/ManageShopCustomers'}>
                                <li className="widget-list-item">
                                    <p className="widget-list-link"><i className="czi-user mr-2"/> Customers</p>
                                </li>
                            </NavLink>

                            <NavLink to={'/admin/ManageShopServices'}>
                                <li className="widget-list-item">
                                    <p className="widget-list-link"><i className="czi-time mr-2"/> Services</p>
                                </li>
                            </NavLink>

                            <NavLink to={'/admin/ManageShopCoupons'}>
                                <li className="widget-list-item">
                                    <p className="widget-list-link"><i className="czi-tag mr-2"/> Coupons</p>
                                </li>
                            </NavLink>

                            <NavLink to={'/admin/ManageShopWorkers'}>
                                <li className="widget-list-item">
                                    <p className="widget-list-link"><i
                                        className="czi-user-circle mr-2"/> Workers</p>
                                </li>
                            </NavLink>

                            <NavLink to={'/admin/ShopEarnings'}>
                                <li className="widget-list-item">
                                    <p className="widget-list-link"><i className="czi-dollar mr-2"/> Earnings
                                    </p>
                                </li>
                            </NavLink>

                            {/*<NavLink to={'/admin/ShopCategories'}>*/}
                            {/*    <li className="widget-list-item">*/}
                            {/*        <p className="widget-list-link"><i*/}
                            {/*            className="czi-view-grid mr-2"/> Categories</p>*/}
                            {/*    </li>*/}
                            {/*</NavLink>*/}

                            <NavLink to={'/admin/CustomerReviews'}>
                                <li className="widget-list-item">
                                    <p className="widget-list-link"><i className="czi-mail mr-2"/> Customer
                                        Reviews</p>
                                </li>
                            </NavLink>
                            <NavLink to={'/admin/ShopSettings'}>
                                <li className="widget-list-item">
                                    <p className="widget-list-link"><i className="czi-settings mr-2"/> Settings
                                    </p>
                                </li>
                            </NavLink>
                            <NavLink to={'/admin/CartItems'}>
                                <li className="widget-list-item">
                                    <p className="widget-list-link"><i className="czi-cart mr-2"/> Customer Cart
                                    </p>
                                </li>
                            </NavLink>
                            <br/>
                            <br/>

                            <Link to={'#'} onClick={() => logOutUser()}>
                                <li className="widget-list-item">
                                    <p className="widget-list-link"><i className="czi-sign-out mr-2"/> Logout
                                    </p>
                                </li>
                            </Link>
                        </ul>
                    </div>
                </div>
            </div>
        </aside>
    </>
}

export default AdminHeader
