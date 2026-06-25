"use strict";
onload = async () => {
    try {
        const response = await authFetch(backendAddress + 'api/profile/dashboard/');
        if (response.ok) {
            const data = await response.json();
            renderProfile(data);
        }
        else {
            window.location.href = 'login.html';
        }
    }
    catch (_a) {
        window.location.href = 'login.html';
    }
};
const renderProfile = (data) => {
    document.getElementById('profile-username').textContent = data.username || '';
    document.getElementById('profile-email').textContent = data.email || '—';
    document.getElementById('profile-first-name').textContent = data.first_name || '—';
    document.getElementById('profile-last-name').textContent = data.last_name || '—';
    document.getElementById('profile-telefone').textContent = data.telefone || '—';
    document.getElementById('profile-endereco').textContent = data.endereco || '—';
    const petsContainer = document.getElementById('pets-doacao');
    if (petsContainer) {
        if (data.pets_doacao && data.pets_doacao.length > 0) {
            petsContainer.innerHTML = data.pets_doacao.map((pet) => petCard(pet)).join('');
        }
        else {
            petsContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não cadastrou nenhum pet para adoção.</p>';
        }
    }
    const recebidosContainer = document.getElementById('pedidos-recebidos');
    if (recebidosContainer) {
        if (data.pedidos_recebidos && data.pedidos_recebidos.length > 0) {
            recebidosContainer.innerHTML = data.pedidos_recebidos.map((p) => pedidoCard(p, true)).join('');
        }
        else {
            recebidosContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não recebeu nenhuma solicitação de adoção.</p>';
        }
    }
    const enviadosContainer = document.getElementById('pedidos-enviados');
    if (enviadosContainer) {
        if (data.pedidos_adocao && data.pedidos_adocao.length > 0) {
            enviadosContainer.innerHTML = data.pedidos_adocao.map((p) => pedidoCard(p, false)).join('');
        }
        else {
            enviadosContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não fez nenhuma solicitação de adoção.</p>';
        }
    }
    const adotadosContainer = document.getElementById('pets-adotados');
    if (adotadosContainer) {
        if (data.pets_adotados && data.pets_adotados.length > 0) {
            adotadosContainer.innerHTML = data.pets_adotados.map((pet) => petCard(pet)).join('');
        }
        else {
            adotadosContainer.innerHTML = '<p style="color: var(--mid); font-size: .9rem;">Você ainda não adotou nenhum pet.</p>';
        }
    }
};
const petCard = (pet) => {
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
};
const pedidoCard = (pedido, showRequester) => {
    var _a, _b, _c;
    const statusClass = 'badge-' + (pedido.status || 'pendente');
    const petNome = ((_a = pedido.pet) === null || _a === void 0 ? void 0 : _a.nome) || 'Pet';
    const quem = showRequester
        ? `<div class="history-meta">Solicitante: ${((_b = pedido.requerente) === null || _b === void 0 ? void 0 : _b.first_name) || ((_c = pedido.requerente) === null || _c === void 0 ? void 0 : _c.username) || '—'}</div>`
        : `<div class="history-meta">Pet: ${petNome}</div>`;
    return `
        <div class="history-card" style="cursor:default;">
            <div class="history-body">
                <div class="history-title">${petNome}</div>
                ${quem}
                <div class="history-meta">${new Date(pedido.data_solicitacao).toLocaleDateString('pt-BR')}</div>
                <span class="${statusClass}">${pedido.status}</span>
            </div>
        </div>`;
};
