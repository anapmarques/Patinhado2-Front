"use strict";
onload = () => {
    var _a;
    (_a = document.getElementById('login-form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', login);
};
const login = async (evento) => {
    evento.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch(backendAddress + 'auth/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            window.location.href = '/';
        }
        else {
            const errorDiv = document.getElementById('login-error');
            if (errorDiv)
                errorDiv.textContent = 'Usuário ou senha inválidos.';
        }
    }
    catch (_a) {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv)
            errorDiv.textContent = 'Erro de conexão com o servidor.';
    }
};
