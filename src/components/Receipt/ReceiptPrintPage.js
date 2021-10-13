import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys} from "../../redux/actions";
import './ReceiptPrintPage.css'
import {currencyFormat, reduxState} from "../../utils/helpers";
import {clearPrintOrder, getPrintOrder} from "../../utils/cart";
import moment from "moment";
import {getUser} from "../../utils/auth";


const ReceiptPrintPage = props => {

    const orderData = getPrintOrder() ?? props.order;
    const order = Object.assign({}, {
        buyer_name: '', total: 0, sub_total: 0, discount: 0, tax: 0,
        buyer_phone: '', reference: '0000000001', sessions: [
            {service_name: 'Sample service', worker_name: 'Jane Doe', cost: 0}
        ]
    }, orderData);

    const launchPrintScreen = () => {
        window.document.close(); // necessary for IE >= 10
        window.focus(); // necessary for IE >= 10*/
        window.print();
        setTimeout(() => {
            clearPrintOrder();
            window.close()
        }, 100);
    }

    useEffect(() => {
        launchPrintScreen();
    }, []);

    return <>
        <div id="invoice-POS">
            <section>
                <center id="top">
                    <img className="logo" src={'/favicon.png'} alt={''}/>
                    <h2>Vian Hub Salon</h2>
                </center>
                <div id="mid">
                    <div className="info">
                        <center>
                            Shop 20, Cappador's place plaza, 134 Adetokunbo Ademola Cres, Wuse 2, Abuja<br/>
                            info@vianhubs.com<br/>
                            +234 704 841 3179, +234 705 253 0185
                        </center>
                    </div>
                </div>
            </section>
            <section className='info'>
                <center>
                    <b>Present this slip to the attendant(s) to get your service</b>
                </center>
            </section>
            <section id="table">
                <table>
                    <thead>
                    <tr className="tabletitle">
                        <td className="item">Service</td>
                        <td className="Rate">Subtotal</td>
                    </tr>
                    </thead>
                    <tbody>
                    {order.sessions.map((session, i) =>
                        <tr key={i} className="service">
                            <td className="tableitem">
                                <p className="itemtext">
                                    <b>{session.service_name}</b><br/>
                                    <>Attendant: {session.worker_name}</>
                                </p>
                            </td>
                            <td className="tableitem">
                                <p className="itemtext">
                                    {currencyFormat(session.cost)}</p>
                            </td>
                        </tr>
                    )}

                    </tbody>
                    <tfoot>
                    <tr className="tabletitle">
                        <td className="Rate">Discount</td>
                        <td className="payment">{currencyFormat(order.discount)}</td>
                    </tr>
                    <tr className="tabletitle">
                        <td className="Rate">VAT (7.5%)</td>
                        <td className="payment">{currencyFormat(order.tax)}</td>
                    </tr>

                    <tr className="tabletitle">
                        <td className="Rate">Total</td>
                        <td className="payment">{currencyFormat(order.total)}</td>
                    </tr>
                    </tfoot>
                </table>
            </section>

            <section id='printId'>
                <center className="info">
                    <span>Order No: {order.reference}</span>,{' '}
                    <span>Date: {moment(order.created_at).format("lll")}</span><br/>
                    <span>Cashier: {getUser('name')}</span>
                </center>
            </section>

            <div id="legalcopy">
                <p className="legal">
                    <strong>Thank you for coming!</strong><br/>
                    Please check out our current offers.
                </p>
            </div>
        </div>
    </>
}

export default connect(mapStateToProps, mapDispatchToProps)(ReceiptPrintPage)