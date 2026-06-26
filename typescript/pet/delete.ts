onload = async function () {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) { return; }
    const response = await authFetch(backendAddress + 'pets/' + id + '/');
    if (!response.ok) { return; }
    const pet = await response.json();
    document.getElementById('pet-nome')!.textContent = pet.nome + '?';
    const especieLabel = pet.especie === 'C' ? 'Cachorro' : 'Gato';
    const infoHtml = '<div class="pet-info-row"><span class="label">Espécie</span><span class="value">' + especieLabel + '</span></div>'
        + '<div class="pet-info-row"><span class="label">Raça</span><span class="value">' + (pet.raca || '—') + '</span></div>'
        + '<div class="pet-info-row"><span class="label">Idade</span><span class="value">' + (pet.idade !== null && pet.idade !== undefined ? pet.idade + ' anos' : '—') + '</span></div>'
        + '<div class="pet-info-row"><span class="label">Status</span><span class="value">' + (pet.adotado ? 'Adotado' : 'Disponível') + '</span></div>'
        + '<div class="pet-info-row"><span class="label">Doador</span><span class="value">' + (pet.doador_username || pet.doador || '—') + '</span></div>';
    document.getElementById('pet-info')!.innerHTML = infoHtml;
    document.getElementById('delete-form')!.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const res = await authFetch(backendAddress + 'pets/' + id + '/', {
                method: 'DELETE'
            });
            if (res.ok) {
                window.location.href = 'list.html';
            } else {
                const err = await res.json();
                alert('Erro ao excluir pet: ' + JSON.stringify(err));
            }
        } catch (error) {
            alert('Erro de conexão: ' + error);
        }
    });
};
