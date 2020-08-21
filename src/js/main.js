import retrieveContent from './query.js';
import Swal from "sweetalert2";

async function showContent() {
  try {
    const content = await retrieveContent();

    let elt = document.createElement('div');
    elt.innerHTML = content.join('<br />');

    document.getElementsByTagName('body')[0].appendChild(elt);
  } catch (e) {
    console.log('Error', e);
  }
}

showContent();

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

//Get the request data
function getData(url){ 
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
          return JSON.parse(this.responseText);
      } else {
        myPopUp('error', 'Erreur' + this.status, 'Une erreur est survenue, merci de réessayer ultérieurement', '2000')
        setTimeout(function(){location.reload()}, 3000), "/error.html";
      }
  };
  request.open("GET", url);
  request.send();
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

export {myPopUp, getData, urlStr, cartProductsNumber};