"use strict";
onload = async () => {
    var _a;
    try {
        const response = await authFetch(backendAddress + 'api/profile/dashboard/');
        if (response.ok) {
            const data = await response.json();
            document.getElementById('username').value = data.username || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('first_name').value = data.first_name || '';
            document.getElementById('last_name').value = data.last_name || '';
            document.getElementById('telefone').value = data.telefone || '';
            document.getElementById('endereco').value = data.endereco || '';
        }
        else {
            window.location.href = 'login.html';
        }
    }
    catch (_b) {
        window.location.href = 'login.html';
    }
    (_a = document.getElementById('edit-profile-form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', updateProfile);
};
const updateProfile = async (evento) => {
    evento.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;
    try {
        const response = await authFetch(backendAddress + 'api/profile/', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, first_name, last_name, telefone, endereco })
        });
        const errorDiv = document.getElementById('edit-error');
        if (response.ok) {
            window.location.href = 'profile.html';
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
        const errorDiv = document.getElementById('edit-error');
        if (errorDiv)
            errorDiv.textContent = 'Erro de conexão com o servidor.';
    }
};
