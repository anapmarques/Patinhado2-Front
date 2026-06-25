"use strict";
onload = async function () {
    document.getElementById('pet-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });
        if (data.idade === '') {
            delete data.idade;
        }
        if (data.foto_url === '') {
            delete data.foto_url;
        }
        if (data.raca === '') {
            delete data.raca;
        }
        if (data.descricao === '') {
            delete data.descricao;
        }
        try {
            const response = await authFetch(backendAddress + 'api/pets/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                window.location.href = 'list.html';
            }
            else {
                const err = await response.json();
                alert('Erro ao cadastrar pet: ' + JSON.stringify(err));
            }
        }
        catch (error) {
            alert('Erro de conexão: ' + error);
        }
    });
};
