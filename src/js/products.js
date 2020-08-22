import {getData, urlStr, priceCalculation, cartProductsNumber, myPopUp} from "./main";

cartProductsNumber();

let titlePage = document.createElement('h1');
titlePage.textContent = "Votre produit :";
titlePage.className = "presentation__title";

let imgLoader = document.createElement('img');
imgLoader.className = "loader";
imgLoader.src = "../../img/loader.svg" ;

document.getElementById('product-details').appendChild(titlePage);
document.getElementById('product-details').appendChild(imgLoader);

getData('http://localhost:3000/api/' + urlStr.get('type') + "/" + urlStr.get("id"))
.then(function (response) {
    document.getElementById('product-details').removeChild(imgLoader);
    let sectionProducts = document.createElement('section');
    let imageProducts = document.createElement('img');
    imageProducts.className = "product-details__img";
    imageProducts.src = response.imageUrl;
    imageProducts.alt = "Photo " + urlStr.get('type') + " " + response.name;
    imageProducts.title = "Photo de présentation " + urlStr.get('type') + " " + response.name;
    let divProducts = document.createElement('div');
    divProducts.className = "product-details__info";
    let titleProducts = document.createElement('h2');
    titleProducts.textContent = response.name;
    titleProducts.className = "product-details__title";
    let refProduct = document.createElement('p');
    refProduct.textContent = "Ref: " + response._id;
    refProduct.className = "product-details__ref";

    let descriptionProducts = document.createElement('p');
    descriptionProducts.textContent = response.description;
    descriptionProducts.className = "product-details__text";

    let labelSelect = document.createElement('label');
    labelSelect.for = "option-product";
    labelSelect.textContent = "Options : ";
    labelSelect.id = "labelOptions";
    let selectProduct = document.createElement('select');

    //Switching option property according to URL's param
    let firstProperty = "";
    switch (urlStr.get('type')) {
        case "teddies":
            firstProperty = 'colors';
            break;
        case "cameras":
            firstProperty = 'lenses';
            break;
        case "furniture":
            firstProperty = "varnish";
            break;
    }

    //Getting all options
    function getAllOptions(value) {
        response[value].forEach((value, index) => {
            let option = document.createElement('option');
            let optionValue = document.createTextNode(value);
            option.appendChild(optionValue);
            selectProduct.appendChild(option);
        });
    }

    //Calling of the option function with the switch value as parameter
    getAllOptions(firstProperty);

    //Possibility to choose quantity
    let quantity = document.createElement('label');
    quantity.for = "quantity";
    quantity.textContent = "Quantité : ";
    quantity.className = "product-details__quantity";
    let selectQuantity = document.createElement('select');
    selectQuantity.name = "quantity";
    selectQuantity.id = "quantityChoose";

    //Creating possibility to choose quantity of each products
    function optionQuantity() {
        let j = 0;
        while (j <= 8) {
            j++;
            let option = document.createElement('option');
            option.textContent = j;
            option.value = j;
            selectQuantity.appendChild(option);
        }
    }
    //Creating the 'select' element by calling the optionQuantity function
    optionQuantity();

    let priceProduct = document.createElement('p');
    let priceLength = response.price;
    //Converting the price in euro
    priceCalculation(priceLength, priceProduct, `Prix : `);

    //Parametring the buttonCart
    let buttonCart = document.createElement('button');
    buttonCart.textContent = 'Ajouter au panier';

    //When clicking on the buttonCart
    buttonCart.addEventListener('click', function (event) {

        //Getting the locally stored item
        let cartUp = JSON.parse(localStorage.getItem('cart'));

        //Creating a new Class to add different products easily in the localStorage item
        class Line {
            constructor(param, imgUrl, name, id, quantity, price) {
                this.param = param;
                this.imgUrl = imgUrl;
                this.name = name;
                this.id = id;
                this.quantity = quantity;
                this.price = price;
            }
        }

        if (cartUp === null) {
            //if this is the first product added, creating new line and stocking it
            let cart = [];
            let firstLine = new Line(urlStr.get('type'), response.imageUrl, response.name, response._id, parseInt(quantityChoose.value), response.price);
            cart.push(firstLine);
            localStorage.setItem('cart', JSON.stringify(cart));
            //Popup for product added
            myPopUp('success', 'Félicitations', 'Produit ajouté au panier !', '2000');
            setTimeout(function(){location.reload();}, 2000);
        } else {
            //Else, verifying if the product has already been added
            let cartFill = JSON.parse(localStorage.getItem('cart'));
            let productAlreadyAdded = false;
            for (let k in cartFill) {
                //If the product is already added, we modify its quantity
                if (cartFill[k].id === response._id) {
                    productAlreadyAdded = true;
                    cartFill[k].quantity = parseInt(cartFill[k].quantity) + parseInt(quantityChoose.value);
                    //Popup for modified quantity
                    myPopUp('success', 'Quantité modifiée !', 'Votre choix a bien été pris en compte !', '2000');
                    setTimeout(function(){location.reload();}, 2000);
                }
            }
            //If the product isn't already added, we add it
            if (!productAlreadyAdded) {
                cartFill.push(new Line(urlStr.get('type'), response.imageUrl, response.name, response._id, parseInt(quantityChoose.value), response.price));
                //Popup for new product added
                myPopUp('success', 'Félicitations', 'Produit ajouté au panier !', '2000');
                setTimeout(function(){location.reload();}, 2000);
            }
            localStorage.setItem('cart', JSON.stringify(cartFill));
        }
    });

    //Placing all elements in the product page
    document.getElementById('product-details').appendChild(sectionProducts);
    sectionProducts.appendChild(imageProducts);
    sectionProducts.appendChild(divProducts);
    divProducts.appendChild(titleProducts);
    divProducts.appendChild(refProduct);
    divProducts.appendChild(descriptionProducts);
    divProducts.appendChild(labelSelect);
    labelSelect.appendChild(selectProduct);
    divProducts.appendChild(quantity);
    quantity.appendChild(selectQuantity);
    divProducts.appendChild(priceProduct);
    divProducts.appendChild(buttonCart);
});