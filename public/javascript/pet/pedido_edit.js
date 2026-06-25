"use strict";
onload = async function () {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
        return;
    }
    const response = await authFetch(backendAddress + 'api/pedidos/' + id + '/');
    if (!response.ok) {
        return;
    }
    const pedido = await response.json();
    const animal = pedido.animal || pedido.pet || {};
    const especieLabel = animal.especie === 'C' ? 'Cachorro' : animal.especie === 'G' ? 'Gato' : '';
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
            const res = await authFetch(backendAddress + 'api/pedidos/' + id + '/', {
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
