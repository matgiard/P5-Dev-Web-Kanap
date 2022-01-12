let productsInLocaStorage = JSON.parse(localStorage.getItem('products'));

// 1 - récuperer le panier via localStorage
// 2 - récuperer tous les produits pour savoir quoi insérer ?
// 3 - coupler les 2 pour la description et l'img
// 4 - associer 2 et 3
// 5 - display le tout

function getOneProduct(productId) {
    // Call vers mon serveur 
    return fetch(`http://localhost:3000/api/products/${productId}`)
        .then(function (response) { return response.json(); })
        .then(function (product) { return product; })
        .catch(function (error) { alert ('Malheuresement notre site rencontre une erreur. Veuillez réessayer ultérieurement.'); });
}

function renderProductToHtml(productInLocalStorage, product) {
    document.querySelector('#cart__items').innerHTML += `
        <article class="cart__item" data-id="${productInLocalStorage._id}" data-color="${productInLocalStorage.color}">
            <div class="cart__item__img">
                <img src="${product.imageUrl}" alt="${product.altTxt}>
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${productInLocalStorage.color}</p>
                    <p>${product.price}€</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : ${productInLocalStorage.quantity}</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInLocalStorage.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>;`
}

async function displayProducts() {
    for (const productInLocalStorage of productsInLocaStorage) {
        const product = await getOneProduct(productInLocalStorage._id);
        renderProductToHtml(productInLocalStorage, product);
    }
}

displayProducts();

// Supprimer un produit du panier

function suppr(deleteItem) {
    deleteItem.addEventListener("click", (e) => {
        e.preventDefault();
        alert('bla bla');
        const cartItem = deleteItem.closest('#cart__items');
        const id = cartItem.dataset.id;
        const color = cartItem.dataset.color; 
        // 1 - recup le localstorage
	    const productsInLocalStorage = JSON.parse(localStorage.getItem('products'));
        // 2 - je cherche l'index de l'element dans mon localstorage (findIndex) => const index = productsInLocalStorage.findIndex()
	    const index = productsInLocalStorage.findIndex(function (p) {
            return p.id === id && p.color === color
        });
        // 3 - stocker le retour de findIndex, si findIndex different de -1 je splice le localstorage recupéré
	    if (index !== -1) {
            productsInLocalStorage.splice(index, 1);
            alert("Ce produit a bien été supprimé du panier");
            location.reload();
        }
        // 4 - productsInLocalStorage.splice(index, 1)
    })
}

function initDeleteListener() {
    const deleteItems = document.querySelectorAll(".deleteItem");
    console.log(deleteItems);
    for (let k = 0; k < deleteItems.length; k++) {
        suppr(deleteItems[k]);
    }
}

initDeleteListener();