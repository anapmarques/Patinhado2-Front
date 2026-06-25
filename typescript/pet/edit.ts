onload = async function () {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) { return; }
    const response = await authFetch(backendAddress + 'api/pets/' + id + '/');
    if (!response.ok) { return; }
    const pet = await response.json();
    const especieLabel = pet.especie === 'C' ? 'Cachorro' : 'Gato';
    document.getElementById('pet-especie-label')!.textContent = especieLabel;
    document.getElementById('pet-subtitle')!.textContent = 'Atualize os dados de ' + pet.nome;
    (document.getElementById('nome') as HTMLInputElement).value = pet.nome;
    (document.getElementById('especie') as HTMLSelectElement).value = pet.especie;
    (document.getElementById('raca') as HTMLInputElement).value = pet.raca || '';
    (document.getElementById('idade') as HTMLInputElement).value = pet.idade !== null && pet.idade !== undefined ? String(pet.idade) : '';
    (document.getElementById('descricao') as HTMLTextAreaElement).value = pet.descricao || '';
    (document.getElementById('foto_url') as HTMLInputElement).value = pet.foto_url || '';
    document.getElementById('pet-form')!.addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data: any = {};
        formData.forEach((value, key) => { data[key] = value; });
        if (data.idade === '') { delete data.idade; }
        if (data.foto_url === '') { delete data.foto_url; }
        if (data.raca === '') { delete data.raca; }
        if (data.descricao === '') { delete data.descricao; }
        try {
            const res = await authFetch(backendAddress + 'api/pets/' + id + '/', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                window.location.href = 'detail.html?id=' + id;
            } else {
                const err = await res.json();
                alert('Erro ao editar pet: ' + JSON.stringify(err));
            }
        } catch (error) {
            alert('Erro de conexão: ' + error);
        }
    });
};
