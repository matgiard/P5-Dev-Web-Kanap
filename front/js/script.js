// Appel vers l'API qui contient les produits.
async function getAllProducts() {
    return fetch('http://localhost:3000/api/products')
        .then(function (response) { return response.json(); })
        .then(function (products) { return products; })
        .catch(function (error) { document.querySelector('#items').innerHTML = 'Malheuresement notre site rencontre une erreur. Veuillez réessayer ultérieurement.'; });
}

// Injecte les détails produit dans le DOM depuis l'API.
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

// Affichage de tous les produits.
async function displayAllProducts() {
    const products = await getAllProducts();
    for(const product of products) {
        convertProductToHtml(product);   
    }
}

displayAllProducts();