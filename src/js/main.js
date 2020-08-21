import retrieveContent from './query.js';

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