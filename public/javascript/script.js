"use strict";
onload = async () => {
    ocultaCadastrarPetSeNaoLogado();
    await exibeListaDePets();
};
async function exibeListaDePets() {
    const response = await fetch(backendAddress + 'api/pets/');
    const petList = document.getElementById('pet-list');
    if (!petList)
        return;
    if (!response.ok) {
        petList.innerHTML = '<div class="no-pets"><p>Erro ao carregar lista de pets.</p></div>';
        return;
    }
    const pets = await response.json();
    if (pets.length === 0) {
        petList.innerHTML = '<div class="no-pets"><p>Nenhum pet disponível para adoção no momento.</p></div>';
        return;
    }
    petList.innerHTML = pets.map(pet => {
        const especie = pet.get_especie_display || pet.especie || '';
        const imgStyle = (pet.foto || pet.foto_url)
            ? `style="background-image: url('${pet.foto || pet.foto_url}'); background-size: cover; background-position: center;"`
            : '';
        const imgContent = (pet.foto || pet.foto_url)
            ? `<div class="card-img" ${imgStyle}></div>`
            : `<div class="card-img-placeholder"><span>${pet.nome ? pet.nome.charAt(0).toUpperCase() : '?'}</span></div>`;
        const racaHtml = pet.raca ? `<div class="card-raca">Raça: ${pet.raca}</div>` : '';
        const idadeHtml = pet.idade
            ? `<div class="card-idade">Idade: ${pet.idade} ${pet.idade === 1 ? 'ano' : 'anos'}</div>`
            : '';
        return `<a href="pet/detail.html?id=${pet.id}" class="card">
            ${imgContent}
            <div class="card-body">
                <div class="card-category">${especie}</div>
                <div class="card-title">${pet.nome || ''}</div>
                ${racaHtml}
                ${idadeHtml}
            </div>
        </a>`;
    }).join('');
}
function ocultaCadastrarPetSeNaoLogado() {
    const link = document.getElementById('cadastrar-pet-link');
    if (!link)
        return;
    const token = localStorage.getItem('access_token');
    if (!token) {
        link.style.display = 'none';
    }
}
