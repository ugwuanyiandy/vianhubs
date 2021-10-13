import {stateKeys} from "../redux/actions";
import {setReduxState} from "./helpers";
import {workerType} from "./Identifiers";

const TOKEN_KEY = '__token';

export function userLoggedIn() {
    return !!getUserToken();
}

export function getActiveStore() {
    return sessionStorage.getItem(TOKEN_KEY) ? sessionStorage : localStorage;
}

export function getUserToken() {
    return getActiveStore().getItem(TOKEN_KEY)
}

export function loadUserInfo() {
    //Fetch user full details from server using token(recommended)
    //or
    //From local storage
    const data = getActiveStore().getItem(stateKeys.USER)
    const user = data ? JSON.parse(data) : null;

    //This should update redux
    setReduxState(user, stateKeys.USER)
}

export function getUser(key, defaultValue = null) {
    //Get user details from redux (recommended)
    // let data = reduxState(stateKeys.USER)
    // //or
    // //Local/Session storage
    const userData = getActiveStore().getItem(stateKeys.USER);
    let data = userData ? JSON.parse(userData) : null;

    if (!data || (key && typeof data[key] === 'undefined')) {
        return defaultValue
    }

    return key ? data[key] : data;
}

export function updateUserInfo(data) {
    const userData = getUser();
    let update = Object.assign({}, userData, data);

    getActiveStore().setItem(stateKeys.USER, JSON.stringify(update));
    setReduxState(update, stateKeys.USER)
}

export function loginUser(token, user, remember, redirect) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    if (user) {
        storage.setItem(stateKeys.USER, JSON.stringify(user));
        setReduxState(user, stateKeys.USER)
    }

    if (redirect) {
        const intended = rememberRoute();
        if (intended) {
            window.location = intended;
        } else if (user.worker_profile &&
            (user.worker_profile.type.key === workerType.owner ||
                user.worker_profile.type.key === workerType.admin)) {
            window.location = "/admin";
        } else if (user.worker_profile &&
            user.worker_profile.type.key === workerType.cashier) {
            window.location = "/cashier";
        } else if (user.worker_profile &&
            user.worker_profile.type.key === workerType.attendant) {
            window.location = "/attendant";
        } else {
            window.location = "/dashboard";
        }
    }

}

export function rememberRoute() {
    const key = '__intended';
    const old = sessionStorage.getItem(key);
    sessionStorage.setItem(key, window.location.pathname);

    return old;
}

export function logOutUser(redirect) {
    // getActiveStore().removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(stateKeys.USER);
    sessionStorage.removeItem(stateKeys.USER);

    window.location = redirect ? redirect : '/login';
}
