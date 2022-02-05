// Appel pour récupérer tous les détails d’un seul produit grâce à son identifiant situé dans le local storage. 
async function getOneProduct(productId) {
  return fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function (response) { return response.json(); })
    .then(function (product) { return product; })
    .catch(function (error) { alert ('Malheuresement notre site rencontre une erreur. Veuillez réessayer ultérieurement.'); });
}

// Injecte les détails produit dans le DOM depuis l'API et le Local Storage.
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

// Au click, suppression d'un produit de la page et du Local Storage.
function suppr(deleteItem) {
  deleteItem.addEventListener("click", (e) => {
    e.preventDefault();
    const cartItem = deleteItem.closest('.cart__item');
    const id = cartItem.dataset.id;
    const color = cartItem.dataset.color;
	  const productsInLocalStorage = JSON.parse(localStorage.getItem('products'));
	  const index = productsInLocalStorage.findIndex(function (p) {
      return p._id === id && p.color === color
  });
  console.log(index, id, color, cartItem);
	if (index !== -1) {
    productsInLocalStorage.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(productsInLocalStorage));
    alert("Ce produit a bien été supprimé du panier");
    location.reload();
  }
  })
}

// Boucle qui appelle la fonction “suppr” pour la répéter autant de fois que necessaire.
function initDeleteListener() {
  const deleteItems = document.querySelectorAll(".deleteItem");
  console.log(deleteItems);
  for (let k = 0; k < deleteItems.length; k++) {
    suppr(deleteItems[k]);
  }
}

// Au click sur l’input pour changer la quantité la fonction change la valeur dans l’HTML et dans le Local Storage.
function changeQuantity(quantityItem) {
  quantityItem.addEventListener("change", (e) => {
    e.preventDefault();
    const cartItem = quantityItem.closest('.cart__item');
    const id = cartItem.dataset.id;
    const color = cartItem.dataset.color;
    const productsInLocalStorage = JSON.parse(localStorage.getItem('products'));
    const index = productsInLocalStorage.findIndex(function (p) {
      return p._id === id && p.color === color
    });
    console.log(index, id, color, cartItem);
    if (index !== -1) {
      const quantity = quantityItem.valueAsNumber;
      if (quantity >= 1) {
        productsInLocalStorage[index].quantity=quantityItem.valueAsNumber;
        } else {
          productsInLocalStorage.splice(index, 1);
        }
      localStorage.setItem('products', JSON.stringify(productsInLocalStorage));
      location.reload();
    }
  })
}

// Boucle qui appelle la fonction “changeQuantity” pour la répéter autant de fois que necessaire.
function initQuantityListener() {
  const quantityItems = document.querySelectorAll(".itemQuantity");
  for (let k = 0; k < quantityItems.length; k++) {
      changeQuantity(quantityItems[k]);
  }
}

// Affiche tous les produits du panier et effectue les opérations de quantité et prix total.
async function displayProducts() {
  let productsInLocalStorage = JSON.parse(localStorage.getItem('products'));
  let totalPrice = 0;
  let totalQuantity = 0; 
  for (const productInLocalStorage of productsInLocalStorage) {
    const product = await getOneProduct(productInLocalStorage._id);
    renderProductToHtml(productInLocalStorage, product);
    totalQuantity += productInLocalStorage.quantity;
    totalPrice += product.price*productInLocalStorage.quantity;
  }
  document.querySelector('#totalQuantity').innerHTML=totalQuantity;
  document.querySelector('#totalPrice').innerHTML=totalPrice;
  initDeleteListener();
  initQuantityListener();
}

displayProducts();

// Fonction prenant en charge le formulaire.
function postForm() {
  const order = document.getElementById('order');
  order.addEventListener('click', (event) => {
    event.preventDefault();

  // Récupère les données du formulaire.
  const contact = {
    firstName : document.getElementById('firstName').value,
    lastName : document.getElementById('lastName').value,
    address : document.getElementById('address').value,
    city : document.getElementById('city').value,
    email : document.getElementById('email').value
  }
  
  // Vérification entrées.

    // Contrôle prénom.
  function controlFirstName() {
    const validFirstName = contact.firstName;
    if (/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,20}$/.test(validFirstName)) {
      firstNameErrorMsg.innerText = "";
      return true;
    } else {
      let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
      firstNameErrorMsg.innerText = "Merci de vérifier le prénom, 3 caractères minimum";
      return false
    }
  }
  
    // Contrôle nom.
  function controlLastName() {
    const validLastName = contact.lastName;
    if (/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,20}$/.test(validLastName)) {
      lastNameErrorMsg.innerText = "";
      return true
    } else {
      let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
      lastNameErrorMsg.innerText = "Merci de vérifier le nom, 3 caractères minimum, avec des lettres uniquement";
      return false
    }
  }

    // Contrôle adresse.
  function controlAddress() {
    const validAddress = contact.address;
    if (/^[a-zA-Z0-9\s,'-]*$/.test(validAddress)) {
      addressErrorMsg.innerText = "";
      return true
    } else {
      let addressErrorMsg = document.getElementById('addressErrorMsg');
      addressErrorMsg.innerText = "Merci de vérifier l'adresse, alphanumérique et sans caractères spéciaux";
      return false 
    }
  }

    // Contrôle ville.
  function controlCity() {
    const validCity = contact.city;
    if (/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,10}$/.test(validCity)) {
      cityErrorMsg.innerText = "";
      return true
    } else {
      let cityErrorMsg = document.getElementById("cityErrorMsg");
      cityErrorMsg.innerText = "Merci de vérifier le nom de la ville, 3 caractères minimum, avec des lettres uniquement";
      return false
    }
  }

    // Contrôle email.
  function controlEmail() {
    const validEmail = contact.email;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validEmail)) {
      emailErrorMsg.innerText = "";
      return true
    } else {
      let emailErrorMsg = document.getElementById("emailErrorMsg");
      emailErrorMsg.innerText = "Erreur ! Email non valide.";
      return false
    }
  }

  // Valide les entrées du formulaire, enregistre la commande sur le serveur.
  function validControl() {
    let isValidFirstName = controlFirstName();
    let isValidLastName = controlLastName();
    let isValidAddress = controlAddress();
    let isValidCity = controlCity();
    let isValidEmail = controlEmail();
    if (isValidFirstName && isValidLastName && isValidAddress && isValidCity && isValidEmail) {
      alert("Votre commande a bien été enregistrée !")
      const products = JSON.parse(localStorage.getItem('products')).map(p => p._id);
      const body = {
        contact,
        products,
      };

      const postOrder = {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
              "Content-Type": "application/json" 
          },
      };
      fetch("http://localhost:3000/api/products/order", postOrder)
      .then((response) => response.json())
      .then((data) => {
          localStorage.clear();
          window.location.href = 'confirmation.html?orderId='+data.orderId;
      })
      .catch((err) => {
          alert ("Erreur: " + err.message);
      });
      } else {
        alert("Merci de revérifier les informations saisies")
      }
    }
  validControl();
  })
}

postForm();
