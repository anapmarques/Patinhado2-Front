document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll<HTMLDivElement>(".password-field");
    containers.forEach(container => {
        const objInput = container.querySelector<HTMLInputElement>('input[type="password"]');
        const objImgEye = container.querySelector<HTMLImageElement>(".toggle-password");
        const toggleArea = container.querySelector<HTMLDivElement>(".password-toggle");
        if (!objInput || !objImgEye || !toggleArea) return;
        const toggle = () => {
            if (objInput.type === "password") {
                objInput.type = "text";
                objImgEye.src = "../img/eye.svg";
            } else {
                objInput.type = "password";
                objImgEye.src = "../img/eye-off.svg";
            }
        };
        toggleArea.addEventListener("click", toggle);
    });
});

const decodeJWT = (token: string): any => {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
}

const isAccessTokenExpired = (token: string): boolean => {
    const decoded = decodeJWT(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
}

const refreshAccessToken = async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return;

    try {
        const response = await fetch(backendAddress + 'auth/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
        });

        if (response.ok) {
            const token = await response.json();
            localStorage.setItem('access_token', token.access);
        } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
}

const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    let accessToken = localStorage.getItem('access_token');

    if (accessToken && isAccessTokenExpired(accessToken)) {
        await refreshAccessToken();
        accessToken = localStorage.getItem('access_token');
    }

    if (accessToken) {
        options.headers = {
            ...(options.headers || {}),
            'Authorization': 'Bearer ' + accessToken
        };
    }
    return fetch(url, options);
}
