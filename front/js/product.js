// Stockage de l'ID du produit depuis l'url.
const params = new URLSearchParams(window.location.search);
const urlId = params.get("id");

// Appel vers l'API pour récuperer un produits grâce à l'ID.
async function getOneProduct() {
    return fetch(`http://localhost:3000/api/products/${urlId}`)
        .then(function (response) { return response.json(); })
        .then(function (product) { return product; })
        .catch(function (error) { document.querySelector('.item').innerHTML = 'Malheuresement notre site rencontre une erreur. Veuillez réessayer ultérieurement.'; });
}

// Injecte les détails produit dans le DOM depuis l'API.
function convertProductToHtml(product) {
    document.querySelector('title').innerHTML=`${product.name}`;
    document.querySelector('.item__img').innerHTML=`<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    document.querySelector('#title').innerHTML=`<h1 id="title">${product.name}</h1>`;
    document.querySelector('#price').innerHTML=`<span id="price">${product.price}</span>`;
    document.querySelector('#description').innerHTML=`<p id="description">${product.description}</p>`;
    for (const color of product.colors) {
      document.querySelector('#colors').innerHTML+=`<option value="${color}">${color}</option>`;
    }
}

// Affichage de l'unique produit.
async function displayOneProduct() {
    const product = await getOneProduct();
    if (Object.keys(product).length !== 0) {
        convertProductToHtml(product);
    } else {
        document.querySelector('.item').innerHTML = 'Malheuresement notre site rencontre une erreur. Veuillez réessayer ultérieurement.';
    }      
}


displayOneProduct();

// Enregistre les choix de l'utilisateur.
function getSelectedProduct () {  
    return {
        _id: urlId,
        color: document.querySelector('#colors').value,
        quantity: document.querySelector('#quantity').valueAsNumber
    };
}

// Ajoute le produit au panier.
function addToCart () {
    const addToCartBtn = document.getElementById('addToCart');
    addToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const product = getSelectedProduct();
        if (product._id && product.quantity >= 1 && product.color) {
            checkLocalStorage (product);
            alert ('Ce produit a bien été ajouté à votre panier.');
            window.location = '../html/cart.html';
        } else {
            alert ('Veuillez selectionner une couleur et une quantité.');
        }
    });
}

// Ajoute le produit et les caractéristiques choisis par l'utilisateur au Local Storage.
function checkLocalStorage (productToCheck) {
    console.log(localStorage.getItem('products'));
    const productsInLocalStorage = JSON.parse(localStorage.getItem('products')) || [];
    const index = productsInLocalStorage.findIndex(function (p) {
        return p._id === productToCheck._id && p.color === productToCheck.color
    });
    if (index === -1) {
        productsInLocalStorage.push(productToCheck);
    }
    else {
        productsInLocalStorage[index].quantity+=productToCheck.quantity;
    }
    localStorage.setItem('products', JSON.stringify(productsInLocalStorage));
}

addToCart();

