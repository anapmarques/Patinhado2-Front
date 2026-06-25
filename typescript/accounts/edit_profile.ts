onload = async () => {
    try {
        const response = await authFetch(backendAddress + 'api/profile/dashboard/');
        if (response.ok) {
            const data = await response.json();
            (document.getElementById('username') as HTMLInputElement).value = data.username || '';
            (document.getElementById('email') as HTMLInputElement).value = data.email || '';
            (document.getElementById('first_name') as HTMLInputElement).value = data.first_name || '';
            (document.getElementById('last_name') as HTMLInputElement).value = data.last_name || '';
            (document.getElementById('telefone') as HTMLInputElement).value = data.telefone || '';
            (document.getElementById('endereco') as HTMLInputElement).value = data.endereco || '';
        } else {
            window.location.href = 'login.html';
        }
    } catch {
        window.location.href = 'login.html';
    }

    document.getElementById('edit-profile-form')?.addEventListener('submit', updateProfile);
}

const updateProfile = async (evento: Event) => {
    evento.preventDefault();
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const first_name = (document.getElementById('first_name') as HTMLInputElement).value;
    const last_name = (document.getElementById('last_name') as HTMLInputElement).value;
    const telefone = (document.getElementById('telefone') as HTMLInputElement).value;
    const endereco = (document.getElementById('endereco') as HTMLInputElement).value;

    try {
        const response = await authFetch(backendAddress + 'api/profile/', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, first_name, last_name, telefone, endereco })
        });

        const errorDiv = document.getElementById('edit-error');
        if (response.ok) {
            window.location.href = 'profile.html';
        } else {
            const data = await response.json();
            if (errorDiv) {
                const messages = Object.values(data as Record<string, string[]>).reduce((acc, val) => acc.concat(val), []).join('. ');
                errorDiv.textContent = messages;
            }
        }
    } catch {
        const errorDiv = document.getElementById('edit-error');
        if (errorDiv) errorDiv.textContent = 'Erro de conexão com o servidor.';
    }
}
