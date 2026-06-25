onload = async function () {
    const response = await fetch(backendAddress + 'api/pets/');
    const pets = await response.json();
    const grid = document.getElementById('pet-grid') as HTMLDivElement;
    const empty = document.getElementById('empty-msg') as HTMLDivElement;
    if (pets.length === 0) {
        empty.style.display = 'block';
        return;
    }
    pets.forEach((pet: any) => {
        const card = document.createElement('a');
        card.href = 'detail.html?id=' + pet.id;
        card.className = 'card';
        let imgHtml: string;
        if (pet.foto) {
            imgHtml = '<div class="card-img" style="background-image: url(' + pet.foto + ');"></div>';
        } else if (pet.foto_url) {
            imgHtml = '<div class="card-img" style="background-image: url(' + pet.foto_url + ');"></div>';
        } else {
            imgHtml = '<div class="card-img-placeholder"><span>' + pet.nome.charAt(0).toUpperCase() + '</span></div>';
        }
        const especieLabel = pet.especie === 'C' ? 'Cachorro' : 'Gato';
        const statusHtml = pet.adotado
            ? '<span class="badge badge-adotado">Adotado</span>'
            : '<span class="badge badge-disponivel">Disponível</span>';
        const idadeHtml = pet.idade !== null && pet.idade !== undefined
            ? '<div class="card-idade">Idade: ' + pet.idade + (pet.idade === 1 ? ' ano' : ' anos') + '</div>'
            : '';
        const racaHtml = pet.raca ? '<div class="card-raca">Raça: ' + pet.raca + '</div>' : '';
        card.innerHTML = imgHtml
            + '<div class="card-body">'
            + '<div class="card-category">' + especieLabel + '</div>'
            + '<div class="card-title">' + pet.nome + '</div>'
            + racaHtml
            + idadeHtml
            + statusHtml
            + '</div>';
        grid.appendChild(card);
    });
};
