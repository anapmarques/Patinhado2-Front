"use strict";
onload = () => {
    var _a;
    (_a = document.getElementById('password-reset-form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', resetPassword);
};
const resetPassword = async (evento) => {
    evento.preventDefault();
    const email = document.getElementById('email').value;
    try {
        const response = await fetch(backendAddress + 'api/auth/password/reset/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const errorDiv = document.getElementById('reset-error');
        const successDiv = document.getElementById('reset-success');
        if (response.ok) {
            if (successDiv)
                successDiv.textContent = 'Se existir uma conta com este email, você receberá instruções para redefinir sua senha.';
            if (errorDiv)
                errorDiv.textContent = '';
        }
        else {
            const data = await response.json();
            if (errorDiv) {
                const messages = Object.values(data).reduce((acc, val) => acc.concat(val), []).join('. ');
                errorDiv.textContent = messages;
            }
            if (successDiv)
                successDiv.textContent = '';
        }
    }
    catch (_a) {
        const errorDiv = document.getElementById('reset-error');
        if (errorDiv)
            errorDiv.textContent = 'Erro de conexão com o servidor.';
    }
};
