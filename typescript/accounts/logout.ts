onload = () => {
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
}

const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/';
}
