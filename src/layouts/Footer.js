import React from 'react'

const Footer = (props) => {
    return (
        <footer>
            <div className="bg-pink">
                <section className="container py-5">
                    <div className="row">
                        <div className="col-md-4 ">
                            <p className="font-weight-bold text-dark">Address:</p>

                            <p className="font-weight-light text-dark">
                                VIAN HUB SALON, <br/>
                                Shop 20, Cappador's place plaza, 134 Adetokunbo Ademola Cres, Wuse 2<br/>
                                Abuja, Nigeria
                            </p>
                        </div>

                        <div className="col-md-4">
                            <p className="font-weight-bold text-dark">Contact Info:</p>

                            <div className="font-weight-light text-dark">
                                <div className='mb-2'>
                                    <i className="czi-phone mr-1"/> Phone<br/>
                                    +234 704 841 3179, +234 705 253 0185
                                </div>
                                <div className='mb-2'>
                                    <i className="czi-mail mr-1"/> Email<br/>
                                    info@vianhubs.com
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 ">
                            <p className="font-weight-bold text-dark">Socials:</p>

                            <p className="font-weight-light text-dark">
                                <a target='_blank' rel="noopener noreferrer"
                                   href='https://facebook.com/vianhubsalon'>
                                    <i className="czi-facebook mr-2"/> Facebook</a>
                            </p>
                            <p className="font-weight-light text-dark">
                                <a target='_blank' rel="noopener noreferrer"
                                   href='https://twitter.com/VianHub'>
                                    <i className="czi-twitter mr-2"/> Twitter</a>
                            </p>
                            <p className="font-weight-light text-dark">
                                <a target='_blank' rel="noopener noreferrer"
                                   href=' https://www.instagram.com/vianhubsalon/'>
                                    <i className="czi-instagram mr-2"/> Instagram</a>
                            </p>
                            <p className="font-weight-light text-dark">
                                <a target='_blank' rel="noopener noreferrer"
                                   href='https://www.linkedin.com/company/vian-hub/'>
                                    <i className="czi-linkedin mr-2"/> LinkedIn</a>
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <div className="bg-green-dark">
                <section className="container py-5">
                    <div className="row">
                        <div className="col-md-3">
                            <p className="font-weight-bold">Quality Service Assurance</p>
                        </div>

                        <div className="col-md-3">
                            <p className="font-weight-bold">24/7 Customer Support</p>
                        </div>

                        <div className="col-md-3">
                            <p className="font-weight-bold">Secure Online Payment</p>
                        </div>

                        <div className="col-md-3">
                            <p className="font-weight-bold">Convenience</p>
                        </div>
                    </div>

                    <hr className='border-light'/>

                    <h3 className='font-weight-bold mt-5'>Vian Hub Salon</h3>
                    {/*<div className="d-flex">*/}
                    {/*    <p className="font-weight-light mr-3">Outlets</p>*/}
                    {/*    <p className="font-weight-light mr-3">Affiliates</p>*/}
                    {/*    <p className="font-weight-light mr-3">Support</p>*/}
                    {/*    <p className="font-weight-light mr-3">Map</p>*/}
                    {/*</div>*/}
                </section>
            </div>
        </footer>
    )
};

export default Footer
