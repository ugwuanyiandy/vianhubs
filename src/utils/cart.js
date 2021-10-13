import {stateKeys} from "../redux/actions";
import Endpoint from "./endpoint";
import {notify, reduxState, setReduxState, toast} from "./helpers";

export function getCart(key, defaultValue = null) {
    //Get cart details from redux (recommended)
    // let data = reduxState(stateKeys.CART)
    // //or
    // //Local storage
    const cartData = localStorage.getItem(stateKeys.CART);
    let data = cartData ? JSON.parse(cartData) : {};

    return key ?
        (typeof data[key] === 'undefined' ? defaultValue : data[key]) :
        data;
}

export function getCartAmount() {
    const cart = getCart();
    const cartKeys = Object.keys(cart);
    let total = 0;
    cartKeys.forEach((key, i) => total += cart[key].service.cost)
    return total;
}

export function getCartCount() {
    const cart = getCart();
    return Object.keys(cart).length;
}

export function getLocalCart() {
    const cartStore = localStorage.getItem(stateKeys.CART);
    return cartStore ? JSON.parse(cartStore) : {};
}

export function validateCart(cartItems) {
    if (!cartItems)
        cartItems = getCart();

    setTimeout(() => {
        Object.keys(cartItems).forEach((service_id, i) => {
            const item = cartItems[service_id];
            Endpoint.getShopService(item.service.slug)
                .then((xhr) => {
                    const service = xhr.data.data;
                    updateCart(item.service_id, {service: service})
                }).catch((xhr) => {
                updateCart(item.service_id, {valid: false})
            });
        })
    }, 1000);
}

function findWorkerInService(worker_id, service) {
    let worker = null;
    if (worker_id) {
        for (let i = 0; i < service.available_workers.length; i++) {
            if (service.available_workers[i].id == worker_id) {
                worker = service.available_workers[i];
                break;
            }
        }
    }

    return worker;
}

export function addToCart(service_id, start_at, worker_id, service, qty) {
    const cartStore = getCart();

    if (service_id && start_at && service) {
        cartStore[service_id] = {
            start_at: start_at,
            worker_id: worker_id,
            qty: qty ? qty : 1,
            valid: true,
            service: service,
            worker: findWorkerInService(worker_id, service)
        }

        setReduxState(cartStore, stateKeys.CART)
        localStorage.setItem(stateKeys.CART, JSON.stringify(cartStore))
    } else {
        console.log('Add to cart: A required parameter is missing');
        toast('Failed adding to cart')
    }
}

export function updateCart(service_id, data) {
    const cartStore = getCart();

    if (typeof cartStore[service_id] === 'object') {
        if (data.worker_id) {
            data.worker = findWorkerInService(data.worker_id, cartStore[service_id].service)
        }

        cartStore[service_id] = Object.assign({}, cartStore[service_id], data);

        setReduxState(cartStore, stateKeys.CART);
        localStorage.setItem(stateKeys.CART, JSON.stringify(cartStore))
    } else {
        console.log('Update cart failed: item not found');
    }
}

export function editCartProduct(service_id, data) {
    const cartStore = getCart();
    
    if (typeof cartStore[service_id] === 'object') {
        if (data.worker_id) {
            data.worker = findWorkerInService(data.worker_id, cartStore[service_id].service);
            if (data.worker) {
                cartStore[service_id].worker_id = data.worker_id;
                cartStore[service_id].worker = data.worker;
            }
        }
        
        if (data.start_time) {
            cartStore[service_id].start_at = data.start_time;
        }
        
        setReduxState(cartStore, stateKeys.CART);
        localStorage.setItem(stateKeys.CART, JSON.stringify(cartStore));
        
        let response = [];
        response['message'] = "Cart Updated Successfully";
        notify(response);
        
        return true;
    } else {
        notify("Cart Update Failed!!");
        return false;
    }
}

export function removeItemFromCart(service_id) {
    const cartStore = getCart();
    delete cartStore[service_id];

    setReduxState(cartStore, stateKeys.CART)
    localStorage.setItem(stateKeys.CART, JSON.stringify(cartStore))

    //Delete online
    // Endpoint.deleteItemFromCart(reference)
    //     .error(res => {
    //     })
}

export function clearCart() {
    localStorage.removeItem(stateKeys.CART);
    setReduxState([], stateKeys.CART)

    //Clear online
    // Endpoint.emptyCart(reference)
    //     .error(res => {
    //     })
}

export function printOrder(order, props) {
    //Display "printing receipt" dialog
    toast("printing order", 10000)

    //Send to printer
    // setReduxState(order, stateKeys.PRINT_ORDER)
    localStorage.setItem(stateKeys.PRINT_ORDER, JSON.stringify(order))

    window.open('/print/order', '_blank', 'width=303,height=500');

    //Remind them they can print from orders page if it fails

}

export function getPrintOrder() {
    // return reduxState(stateKeys.PRINT_ORDER)

    const data = localStorage.getItem(stateKeys.PRINT_ORDER);
    return data ? JSON.parse(data) : null;
}

export function clearPrintOrder() {
    // return setReduxState({},stateKeys.PRINT_ORDER)

    localStorage.removeItem(stateKeys.PRINT_ORDER);
}

