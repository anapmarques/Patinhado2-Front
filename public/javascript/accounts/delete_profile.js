"use strict";
onload = () => {
    var _a;
    (_a = document.getElementById('delete-profile-form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', deleteProfile);
};
const deleteProfile = async (evento) => {
    evento.preventDefault();
    const checkbox = document.getElementById('confirm-delete');
    if (!checkbox || !checkbox.checked) {
        const errorDiv = document.getElementById('delete-error');
        if (errorDiv)
            errorDiv.textContent = 'Você precisa confirmar a exclusão.';
        return;
    }
    try {
        const response = await authFetch(backendAddress + 'api/profile/', {
            method: 'DELETE'
        });
        if (response.ok) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/';
        }
        else {
            const errorDiv = document.getElementById('delete-error');
            if (errorDiv)
                errorDiv.textContent = 'Erro ao excluir conta.';
        }
    }
    catch (_a) {
        const errorDiv = document.getElementById('delete-error');
        if (errorDiv)
            errorDiv.textContent = 'Erro de conexão com o servidor.';
    }
};
