"use strict";
onload = async function () {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
        return;
    }
    const response = await fetch(backendAddress + 'pets/' + id + '/');
    if (!response.ok) {
        return;
    }
    const pet = await response.json();
    document.getElementById('pet-nome-breadcrumb').textContent = pet.nome;
    const imgContainer = document.getElementById('detail-img-container');
    if (pet.foto) {
        imgContainer.innerHTML = '<img src="' + pet.foto + '" alt="Foto de ' + pet.nome + '" class="detail-img" />';
    }
    else if (pet.foto_url) {
        imgContainer.innerHTML = '<img src="' + pet.foto_url + '" alt="Foto de ' + pet.nome + '" class="detail-img" />';
    }
    else {
        const especieLabel = pet.especie === 'cachorro' ? 'Cachorro' : 'Gato';
        imgContainer.innerHTML = '<div class="detail-img-placeholder"><span>' + especieLabel + '</span></div>';
    }
    const especieLabel = pet.especie;
    document.getElementById('pet-especie').textContent = especieLabel;
    document.getElementById('pet-nome').textContent = pet.nome;
    const infoParts = [pet.raca || 'Raça não informada'];
    if (pet.idade !== null && pet.idade !== undefined) {
        infoParts.push(pet.idade + (pet.idade === 1 ? ' ano' : ' anos'));
    }
    document.getElementById('pet-info').textContent = infoParts.join(' | ');
    const badge = document.getElementById('pet-status-badge');
    if (pet.adotado) {
        badge.className = 'badge badge-adotado';
        badge.textContent = 'Adotado';
    }
    else {
        badge.className = 'badge badge-disponivel';
        badge.textContent = 'Disponível para adoção';
    }
    document.getElementById('pet-doador').textContent = pet.doador_nome || '—';
    document.getElementById('pet-descricao').textContent = pet.descricao || '';
    const actionsDiv = document.getElementById('detail-actions');
    const token = localStorage.getItem('access_token');
    if (token) {
        try {
            const meResponse = await authFetch(backendAddress + 'auth/me/');
            if (meResponse.ok) {
                const userData = await meResponse.json();
                const userId = userData.id || userData.user_id;
                const doadorId = pet.doador_id || pet.doador;
                if (userId && doadorId && Number(userId) === Number(doadorId)) {
                    actionsDiv.innerHTML = '<a href="edit.html?id=' + id + '" class="btn-editar">Editar</a>'
                        + '<a href="delete.html?id=' + id + '" class="btn-excluir">Excluir</a>';
                }
                else if (!pet.adotado) {
                    actionsDiv.innerHTML = '<a href="adopt.html?id=' + id + '" class="btn-adotar">Adotar</a>';
                }
            }
        }
        catch (_e) { }
    }
};
