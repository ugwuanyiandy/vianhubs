import axios from 'axios'
import {notify, objectToHTTPQuery} from "./helpers";
import {getUserToken, logOutUser, rememberRoute} from "./auth";


let accountId = 'vianhubs';
const Endpoint = {
    init: () => {
        // accountId = process.env.REACT_APP_ACCOUNT_ID;
        let token = getUserToken();
        if (token)
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT;
        // Intercept 401 HTTP Error code in API
        axios.interceptors.response.use(response => response, (error) => {
            if (!error.response) {
                //No response
                notify("Seems like you're offline, check internet connection")
            } else if (error.response && error.response.status === 401 && error.response.config.url !== '/login') {
                rememberRoute();
                logOutUser();
            }

            return Promise.reject(error.response);
        });
    },


    login: (data) => {
        return axios.post(`/shop/${accountId}/login`, data)
    },
    register: (data) => {
        return axios.post(`/shop/${accountId}/register`, data)
    },
    getShopServices: (data) => {
        let query = objectToHTTPQuery(data);
        return axios.get(`/shop/${accountId}/services` + query)
    },
    getAllShopServices: (data) => {
        let query = objectToHTTPQuery(data);
        return axios.get(`/shop/${accountId}/s/services` + query)
    },
    getShopService: (slug) => {
        return axios.get(`/shop/${accountId}/services/${slug}`)
    },
    getOrderByReference: (data) => {
        return axios.get(`/shop/${accountId}/orders/` + data)
    },
    getCart: () => {
        return axios.get(`/shop/${accountId}/cart`)
    },
    addToCart: (data) => {
        return axios.post(`/shop/${accountId}/cart`, data)
    },
    deleteItemFromCart: (data) => {
        return axios.delete(`/shop/${accountId}/cart/` + data)
    },
    emptyCart: () => {
        return axios.delete(`/shop/${accountId}/cart`)
    },
    estimateCoupon: (coupon, amount) => {
        let query = objectToHTTPQuery({coupon: coupon, amount: amount});
        return axios.get(`/shop/${accountId}/coupon/estimate` + query)
    },
    getUsersCarts: () => {
        return axios.get(`/shop/${accountId}/s/cart/users`)
    },
    getServicesInCarts: () => {
        return axios.get(`/shop/${accountId}/s/cart/services`)
    },
    getUsersCartSummary: () => {
        return axios.get(`/shop/${accountId}/s/cart/summary`)
    },
    getUserProfile: () => {
        return axios.get(`/shop/${accountId}/user/`)
    },
    updateUserProfile: (data) => {
        return axios.patch(`/shop/${accountId}/user`, data)
    },
    getAttendantSchedule: (data) => {
        return axios.get(`/shop/${accountId}/attendants/` + data + `/schedule`)
    },
    getCustomerOrders: (data) => {
        return axios.get(`/shop/${accountId}/orders`, data)
    },
    getCustomerSessions: (data) => {
        let query = objectToHTTPQuery(data);
        return axios.get(`/shop/${accountId}/sessions` + query)
    },
    cashierCheckout: (data) => {
        return axios.post(`/shop/${accountId}/s/checkout`, data)
    },
    cashierCheckoutFromServer: (data) => {
        return axios.post(`/shop/${accountId}/s/cart/checkout`, data)
    },
    customerCheckout: (data) => {
        return axios.post(`/shop/${accountId}/checkout`, data)
    },
    customerCheckoutFromServer: (data) => {
        return axios.post(`/shop/${accountId}/cart/checkout`, data)
    },
    verifyPayment: (reference, method) => {
        return axios.post(`/shop/${accountId}/payment/verify/${reference}/${method}`)
    },
    getShopDetails: () => {
        return axios.get(`/shop/${accountId}`)
    },
    getShopOrders: () => {
        return axios.get(`/shop/${accountId}/sessions`)
    },
    getShopAttendants: () => {
        return axios.get(`/shop/${accountId}/attendants`)
    },
    getAttendantAppointments: (id, data) => {
        let query = objectToHTTPQuery(data);
        return axios.get(`/shop/${accountId}/s/sessions/worker/` + id + query)
    },
    getAllAppointments: () => {
        return axios.get(`/shop/${accountId}/s/sessions`)
    },
    getAllOrders: () => {
        return axios.get(`/shop/${accountId}/s/orders`)
    },
    getOrderAsUser: (reference) => {
        return axios.get(`/shop/${accountId}/orders/${reference}`)
    },
    getShopAppointments: () => {
        return axios.get(`/shop/${accountId}/sessions/`)
    },
    getShopAttendantAsStaff: (data) => {
        return axios.get(`/shop/${accountId}/s/workers/` + data)
    },
    getShopAttendantAsCustomer: (data) => {
        return axios.get(`/shop/${accountId}/attendants/` + data)
    },
    getCartTotal: () => {
        return axios.get(`/shop/${accountId}/cart/count`)
    },
    createCustomerReview: (data) => {
        return axios.post(`/shop/${accountId}/reviews`, data)
    },
    getShopWorkers: () => {
        return axios.get(`/shop/${accountId}/s/workers`)
    },
    getWorkerTypes: () => {
        return axios.get(`/shop/${accountId}/s/workers/types`)
    },
    getCustomerAppointments: () => {
        return axios.get(`/shop/${accountId}/orders`)
    },
    createShopWorker: (data) => {
        return axios.post(`shop/${accountId}/s/workers`, data)
    },
    createServiceWorker: (data, slug) => {
        return axios.post(`/shop/${accountId}/s/services/${slug}/worker`, data)
    },
    editServiceWorker: (data, slug, worker_id) => {
        return axios.patch(`/shop/${accountId}/s/services/${slug}/worker/${worker_id}`, data)
    },
    deleteServiceWorker: (slug, worker_id) => {
        return axios.delete(`/shop/${accountId}/s/services/${slug}/worker/${worker_id}`)
    },
    updateServiceWorker: (data, slug, worker_id) => {
        return axios.patch(`/shop/${accountId}/s/services/${slug}/worker/${worker_id}`, data)
    },
    createCustomer: (data) => {
        return axios.post(`/shop/${accountId}/s/customers`, data)
    },
    getShopCustomers: (data) => {
        return axios.get(`/shop/${accountId}/s/customers`, data)
    },
    getUpcomingAppointmentsAdmin: () => {
        return axios.get(`/shop/${accountId}/s/sessions`)
    },
    getArticles: (data) => {
        let query = objectToHTTPQuery(data);
        return axios.get("/articles" + query);
    },
    getArticle: (slug, data) => {
        let query = objectToHTTPQuery(data);
        return axios.get("/articles/" + slug + query);
    },
    deleteShopWorker: (worker_id) => {
        return axios.delete(`/shop/${accountId}/s/workers/${worker_id}`)
    },
    createShopService: (data) => {
        return axios.post(`/shop/${accountId}/s/services`, data)
    },
    editShopService: (data, service_slug) => {
        return axios.patch(`/shop/${accountId}/s/services/${service_slug}`, data)
    },
    deleteShopService: (service_slug) => {
        return axios.delete(`/shop/${accountId}/s/services/${service_slug}`)
    },
	
    sendContactMail: (data) => {
        return axios.post(`/shop/${accountId}/sendmail`, data)
    },
    
	searchOrders: (data) => {
        let query = objectToHTTPQuery(data);
    	return axios.get(`/shop/${accountId}/s/orders` + query)
	},
 
	searchServices: (data) => {
        let query = objectToHTTPQuery(data);
    	return axios.get(`/shop/${accountId}/s/services` + query)
	},
    
    getAllShopCoupons: () => {
        return axios.get(`/shop/${accountId}/s/coupons`)
    },
    
    createShopCoupon: (data) => {
        return axios.post(`/shop/${accountId}/s/coupons`, data)
    },

    editShopCoupon: (data, coupon_code) => {
        return axios.patch(`/shop/${accountId}/s/coupons/${coupon_code}`, data)
    },

    deleteShopCoupon: (coupon_code) => {
        return axios.delete(`/shop/${accountId}/s/coupons/${coupon_code}`)
    },
    
    approvePayment: (reference) => {
        return axios.post(`/shop/${accountId}/s/payment/approve/${reference}`)
    },

    getAttendantSessions: (data, filter) => {
        return axios.get(`shop/${accountId}/s/sessions/worker/${data}?filter=${filter}`)
    },
    getAttendantSessionsDefault: (data) => {
        return axios.get(`shop/${accountId}/s/sessions/worker/${data}`)
    },

    editShopWorker: (workerId, data) => {
        return axios.patch(`/shop/${accountId}/s/workers/${workerId}`, data)
    },
    getShopEarnings: (start_date, end_date) => {
        let query = objectToHTTPQuery({start_date: start_date, end_date: end_date});
        return axios.get(`shop/${accountId}/s/earnings` + query)
    },
    getShopEarningsLazy: () => {
        return axios.get(`shop/${accountId}/s/earnings`)
    },
    getShopOpeningHours: () => {
        return axios.get(`shop/${accountId}/opening-hours`)
    },
    updateShopOpeningHours: (data) => {
        return axios.patch(`shop/${accountId}/s/opening-hours/${data.weekday}`, data)
    },
    deleteShopOpeningHours: (weekday) => {
        return axios.delete(`shop/${accountId}/s/opening-hours/${weekday}`)
    },
    getPaymentMethods: () => {
        return axios.get(`shop/${accountId}/payment/methods`)
    },
    getAllPaymentMethods: () => {
        return axios.get(`shop/${accountId}/s/payment/methods`)
    },
    getAllPaymentSettings: () => {
        return axios.get(`shop/${accountId}/s/payment/methods/settings`)
    },
    updateShopPaymentSettings: (method, data) => {
        return axios.patch(`shop/${accountId}/s/payment/methods/settings/${method}`, data)
    },
    updateShopCustomer: (data, customer_id) => {
        return axios.patch(`/shop/${accountId}/s/customers/${customer_id}`, data)
    },

    deleteShopCustomer: (customer_id) => {
        return axios.delete(`/shop/${accountId}/s/customers/${customer_id}`)
    },
    getCustomerReviews: () => {
        return axios.get(`shop/${accountId}/reviews`)
    },
    getShopCategories: () => {
        return axios.get(`shop/${accountId}/categories`)
    },
    createShopCategory: (data) => {
        return axios.post(`/shop/${accountId}/s/categories`, data)
    },
    editShopCategory: (data, category_slug) => {
        return axios.patch(`/shop/${accountId}/s/categories/${category_slug}`, data)
    },
    deleteShopCategory: (category_slug) => {
        return axios.delete(`/shop/${accountId}/s/categories/${category_slug}`)
    },

    getAttendantEarningsLazy: (worker_id) => {
        return axios.get(`/shop/${accountId}/s/workers/${worker_id}/earnings`)
    },
    getAttendantEarnings: (start_date, end_date, worker_id) => {
        let query = objectToHTTPQuery({start_date: start_date, end_date: end_date});
        return axios.get(`/shop/${accountId}/s/workers/${worker_id}/earnings` + query)
    },
    getStatForAdminDashboard: () => {
        return axios.get(`shop/${accountId}/s/stat/admin-dashboard`)
    },

    getSignedUrl: (service_id) => {
        return axios.get(`/shop/${accountId}/s/signed-url/service/${service_id}`)
    },
    
    getServiceImgSignedUrl: (data, service_id) => {
        return axios.post(`/shop/${accountId}/s/signed-url/service/${service_id}`, data)
    },
    
    verifys3upload: (file_id) => {
      return axios.patch(`/shop/${accountId}/verify-file/${file_id}`)
    },
    postUploadImgToS3: (url, data) => {
        return axios.post(url, data)
    }
};

export default Endpoint