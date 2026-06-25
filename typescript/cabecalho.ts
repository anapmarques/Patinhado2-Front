addEventListener('load', async () => {
    document.getElementById('logout')?.addEventListener('click', logout);
    identifica();
});

const logout = (evento: MouseEvent) => {
    evento.preventDefault();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/';
}

const identifica = async () => {
    const spanElement = document.getElementById('identificacao') as HTMLSpanElement;

    const response = await authFetch(backendAddress + 'accounts/whoami/', {
        method: 'GET'
    });

    let objDivlogged = (document.getElementById('logged') as HTMLDivElement);
    let objDivunlogged = (document.getElementById('unlogged') as HTMLDivElement);
    if (response.ok) {
        const data = await response.json();
        objDivlogged.classList.remove('invisivel');
        objDivlogged.classList.add('visivel');
        objDivunlogged.classList.remove('visivel');
        objDivunlogged.classList.add('invisivel');
        spanElement.textContent = data.username ?? 'visitante';
    } else {
        objDivlogged.classList.remove('visivel');
        objDivlogged.classList.add('invisivel');
        objDivunlogged.classList.remove('invisivel');
        objDivunlogged.classList.add('visivel');
        spanElement.textContent = 'visitante';
    }
}
