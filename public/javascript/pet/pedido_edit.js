"use strict";
onload = async function () {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
        return;
    }
    const response = await authFetch(backendAddress + 'pedidos/' + id + '/');
    if (!response.ok) {
        return;
    }
    const pedido = await response.json();
    const rawAnimal = pedido.animal || pedido.pet;
    const animalId = rawAnimal && typeof rawAnimal === 'object' ? rawAnimal.id : rawAnimal;
    let animal = rawAnimal || {};
    if (animalId) {
        try {
            const petResponse = await fetch(backendAddress + 'pets/' + animalId + '/');
            if (petResponse.ok) {
                animal = await petResponse.json();
            }
        }
        catch (_) { }
    }
    const especieLabel = animal.especie;
    document.getElementById('pedido-title').textContent = 'Editar mensagem para ' + (animal.nome || '');
    document.getElementById('cancel-link').href = 'pedido_detail.html?id=' + id;
    const preview = document.getElementById('pet-preview');
    let imgHtml = '';
    if (animal.foto) {
        imgHtml = '<img src="' + animal.foto + '" alt="' + animal.nome + '" />';
    }
    else if (animal.foto_url) {
        imgHtml = '<img src="' + animal.foto_url + '" alt="' + animal.nome + '" />';
    }
    preview.innerHTML = imgHtml + '<p>' + especieLabel + ' | ' + (animal.raca || '—') + ' | ' + (animal.idade || '?') + ' anos</p>';
    document.getElementById('mensagem').value = pedido.mensagem || '';
    document.getElementById('pedido-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const mensagem = document.getElementById('mensagem').value;
        try {
            const res = await authFetch(backendAddress + 'pedidos/' + id + '/', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensagem: mensagem })
            });
            if (res.ok) {
                window.location.href = 'pedido_detail.html?id=' + id;
            }
            else {
                const err = await res.json();
                alert('Erro ao editar pedido: ' + JSON.stringify(err));
            }
        }
        catch (error) {
            alert('Erro de conexão: ' + error);
        }
    });
};
