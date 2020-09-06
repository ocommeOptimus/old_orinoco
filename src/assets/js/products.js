import {urlStr, priceCalculation, cartProductsNumber, getAllOptions, optionQuantity, myPopUp} from "./main";

cartProductsNumber();

let productsDetails             = document.querySelector('#product-details');

let titlePage                   = document.createElement('h1');
let imgLoader                   = document.createElement('img');

titlePage.className             = "presentation__title";

imgLoader.className             = "loader";
imgLoader.src                   = "../../img/loader.svg" ;

productsDetails.appendChild(titlePage);
productsDetails.appendChild(imgLoader);

fetch('http://localhost:3000/api/' + urlStr.get('type') + "/" + urlStr.get("id"))
.then(function (response) {
    if (!response.ok) {
      throw new Error('HTTP error, status = ' + response.status);
    }
    return response.json();
  }).then(function (data) {
    //We remove the loader icon after 0.3s
    setTimeout(function() { productsDetails.removeChild(imgLoader); }, 300);  
    
    //We set an h1 with the name of the product
    titlePage.textContent = "Les " + urlStr.get('type') + " " + data.name;

    //We create HTML structure
    let sectionProducts         = document.createElement('section');
    let imageProducts           = document.createElement('img');
    let divProducts             = document.createElement('div');
    let refProduct              = document.createElement('p');
    let titleProducts           = document.createElement('h2');
    let descriptionProducts     = document.createElement('p');
    let labelSelect             = document.createElement('label');
    let selectProduct           = document.createElement('select');

    sectionProducts.className   = "product-details__section";

    imageProducts.className     = "product-details__img";
    imageProducts.src           = data.imageUrl;
    imageProducts.alt           = "Photo " + urlStr.get('type') + " " + data.name;
    imageProducts.title         = "Photo de présentation " + urlStr.get('type') + " " + data.name;
    
    divProducts.className       = "product-details__info";
    
    titleProducts.textContent   = data.name;
    titleProducts.className     = "product-details__title";
    
    refProduct.textContent      = "Ref: " + data._id;
    refProduct.className        = "product-details__ref";
    
    descriptionProducts.textContent = data.description;
    descriptionProducts.className = "product-details__text";
    
    labelSelect.for             = "option-product";
    labelSelect.textContent     = "Options : ";
    labelSelect.className       = "product-details__options";
    
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

    
    //Calling of the option function with the switch value as parameter
    function getAllOptions(value) {
        data[value].forEach((value, index) => {
            let option = document.createElement('option');
            let optionValue = document.createTextNode(value);
            option.appendChild(optionValue);
            selectProduct.appendChild(option);
        });
    }
    
    getAllOptions(firstProperty);

    //Possibility to choose quantity
    let quantity                = document.createElement('label');
    let selectQuantity          = document.createElement('select');
    
    quantity.for                = "quantity";
    quantity.textContent        = "Quantité : ";
    quantity.className          = "product-details__quantity";
    
    selectQuantity.name         = "quantity";
    selectQuantity.id           = "quantityChoose";

    //Creating the 'select' element by calling the optionQuantity function
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

    optionQuantity();

    let priceProduct = document.createElement('p');
    priceProduct.className = "product-details__price";
    let priceLength = data.price;
    //Converting the price in euro
    priceCalculation(priceLength, priceProduct, `Prix : `);

    //Parametring the buttonCart
    let buttonCart = document.createElement('button');
    buttonCart.className = "product-details__btn";
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
            let firstLine = new Line(urlStr.get('type'), data.imageUrl, data.name, data._id, parseInt(quantityChoose.value), data.price);
            cart.push(firstLine);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            //Popup for product added
            myPopUp('success', 'Felicitations', 'Produit ajouté au panier !', '2000');
            setTimeout(function(){location.reload()}, 2000)
        } else {
            //Else, verifying if the product has already been added
            let cartFill = JSON.parse(localStorage.getItem('cart'));
            let productAlreadyAdded = false;
            for (let k in cartFill) {
                //If the product is already added, we modify its quantity
                if (cartFill[k].id === data._id) {
                    productAlreadyAdded = true;
                    cartFill[k].quantity = parseInt(cartFill[k].quantity) + parseInt(quantityChoose.value);
                    //Popup for modified quantity
                    myPopUp('success', 'Quantite modifiee !', 'Votre choix a bien ete pris en compte !', '2000');
                    console.log(parseInt(cartFill[k].quantity));
                    console.log(parseInt(quantityChoose.value));
                    console.log(cartFill[k].quantity);
                }
            }
            //If the product isn't already added, we add it
            if (!productAlreadyAdded) {
                cartFill.push(new Line(urlStr.get('type'), data.imageUrl, data.name, data._id, parseInt(quantityChoose.value), data.price));
                //Popup for new product added
                myPopUp('success', 'Felicitations', 'Produit ajoute au panier !', '2000');
                setTimeout(function(){location.reload();}, 2000);
            }
            localStorage.setItem('cart', JSON.stringify(cartFill));
        }
    });

    //Placing all elements in the product page
    productsDetails.appendChild(sectionProducts);
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