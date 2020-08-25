import {getData, cartProductsNumber} from "./main";

cartProductsNumber();
let isClicked    = false;
let currentParam = 'teddies';

function getItems(param) {
  //Creating the list container
  document.querySelector('#catalog').style.height = 'auto';
  var loaderIcon = document.createElement('img');
  loaderIcon.classList.add('loader');
  loaderIcon.src   = '../../img/loader.svg';
  var productsList = document.createElement('div');
  productsList.classList.add('products');
  productsList.id = 'products-list';
  document.querySelector('#catalog').appendChild(productsList);
  productsList.appendChild(loaderIcon);
  
  //Checking if a button has alrealdy been clicked and which product type is called
  if (isClicked === false || currentParam !== param) {
    if (isClicked === true) { //If a button has already been clicked and the product type is different,
        document.querySelector('#products-list').remove(); //Deleting the previous products list
    }
    fetch('http://localhost:3000/api/' + param).then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP error, status = ' + response.status);
      }
      return response.json();
    }).then(function (json) {
      //For each products, we create HTML structure
      document.querySelector('.loader').remove();
      for (let obj of json) {
        console.log(obj.name);
      let articleProducts     = document.createElement('article');
      let linkProductsPage    = document.createElement('a');
      let imageProducts       = document.createElement('img');
      let divProducts         = document.createElement('div');
      let titleProducts       = document.createElement('h2');
      let descriptionProducts = document.createElement('p');
      
      let idProduct         = obj._id;
      linkProductsPage.classList.add('products__link');
      linkProductsPage.href = 'src/pages/products.html?type=' + param + '&id=' + idProduct;
      
      imageProducts.classList.add('products__img');
      imageProducts.src   = obj.imageUrl;
      imageProducts.alt   = 'Photo de l\'article : ' + obj.name;
      imageProducts.title = 'Photo de présentation de : ' + obj.name;
      
      divProducts.classList.add('products__info');
      titleProducts.textContent = obj.name;
      titleProducts.classList.add('products__title');
      descriptionProducts.textContent = obj.description;
      descriptionProducts.classList.add('products__text');
      
      //Placing new elements on the index page
      productsList.appendChild(articleProducts);
      articleProducts.appendChild(linkProductsPage);
      linkProductsPage.appendChild(imageProducts);
      articleProducts.appendChild(divProducts);
      divProducts.appendChild(titleProducts);
      divProducts.appendChild(descriptionProducts);
      
      currentParam = param;
      isClicked    = true; }
    }).catch(function (error) {
      console.log(error);
    });
  }
}
window.getItems = getItems;