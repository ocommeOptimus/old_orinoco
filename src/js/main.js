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

function getData(url) {
  fetch(url)
    .then(
      function(response) {
        if (response.status !== 200) {
          myPopUp('error', 'Erreur ' + response.status, 'Une erreur est survenue, merci de réessayer ultérieurement', '2000')
          return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
          console.log(data);
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}

//Get Product ID
var queryStr = window.location.search;
var urlStr = new URLSearchParams(queryStr);

//Show the number of products added to the cart
function cartProductsNumber(){
  var productsAdded;
  if (JSON.parse(localStorage.getItem('cart')) === null) {
      productsAdded = 0;
  }
  else {
    productsAdded = JSON.parse(localStorage.getItem('cart')).length;
    if (document.querySelector('#return')) {
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

export {myPopUp, getData, urlStr, cartProductsNumber, priceCalculation};