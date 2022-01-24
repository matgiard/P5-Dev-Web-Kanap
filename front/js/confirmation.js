const params = new URLSearchParams(window.location.search);
const urlId = params.get("orderId");

document.querySelector('#orderId').innerHTML=urlId;