onload = () => {
    document.getElementById('register-form')?.addEventListener('submit', register);
}

const register = async (evento: Event) => {
    evento.preventDefault();
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const password2 = (document.getElementById('password2') as HTMLInputElement).value;
    const first_name = (document.getElementById('first_name') as HTMLInputElement).value;
    const last_name = (document.getElementById('last_name') as HTMLInputElement).value;

    try {
        const response = await fetch(backendAddress + 'accounts/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, password2, first_name, last_name })
        });

        const errorDiv = document.getElementById('register-error');
        if (response.ok) {
            window.location.href = 'login.html';
        } else {
            const data = await response.json();
            if (errorDiv) {
                const messages = Object.values(data as Record<string, string[]>).reduce((acc, val) => acc.concat(val), []).join('. ');
                errorDiv.textContent = messages;
            }
        }
    } catch {
        const errorDiv = document.getElementById('register-error');
        if (errorDiv) errorDiv.textContent = 'Erro de conexão com o servidor.';
    }
}
