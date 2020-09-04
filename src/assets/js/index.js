import {cartProductsNumber} from "./main";

cartProductsNumber();
let isClicked    = false;
let currentParam = 'teddies';

function getItems(param) { 

  //Checking if a button has alrealdy been clicked and which product type is called
  if (isClicked === false || currentParam !== param) {
    
    //Set the area to show the products
    let catalog = document.querySelector('#catalog');
    
    //Create an div for articles and an img for the loader
    var productsList            = document.createElement('div');
    var loaderIcon              = document.createElement('img');
    let titleProductsType       = document.createElement('h2');
    
    //Add class name for the div and the img created, fix source of the loader 
    productsList.id             = 'products-list';
    productsList.className      = 'products';
    
    loaderIcon.className        = 'loader';
    loaderIcon.src              = '../../img/loader.svg';
    
    titleProductsType.className = 'products__type';
    titleProductsType.textContent = 'Nos ' + param + ' :';
    
    //Add loader icon to the products list
    catalog.appendChild(productsList);
    productsList.appendChild(loaderIcon);
    productsList.appendChild(titleProductsType);
  
    //If a button has already been clicked and the product type is different,
    if (isClicked === true) {

      //Deleting the previous products list  
      document.querySelector('#products-list').remove();
    }
    fetch('http://localhost:3000/api/' + param).then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP error, status = ' + response.status);
      }
      return response.json();
    }).then(function (json) {
      //We remove the loader icon after 0.3s
      setTimeout(function() { document.querySelector('.loader').remove(); }, 300);

      //For each products, we create HTML structure
      for (let obj of json) {
      
      let articleProducts         = document.createElement('article');
      let linkProductsPage        = document.createElement('a');
      let titleLinkProductsPage   = document.createElement('a');
      let imageProducts           = document.createElement('img');
      let divProducts             = document.createElement('div');
      let titleProducts           = document.createElement('h3');
      let descriptionProducts     = document.createElement('p');
      
      articleProducts.className   = 'products__article';

      let idProduct               = obj._id;
      linkProductsPage.className  = 'products__link';
      linkProductsPage.href = 'src/pages/products.html?type=' + param + '&id=' + idProduct;
      
      titleLinkProductsPage.className = 'products__link';
      titleLinkProductsPage.href  = 'src/pages/products.html?type=' + param + '&id=' + idProduct;
      
      imageProducts.className     = 'products__img';
      imageProducts.src           = obj.imageUrl;
      imageProducts.alt           = 'Photo de l\'article : ' + obj.name;
      imageProducts.title         = 'Photo de présentation de : ' + obj.name;
      
      divProducts.className       = 'products__info';
      titleProducts.textContent   = obj.name;
      titleProducts.className     = 'products__title';
      descriptionProducts.textContent = obj.description;
      descriptionProducts.className = 'products__text';
      
      //Placing new elements on the index page
      productsList.appendChild(articleProducts);
      articleProducts.appendChild(linkProductsPage);
      linkProductsPage.appendChild(imageProducts);
      articleProducts.appendChild(divProducts);
      divProducts.appendChild(titleLinkProductsPage);
      titleLinkProductsPage.appendChild(titleProducts);
      divProducts.appendChild(descriptionProducts);
      
      currentParam = param;
      isClicked    = true; }
    }).catch(function (error) {
      console.log(error);
    });
  }
}
window.getItems = getItems;