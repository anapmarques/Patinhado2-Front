onload = () => {
    document.getElementById('login-form')?.addEventListener('submit', login);
}

const login = async (evento: Event) => {
    evento.preventDefault();
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    try {
        const response = await fetch(backendAddress + 'api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data: JwtResposta = await response.json();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            window.location.href = '/';
        } else {
            const errorDiv = document.getElementById('login-error');
            if (errorDiv) errorDiv.textContent = 'Usuário ou senha inválidos.';
        }
    } catch {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) errorDiv.textContent = 'Erro de conexão com o servidor.';
    }
}
