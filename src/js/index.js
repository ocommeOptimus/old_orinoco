import {getData, cartProductsNumber} from "./main";

cartProductsNumber();
let isClicked = false;
let currentParam = 'teddies';

function getItems(param) {
    //Creating the list container
    document.querySelector('#body').style.height = 'auto';
    var loaderIcon = document.createElement('img');
    loaderIcon.classList.add("loader");
    loaderIcon.src = "../../img/loader.svg" ;
    var productsList = document.createElement('div');
    productsList.classList.add("products");
    productsList.id = 'products-list';
    document.querySelector('#homepage').appendChild(productsList);
    productsList.appendChild(loaderIcon);

    //Checking if a button has alrealdy been clicked and which product type is called
    if (isClicked === true && currentParam == param) { //If a button has already been clicked and the product type is different,
        document.getElementById('products-list').remove(); //Deleting the previous products list
    }
    else if (isClicked === false || currentParam !== param) {
        getData("http://localhost:3000/api/" + param)
        .then(function (response) {
            productsList.removeChild(loaderIcon);
            //For each products, we create HTML structure
            response.forEach(function (response) {
                let articleProducts = document.createElement('article');
                let linkProductsPage = document.createElement('a');
                linkProductsPage.classList.add("products__link");
                let idProduct = response._id;
                linkProductsPage.href = 'src/pages/products.html?type=' + param + '&id=' + idProduct;
                let imageProducts = document.createElement('img');
                imageProducts.classList.add("products__img");
                imageProducts.src = response.imageUrl;
                imageProducts.alt = "Photo de l'article : " + response.name;
                imageProducts.title = "Photo de présentation de : " + response.name;
                let divProducts = document.createElement('div');
                divProducts.classList.add("products__info");
                let titleProducts = document.createElement('h2');
                titleProducts.textContent = response.name;
                titleProducts.classList.add("products__title");
                let descriptionProducts = document.createElement('p');
                descriptionProducts.textContent = response.description;
                descriptionProducts.classList.add("products__text");

                //Placing new elements on the index page
                productsList.appendChild(articleProducts);
                articleProducts.appendChild(linkProductsPage);
                linkProductsPage.appendChild(imageProducts);
                articleProducts.appendChild(divProducts);
                divProducts.appendChild(titleProducts);
                divProducts.appendChild(descriptionProducts);

                currentParam = param;
                isClicked = true;
            });
        }).catch();
    }
}

window.getItems = getItems;