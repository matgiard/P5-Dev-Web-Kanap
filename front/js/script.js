// 1 - Récupérer la liste de produits
// 2 - Adapter le rendu
// 3 - Afficher le rendu

async function getAllProducts() {
    // Call vers mon serveur 
    return fetch('http://localhost:3000/api/products')
        .then(function (response) { return response.json(); })
        .then(function (products) { return products; })
        .catch(function (error) { document.querySelector('#items').innerHTML = 'Malheuresement notre site rencontre une erreur. Veuillez réessayer ultérieurement.'; });
}


function convertProductToHtml(product) {
    document.querySelector('#items').innerHTML += `
        <a href="./product.html?id=${product._id}">
            <article>
                <img src="${product.imageUrl}" alt="${product.altTxt}">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
            </article>
        </a>`;
}


async function displayAllProducts() {
    const products = await getAllProducts();
    for(const product of products) {
        convertProductToHtml(product);   
    }
}

displayAllProducts();