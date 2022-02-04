const params = new URLSearchParams(window.location.search);
const urlId = params.get("id");

async function getOneProduct() {
    // Call vers mon serveur 
    return fetch(`http://localhost:3000/api/products/${urlId}`)
        .then(function (response) { return response.json(); })
        .then(function (product) { return product; })
        .catch(function (error) { document.querySelector('.item').innerHTML = 'Malheuresement notre site rencontre une erreur. Veuillez réessayer ultérieurement.'; });
}

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

async function displayOneProduct() {
    const product = await getOneProduct();
    if (Object.keys(product).length !== 0) {
        convertProductToHtml(product);
    } else {
        document.querySelector('.item').innerHTML = 'Malheuresement notre site rencontre une erreur. Veuillez réessayer ultérieurement.';
    }      
}


displayOneProduct();

function getSelectedProduct () {  
    return {
        _id: urlId,
        color: document.querySelector('#colors').value,
        quantity: document.querySelector('#quantity').valueAsNumber
    };
}

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

function checkLocalStorage (productToCheck) {
    console.log(localStorage.getItem('products'));
    const productsInLocalStorage = JSON.parse(localStorage.getItem('products')) || [];
    // 1 - findIndex: productsInLocalStorage.findIndex(p => p._id === productToCheck._id && p.color === productToCheck.color)
    const index = productsInLocalStorage.findIndex(function (p) {
        return p._id === productToCheck._id && p.color === productToCheck.color
    });
    // 2 - stocker le retour de findIndex
    
    // 3 - si index = -1 j'ajoute productToCheck dans productsInLocalStorage
    if (index === -1) {
        productsInLocalStorage.push(productToCheck);
    }
    // 4 - sinon on fais productInLocalStorage[index].quantity+=productToCheck.quantity
    else {
        productsInLocalStorage[index].quantity+=productToCheck.quantity;
    }
    localStorage.setItem('products', JSON.stringify(productsInLocalStorage));
}

addToCart();

