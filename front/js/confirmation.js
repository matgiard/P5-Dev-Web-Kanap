// Stockage du numéro de commande depuis l'url.
const params = new URLSearchParams(window.location.search);
const urlId = params.get("orderId");

// On récupère le numéro de commande dans l'url pour l'afficher dans la classe HTML correspondante.
document.querySelector('#orderId').innerHTML=urlId;