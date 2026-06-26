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
    const animal = pedido.animal || pedido.pet || {};
    const especieLabel = animal.especie === 'C' ? 'Cachorro' : animal.especie === 'G' ? 'Gato' : '';
    document.getElementById('pet-nome').textContent = animal.nome || '';
    const preview = document.getElementById('pet-preview');
    let imgHtml = '';
    if (animal.foto) {
        imgHtml = '<img src="' + animal.foto + '" alt="' + animal.nome + '" />';
    }
    else if (animal.foto_url) {
        imgHtml = '<img src="' + animal.foto_url + '" alt="' + animal.nome + '" />';
    }
    preview.innerHTML = imgHtml + '<p>' + especieLabel + ' | ' + (animal.raca || '—') + ' | ' + (animal.idade || '?') + ' anos</p>';
    const solicitanteNome = pedido.solicitante_username || pedido.solicitante_nome || pedido.solicitante || '—';
    const doadorNome = pedido.doador_username || pedido.doador_nome || (animal.doador_username || animal.doador || '—');
    document.getElementById('pedido-solicitante').textContent = solicitanteNome;
    document.getElementById('pedido-doador').textContent = doadorNome;
    const statusEl = document.getElementById('pedido-status');
    const statusMap = { pendente: 'Pendente', aprovado: 'Aprovado', cancelado: 'Cancelado', rejeitado: 'Rejeitado' };
    const statusClassMap = { pendente: 'badge-pendente', aprovado: 'badge-aprovado', cancelado: 'badge-cancelado', rejeitado: 'badge-rejeitado' };
    statusEl.innerHTML = '<span class="' + (statusClassMap[pedido.status] || '') + '">' + (statusMap[pedido.status] || pedido.status) + '</span>';
    document.getElementById('pedido-data').textContent = pedido.data_pedido ? new Date(pedido.data_pedido).toLocaleDateString('pt-BR') : '—';
    if (pedido.data_resposta) {
        document.getElementById('data-resposta-row').classList.remove('is-hidden');
        document.getElementById('pedido-data-resposta').textContent = new Date(pedido.data_resposta).toLocaleDateString('pt-BR');
    }
    if (pedido.mensagem) {
        document.getElementById('pedido-mensagem-container').style.display = 'block';
        document.getElementById('pedido-mensagem').textContent = pedido.mensagem;
    }
    const token = localStorage.getItem('access_token');
    if (token && pedido.status === 'pendente') {
        try {
            const meResponse = await authFetch(backendAddress + 'auth/me/');
            if (meResponse.ok) {
                const userData = await meResponse.json();
                const userId = userData.id || userData.user_id;
                const solicitanteId = pedido.solicitante_id || pedido.solicitante;
                const doadorId = pedido.doador_id || animal.doador_id || animal.doador;
                const actionsDiv = document.getElementById('pedido-actions');
                if (userId && solicitanteId && Number(userId) === Number(solicitanteId)) {
                    actionsDiv.innerHTML = '<a href="pedido_edit.html?id=' + id + '" class="btn-submit">Editar</a>'
                        + '<button type="button" class="btn-cancelar" id="btn-cancelar">Cancelar Pedido</button>';
                    document.getElementById('btn-cancelar').addEventListener('click', async () => {
                        const res = await authFetch(backendAddress + 'pedidos/' + id + '/cancelar/', { method: 'POST' });
                        if (res.ok) {
                            window.location.reload();
                        }
                        else {
                            alert('Erro ao cancelar pedido');
                        }
                    });
                }
                else if (userId && doadorId && Number(userId) === Number(doadorId)) {
                    actionsDiv.innerHTML = '<button type="button" class="btn-submit" id="btn-aprovar">Aprovar</button>'
                        + '<button type="button" class="btn-cancelar" id="btn-rejeitar">Rejeitar</button>';
                    document.getElementById('btn-aprovar').addEventListener('click', async () => {
                        const res = await authFetch(backendAddress + 'pedidos/' + id + '/aprovar/', { method: 'POST' });
                        if (res.ok) {
                            window.location.reload();
                        }
                        else {
                            alert('Erro ao aprovar pedido');
                        }
                    });
                    document.getElementById('btn-rejeitar').addEventListener('click', async () => {
                        const res = await authFetch(backendAddress + 'pedidos/' + id + '/rejeitar/', { method: 'POST' });
                        if (res.ok) {
                            window.location.reload();
                        }
                        else {
                            alert('Erro ao rejeitar pedido');
                        }
                    });
                }
            }
        }
        catch (_e) { }
    }
    if (pedido.status !== 'pendente') {
        const actionsDiv = document.getElementById('pedido-actions');
        actionsDiv.innerHTML = '<a href="../accounts/profile.html" class="btn-submit">Voltar ao Perfil</a>';
    }
};
