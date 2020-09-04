import Swal from "sweetalert2";

//Show a popup message
function myPopUp(myIcon, myMessage, myText, myTimer) {
  Swal.fire({
      icon: myIcon,
      title: myMessage,
      text: myText,
      showConfirmButton: false,
      timer: myTimer,
      footer: '<a href="index.html">Retour à la page d\'accueil</a>'
  })
}

//Get Product ID
let queryStr = window.location.search;
let urlStr = new URLSearchParams(queryStr);

//Show the number of products added to the cart
function cartProductsNumber(){
  let productsAdded;
  if (JSON.parse(localStorage.getItem('cart')) === null) {
      productsAdded = 0;
  }
  else {
    productsAdded = JSON.parse(localStorage.getItem('cart')).length;
    if (document.querySelector('#btn-cart')) {
        document.querySelector('#cart-num').innerHTML = "( " + productsAdded + " )";
    }
    else {
        document.querySelector('#cart-num').innerHTML = "( " + productsAdded + " )";
    }
  }
}

//Function to convert price in euro
function priceCalculation(price, priceText, text) {
  let euros = price/100;
  priceText.textContent = text + new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(euros);
  return euros;
}

export {myPopUp, urlStr, cartProductsNumber, priceCalculation};