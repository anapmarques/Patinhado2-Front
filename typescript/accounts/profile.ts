onload = async () => {
    try {
        const response = await authFetch(backendAddress + 'auth/profile/');
        if (response.ok) {
            const data = await response.json();
            await renderProfile(data);
        } else {
            window.location.href = 'login.html';
        }
    } catch {
        window.location.href = 'login.html';
    }
}

const renderProfile = async (data: any) => {
    (document.getElementById('profile-username') as HTMLSpanElement).textContent = data.username || '';
    (document.getElementById('profile-email') as HTMLSpanElement).textContent = data.email || '—';
    (document.getElementById('profile-first-name') as HTMLSpanElement).textContent = data.first_name || '—';
    (document.getElementById('profile-last-name') as HTMLSpanElement).textContent = data.last_name || '—';
    (document.getElementById('profile-telefone') as HTMLSpanElement).textContent = data.telefone || '—';
    (document.getElementById('profile-endereco') as HTMLSpanElement).textContent = data.endereco || '—';

    const petsContainer = document.getElementById('pets-doacao');
    if (petsContainer) {
        try {
            const petsResponse = await authFetch(backendAddress + 'pets/?doador=' + data.id);
            if (petsResponse.ok) {
                const pets = await petsResponse.json();
                if (pets.length > 0) {
                    petsContainer.innerHTML = pets.map((pet: any) => petCard(pet)).join('');
                } else {
                    petsContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não cadastrou nenhum pet para adoção.</p>';
                }
            } else {
                petsContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não cadastrou nenhum pet para adoção.</p>';
            }
        } catch {
            petsContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não cadastrou nenhum pet para adoção.</p>';
        }
    }

    const recebidosContainer = document.getElementById('pedidos-recebidos');
    if (recebidosContainer) {
        try {
            const pedidosResponse = await authFetch(backendAddress + 'pedidos/recebidos/');
            if (pedidosResponse.ok) {
                const pedidos = await pedidosResponse.json();
                if (pedidos.length > 0) {
                    recebidosContainer.innerHTML = pedidos.map((p: any) => pedidoCard(p, true)).join('');
                } else {
                    recebidosContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não recebeu nenhuma solicitação de adoção.</p>';
                }
            } else {
                recebidosContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não recebeu nenhuma solicitação de adoção.</p>';
            }
        } catch {
            recebidosContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não recebeu nenhuma solicitação de adoção.</p>';
        }
    }

    const enviadosContainer = document.getElementById('pedidos-enviados');
    if (enviadosContainer) {
        try {
            const pedidosResponse = await authFetch(backendAddress + 'pedidos/');
            if (pedidosResponse.ok) {
                const pedidos = await pedidosResponse.json();
                if (pedidos.length > 0) {
                    enviadosContainer.innerHTML = pedidos.map((p: any) => pedidoCard(p, false)).join('');
                } else {
                    enviadosContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não fez nenhuma solicitação de adoção.</p>';
                }
            } else {
                enviadosContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não fez nenhuma solicitação de adoção.</p>';
            }
        } catch {
            enviadosContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não fez nenhuma solicitação de adoção.</p>';
        }
    }

    const adotadosContainer = document.getElementById('pets-adotados');
    if (adotadosContainer) {
        try {
            const adotadosResponse = await authFetch(backendAddress + 'pedidos/?status=aprovado');
            if (adotadosResponse.ok) {
                const adotados = await adotadosResponse.json();
                if (adotados.length > 0) {
                    adotadosContainer.innerHTML = adotados.map((pet: any) => petCard(pet)).join('');
                } else {
                    adotadosContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não adotou nenhum pet.</p>';
                }
            } else {
                adotadosContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não adotou nenhum pet.</p>';
            }
        } catch {
            adotadosContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não adotou nenhum pet.</p>';
        }
    }
}

const petCard = (pet: any): string => {
    const imgHtml = pet.foto
        ? `<img src="${pet.foto}" alt="${pet.nome}" style="width:100%;height:100%;object-fit:cover;">`
        : pet.foto_url
            ? `<img src="${pet.foto_url}" alt="${pet.nome}" style="width:100%;height:100%;object-fit:cover;">`
            : `<span>${(pet.especie || '').substring(0, 3).toUpperCase()}</span>`;
    return `
        <a href="../pet/detail.html?id=${pet.id}" class="history-card">
            <div class="history-img">${imgHtml}</div>
            <div class="history-body">
                <div class="history-title">${pet.nome}</div>
                <div class="history-meta">${pet.especie}${pet.data_chegada ? ' · ' + new Date(pet.data_chegada).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : ''}${pet.data_adocao ? ' · ' + new Date(pet.data_adocao).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : ''}</div>
            </div>
        </a>`;
}

const pedidoCard = (pedido: any, showRequester: boolean): string => {
    const statusClass = 'badge-' + (pedido.status || 'pendente');
    const petNome = pedido.animal_nome; 
    const quem = showRequester
        ? `<div class="history-meta">Solicitante: ${pedido.requerente?.first_name || pedido.requerente?.username || '—'}</div>`
        : `<div class="history-meta">Pet: ${petNome}</div>`;
    return `
        <a href="../pet/pedido_detail.html?id=${pedido.id}" class="history-card">
            <div class="history-body">
                <div class="history-title">${petNome}</div>
                ${quem}
                <div class="history-meta">${new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}</div>
                <span class="${statusClass}">${pedido.status}</span>
            </div>
        </a>`;
}
