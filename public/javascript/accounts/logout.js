"use strict";
onload = () => {
    var _a;
    (_a = document.getElementById('logout-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', handleLogout);
};
const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/';
};
