const params = new URLSearchParams(window.location.search);
const urlId = params.get("id");

async function getOneProduct() {
    // Call vers mon serveur 
    return fetch(`http://localhost:3000/api/products/${urlId}`)
        .then(function (response) { return response.json(); })
        .then(function (product) { return product; })
        .catch(function (error) { document.querySelector('.item').innerHTML = 'Malheuresement notre site rencontre une erreur. Veuillez réessayer ultérieurement.'; });
}

// product = {
//     "colors": ["Blue", "White", "Black"],
//     "_id": "107fb5b75607497b96722bda5b504926",
//     "name": "Kanap Sinopé",
//     "price": 1849,
//     "imageUrl": "kanap01.jpeg",
//     "description": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     "altTxt": "Photo d'un canapé bleu, deux places"
//   }

function convertProductToHtml(product) {
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
    convertProductToHtml(product);   
}


displayOneProduct();