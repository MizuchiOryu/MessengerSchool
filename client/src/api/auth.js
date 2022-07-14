import axios from 'axios'


export function register(email,password,lastName,firstName) {
    const body = { email,password,lastName,firstName};
    const headers = {
        'Content-Type': 'application/json',
    };
    return axios.post(import.meta.env.VITE_API_URL + '/register', body, { headers })
}

export function login(email,password) {
    const body = { email,password };
    const headers = {
        'Content-Type': 'application/json',
    };
    return axios.post(import.meta.env.VITE_API_URL + '/login', body, { headers })
}


export function verify(token) {
    const headers = {
        'Content-Type': 'application/json',
    };
    let url = `${import.meta.env.VITE_API_URL}/verify?token=${token}`
    return axios.get(url, { headers })
}


export function requestResetPassword(email) {
    const body = { email };

    const headers = {
        'Content-Type': 'application/json',
    };
    let url = `${import.meta.env.VITE_API_URL}/reset-password`
    return axios.post(url, body,{ headers })
}

export function verifyResetPassword(token) {

    const headers = {
        'Content-Type': 'application/json',
    };
    let url = `${import.meta.env.VITE_API_URL}/reset-password?token=` + token
    return axios.get(url,{ headers })
}

export function resetPassword(token,password) {
    const body = { token,password };

    const headers = {
        'Content-Type': 'application/json',
    };
    let url = `${import.meta.env.VITE_API_URL}/reset-password`
    return axios.patch(url, body,{ headers })
}