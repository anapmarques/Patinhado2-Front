"use strict";
onload = () => {
    var _a;
    (_a = document.getElementById('register-form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', register);
};
const register = async (evento) => {
    evento.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    try {
        const response = await fetch(backendAddress + 'accounts/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, password2, first_name, last_name })
        });
        const errorDiv = document.getElementById('register-error');
        if (response.ok) {
            window.location.href = 'login.html';
        }
        else {
            const data = await response.json();
            if (errorDiv) {
                const messages = Object.values(data).reduce((acc, val) => acc.concat(val), []).join('. ');
                errorDiv.textContent = messages;
            }
        }
    }
    catch (_a) {
        const errorDiv = document.getElementById('register-error');
        if (errorDiv)
            errorDiv.textContent = 'Erro de conexão com o servidor.';
    }
};
