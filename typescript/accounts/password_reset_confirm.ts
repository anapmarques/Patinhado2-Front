onload = () => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get('uid');
    const token = params.get('token');

    if (!uid || !token) {
        const errorDiv = document.getElementById('reset-confirm-error');
        if (errorDiv) errorDiv.textContent = 'Link de recuperação inválido.';
        return;
    }

    (document.getElementById('uid') as HTMLInputElement).value = uid;
    (document.getElementById('token') as HTMLInputElement).value = token;

    document.getElementById('reset-confirm-form')?.addEventListener('submit', confirmReset);
}

const confirmReset = async (evento: Event) => {
    evento.preventDefault();
    const uid = (document.getElementById('uid') as HTMLInputElement).value;
    const token = (document.getElementById('token') as HTMLInputElement).value;
    const new_password = (document.getElementById('new_password') as HTMLInputElement).value;
    const new_password2 = (document.getElementById('new_password2') as HTMLInputElement).value;

    try {
        const response = await fetch(backendAddress + 'auth/password/reset/confirm/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid, token, new_password, new_password2 })
        });

        const errorDiv = document.getElementById('reset-confirm-error');
        const successDiv = document.getElementById('reset-confirm-success');
        if (response.ok) {
            if (successDiv) successDiv.innerHTML = 'Senha redefinida com sucesso. <a href="login.html" style="color:var(--accent);">Faça login</a>.';
            if (errorDiv) errorDiv.textContent = '';
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setTimeout(() => {
                window.top!.location.href = '/login.html';
            }, 1500);
        } else {
            const data = await response.json();
            if (errorDiv) {
                const messages = Object.values(data as Record<string, string[]>).reduce((acc, val) => acc.concat(val), []).join('. ');
                errorDiv.textContent = messages;
            }
            if (successDiv) successDiv.textContent = '';
        }
    } catch {
        const errorDiv = document.getElementById('reset-confirm-error');
        if (errorDiv) errorDiv.textContent = 'Erro de conexão com o servidor.';
    }
}
