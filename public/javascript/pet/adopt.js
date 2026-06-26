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
    const preview = document.getElementById('pet-preview');
    const especieLabel = pet.especie;
    let imgHtml = '';
    if (pet.foto) {
        imgHtml = '<img src="' + pet.foto + '" alt="' + pet.nome + '" />';
    }
    else if (pet.foto_url) {
        imgHtml = '<img src="' + pet.foto_url + '" alt="' + pet.nome + '" />';
    }
    preview.innerHTML = imgHtml + '<p>' + especieLabel + ' | ' + (pet.raca || 'Raça não informada') + ' | ' + (pet.idade || '?') + ' anos</p>';
    document.getElementById('adopt-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const mensagem = document.getElementById('mensagem').value;
        try {
            const res = await authFetch(backendAddress + 'pedidos/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ animal: id, mensagem: mensagem })
            });
            if (res.ok) {
                window.location.href = '../accounts/profile.html';
            }
            else {
                const err = await res.json();
                alert('Erro ao solicitar adoção: ' + JSON.stringify(err));
            }
        }
        catch (error) {
            alert('Erro de conexão: ' + error);
        }
    });
};
