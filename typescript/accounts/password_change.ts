onload = () => {
    document.getElementById('password-change-form')?.addEventListener('submit', changePassword);
}

const changePassword = async (evento: Event) => {
    evento.preventDefault();
    const old_password = (document.getElementById('old_password') as HTMLInputElement).value;
    const new_password = (document.getElementById('new_password') as HTMLInputElement).value;
    const new_password2 = (document.getElementById('new_password2') as HTMLInputElement).value;

    try {
        const response = await authFetch(backendAddress + 'api/auth/password/change/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ old_password, new_password, new_password2 })
        });

        const errorDiv = document.getElementById('password-change-error');
        const successDiv = document.getElementById('password-change-success');
        if (response.ok) {
            if (successDiv) successDiv.textContent = 'Senha alterada com sucesso.';
            if (errorDiv) errorDiv.textContent = '';
        } else {
            const data = await response.json();
            if (errorDiv) {
                const messages = Object.values(data as Record<string, string[]>).reduce((acc, val) => acc.concat(val), []).join('. ');
                errorDiv.textContent = messages;
            }
            if (successDiv) successDiv.textContent = '';
        }
    } catch {
        const errorDiv = document.getElementById('password-change-error');
        if (errorDiv) errorDiv.textContent = 'Erro de conexão com o servidor.';
    }
}
