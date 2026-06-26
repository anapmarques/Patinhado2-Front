"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll(".password-field");
    containers.forEach(container => {
        const objInput = container.querySelector('input[type="password"]');
        const objImgEye = container.querySelector(".toggle-password");
        const toggleArea = container.querySelector(".password-toggle");
        if (!objInput || !objImgEye || !toggleArea)
            return;
        const toggle = () => {
            if (objInput.type === "password") {
                objInput.type = "text";
                objImgEye.src = "../img/eye.svg";
            }
            else {
                objInput.type = "password";
                objImgEye.src = "../img/eye-off.svg";
            }
        };
        toggleArea.addEventListener("click", toggle);
    });
});
const decodeJWT = (token) => {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
};
const isAccessTokenExpired = (token) => {
    const decoded = decodeJWT(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
};
const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken)
        return;
    try {
        const response = await fetch(backendAddress + 'auth/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
        });
        if (response.ok) {
            const token = await response.json();
            localStorage.setItem('access_token', token.access);
        }
        else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    }
    catch (_a) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
};
const authFetch = async (url, options = {}) => {
    let accessToken = localStorage.getItem('access_token');
    if (accessToken && isAccessTokenExpired(accessToken)) {
        await refreshAccessToken();
        accessToken = localStorage.getItem('access_token');
    }
    if (accessToken) {
        options.headers = {
            ...(options.headers || {}),
            'Authorization': 'Bearer ' + accessToken
        };
    }
    return fetch(url, options);
};
