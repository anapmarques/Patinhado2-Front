onload = () => {
    document.getElementById('password-reset-form')?.addEventListener('submit', resetPassword);
}

const resetPassword = async (evento: Event) => {
    evento.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;

    try {
        const response = await fetch(backendAddress + 'api/auth/password/reset/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const errorDiv = document.getElementById('reset-error');
        const successDiv = document.getElementById('reset-success');
        if (response.ok) {
            if (successDiv) successDiv.textContent = 'Se existir uma conta com este email, você receberá instruções para redefinir sua senha.';
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
        const errorDiv = document.getElementById('reset-error');
        if (errorDiv) errorDiv.textContent = 'Erro de conexão com o servidor.';
    }
}
