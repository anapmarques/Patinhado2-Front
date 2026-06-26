onload = () => {
    document.getElementById('delete-profile-form')?.addEventListener('submit', deleteProfile);
}

const deleteProfile = async (evento: Event) => {
    evento.preventDefault();
    const checkbox = document.getElementById('confirm-delete') as HTMLInputElement;
    if (!checkbox || !checkbox.checked) {
        const errorDiv = document.getElementById('delete-error');
        if (errorDiv) errorDiv.textContent = 'Você precisa confirmar a exclusão.';
        return;
    }

    try {
        const response = await authFetch(backendAddress + 'auth/profile/', {
            method: 'DELETE'
        });

        if (response.ok) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/';
        } else {
            const errorDiv = document.getElementById('delete-error');
            if (errorDiv) errorDiv.textContent = 'Erro ao excluir conta.';
        }
    } catch {
        const errorDiv = document.getElementById('delete-error');
        if (errorDiv) errorDiv.textContent = 'Erro de conexão com o servidor.';
    }
}
