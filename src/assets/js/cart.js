import {cartProductsNumber, myPopUp, priceCalculation, sending} from "./main";
import Swal from "sweetalert2";

cartProductsNumber();

//Getting products stored in localStorage
let productsAddedToCart = JSON.parse(localStorage.getItem('cart'));

//Creating the cart display
let titleCart           = document.createElement('h1');
let sectionCart         = document.createElement('section');

titleCart.textContent   = "Panier";
titleCart.className     = "presentation__title";

document.querySelector('#cart').appendChild(titleCart);
document.querySelector('#cart').appendChild(sectionCart);


//If there is product(s) added in the localStorage
if (productsAddedToCart !== null) {
    sectionCart.className       = "cart__products";
    for (let i in productsAddedToCart) {

        //Creating each product display
        let articlesCart        = document.createElement('article');
        let idProductCart       = document.createElement('p');
        articlesCart.className  = 'cart__products-details';
        idProductCart.textContent = 'Ref. n° : ' + productsAddedToCart[i].id;

        //Possibility to go back on product page by clicking on its image
        let linkProductsPageCart = document.createElement('a');
        linkProductsPageCart.href = '../pages/products.html?type=' + productsAddedToCart[i].param + '&id=' + productsAddedToCart[i].id;

        //Creating different elements to describe products
        let imageProductsCart   = document.createElement('img');
        let divProductsCart     = document.createElement('div');
        let titleProductsCart   = document.createElement('h3');
        imageProductsCart.src   = productsAddedToCart[i].imgUrl;
        imageProductsCart.alt   = "Photo " + productsAddedToCart[i].name;
        imageProductsCart.title = "Photo de " + productsAddedToCart[i].name;
        imageProductsCart.className = "cart__products-image";
        divProductsCart.className = "cart__products-description";
        titleProductsCart.className = "cart__products-title";
        titleProductsCart.textContent = productsAddedToCart[i].name;

        //Getting the price of each product and converting it in euro
        let priceProductsCart   = document.createElement('p');
        let priceLengthCart     = productsAddedToCart[i].price;
        priceCalculation(priceLengthCart, priceProductsCart, 'Prix : ');

        //Quantity chose on product's page
        let divQuantity         = document.createElement('div');
        let quantityProductsCart = document.createElement('p');
        let divButtonQuantity   = document.createElement('div');
        divQuantity.className   = "cart__products-quantity";
        quantityProductsCart.textContent = "Quantité : " + productsAddedToCart[i].quantity;
        
        //Creating a button to increase a product's quantity
        let buttonMore          = document.createElement('button');
        buttonMore.className    = "cart__products-btn-quantity";
        buttonMore.textContent  = "+";
        buttonMore.addEventListener('click', function (event) {
            //Increasing product's quantity, updating localStorage and reloading cart's page
            productsAddedToCart[i].quantity++;
            localStorage.setItem('cart', JSON.stringify(productsAddedToCart));
            location.reload();
        });

        //Creating button to reduce a product's quantity
        let buttonLess          = document.createElement('button');
        buttonLess.className    = "cart__products-btn-quantity";
        buttonLess.textContent  = "-";
        buttonLess.addEventListener('click', function (event) {
            if (productsAddedToCart[i].quantity === 1) { //if quantity left of the product equals one and we want to reduce it
                //Popup for product deletion
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    },
                })
                swalWithBootstrapButtons.fire({
                    title: 'Êtes-vous sûr(e) ?',
                    text: `Vous allez supprimer ${productsAddedToCart[i].name} du panier !`,
                    showCancelButton: true,
                    confirmButtonText: 'Supprimer',
                    confirmButtonColor: '#D70000',
                    cancelButtonText: 'Annuler',
                    cancelButtonColor: '#009D9D'
                }).then((result) => {
                    if (result.value) {
                        //Popup for confirmed deletion
                        myPopUp('success', 'L\'article a été supprimé !', `${productsAddedToCart[i].name} n'est plus dans votre panier`, '2000')
                        setTimeout(function () {
                            productsAddedToCart.splice([i], 1);  //deleting that product of local storage
                            localStorage.setItem('cart', JSON.stringify(productsAddedToCart)); //updating the localStorage
                            location.reload(); //Reloading the cart page
                            if (productsAddedToCart.length === 0) { //If all products have been deleted
                                localStorage.clear(); //Clearing localStorage
                                location.reload(); //Reloading cart page
                            }
                        }, 2200)
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        //Popup for cancelled deletion
                        myPopUp('success', 'L\'article a été conservé',`Vous pouvez commander ${productsAddedToCart[i].name}`, '2000')
                    }
                })
            } else { //Else, reducing product's quantity, updating localStorage and reloading cart's page
                productsAddedToCart[i].quantity--;
                localStorage.setItem('cart', JSON.stringify(productsAddedToCart));
                location.reload();
            }
        });
        //Calculating total price by product depending on quantity chose
        let totalPriceByProducts = document.createElement('p');
        totalPriceByProducts.className = "cart__products-price";
        let totalPriceCalculation = productsAddedToCart[i].price * productsAddedToCart[i].quantity;
        priceCalculation(totalPriceCalculation, totalPriceByProducts, 'Prix Total : ');

        //Placing new elements in cart page
        sectionCart.appendChild(articlesCart);
        articlesCart.appendChild(linkProductsPageCart);
        linkProductsPageCart.appendChild(imageProductsCart);
        articlesCart.appendChild(divProductsCart);
        divProductsCart.appendChild(titleProductsCart);
        divProductsCart.appendChild(idProductCart);
        divProductsCart.appendChild(priceProductsCart);
        divProductsCart.appendChild(divQuantity);
        divQuantity.appendChild(quantityProductsCart);
        divQuantity.appendChild(divButtonQuantity);
        divButtonQuantity.appendChild(buttonMore);
        divButtonQuantity.appendChild(buttonLess);
        divProductsCart.appendChild(totalPriceByProducts);
    }

    //Calculating the total order price
    let calculationTotalOrder = 0;
    for (let j in productsAddedToCart) {
        calculationTotalOrder += productsAddedToCart[j].price * productsAddedToCart[j].quantity;
    }
    let totalOrder = document.createElement('h3');
    totalOrder.className = "cart__total";
    priceCalculation(calculationTotalOrder, totalOrder, 'Prix total de la commande : ');
    sectionCart.appendChild(totalOrder);
}

let orderIds = [];
class OrderConfirm {
    constructor(id, param){
        this.id = id;
        this.param = param;
    }
}

//Calling promise for POST request
sending()

//If there is product(s) added in localStorage creating form
if (productsAddedToCart !== null) { 
    let sectionForm             = document.createElement('section');
    let titleForm               = document.createElement('h2');
    let divForm                 = document.createElement('form');
    
    divForm.className           = "cart__form";
    divForm.id                  = "form"
    titleForm.className         = "cart__form-title";
    titleForm.textContent       = "Finalisez votre commande !";
    sectionForm.className       = "cart__form-section";
    
    divForm.innerHTML           = 
                    `<div class="cart__form-fields">\n
                        <label for="lastName">Nom * : </label>\n
                            <input type="text" name="lastName" id="lastName" class="cart__form-input" required placeholder="Nom" pattern="^[A-Z]{1}[a-z\ ]+$" onkeyup="this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1).toLowerCase();">\n
                    </div>\n
                    <div class="cart__form-fields">\n
                        <label for="firstName">Prénom * : </label>\n
                            <input type="text" name="firstName" id="firstName" class="cart__form-input" required placeholder="Prénom" pattern="^[A-Z]{1}[A-Za-zÀ-ÿ\ -]+$" onkeyup="this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1).toLowerCase();">\n
                    </div>\n
                    <div class="cart__form-fields">\n
                        <label for="address">Adresse * : </label>\n
                            <input type="text" name="address" id="address" class="cart__form-input" required placeholder="N° et nom de la rue/avenue" pattern="^[0-9]{1,4}[ ,-][ A-Za-zÀ-ÿ0-9\-]+$" onkeyup="this.value = this.value.toLowerCase();">\n
                    </div>\n
                    <div class="cart__form-fields">\n
                        <label for="city">Ville * : </label>\n
                            <input type="text" name="city" id="city" class="cart__form-input" required placeholder="Ville" pattern="^[A-Z]{1}[a-zA-Z\- ]+$" onkeyup="this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1).toLowerCase();">\n
                    </div>\n
                    <div class="cart__form-fields">\n
                    <label for="phone">Téléphone <span>(facultatif)</span> : </label>\n
                        <input type="" name="phone" id="phone" class="cart__form-input" placeholder="Téléphone" pattern="^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$" onkeyup="this.value = this.value.charAt(0).toUpperCase() + this.value.slice(1).toLowerCase();">\n
                    </div>\n
                    <div class="cart__form-fields">\n
                        <label for="email">Email * : </label>\n
                            <input type="email" name="email" id="email" class="cart__form-input" required placeholder="Email" pattern='^[A-Za-z0-9](([_\\.\\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\\.\\-]?[a-zA-Z0-9]+)*)\\.([A-Za-z]{2,})+$' onkeyup="this.value = this.value.toLowerCase();">\n
                     </div>\n
                     <div class="cart__form-fields">\n
                        <button type="button" id='btn-submit' class="cart__form-btn">Validez votre commande</button>\n
                     </div>\n
                     <p class="cart__form-required">Les champs marqués d'un * sont obligatoires</p>\n
                     `;

    //Placing form in cart page
    document.querySelector('#cart').appendChild(sectionForm);
    sectionForm.appendChild(titleForm);
    sectionForm.appendChild(divForm);

    //Adding an event listener on the submit button
    document.querySelector('#btn-submit').addEventListener('click', function (event) {
        //Creating class for sending contact infos
        class Contact {
            constructor(firstName, lastName, address, city, email) {
                this.firstName  = firstName;
                this.lastName   = lastName;
                this.address    = address;
                this.city       = city;
                this.email      = email;
            }
        }
        //Creating a class to post contact's object and product's array to server
        class FormSent {
            constructor(user, products) {
                this.contact    = user;
                this.products   = products;
            }
        }
        //Creating a class to easily add product purchased info
        class Confirm {
            constructor(param, id, quantity) {
                this.param      = param;
                this.id         = id;
                this.quantity   = quantity;
            }
        }
        //Initializing array for products Ordered
        let productsOrdered = [];
        //Checking the form validity
        if (!document.querySelector('#form').checkValidity()) {
            //Form isn't valid: preventing the submit and show an error message
            event.preventDefault();
            myPopUp('error', 'Formulaire invalide','Merci de bien renseigner tous les champs du formulaire !', '2000');
        } else {
            //Form is valid: creating the user contact infos
            let newContact = new Contact(document.querySelector('#firstName').value, document.querySelector('#lastName').value, document.querySelector('#address').value, document.querySelector('#city').value, document.querySelector('#email').value);

            //Initializing an array to push the Confirm class into it
            let confirm = [];

            for (let l in productsAddedToCart) {
                //if it's the first time we have this type of product, we create sub array
                if (typeof productsOrdered[productsAddedToCart[l].param] == "undefined") {
                    productsOrdered[productsAddedToCart[l].param] = [];
                }
                //we push product on dedicate subarray
                productsOrdered[productsAddedToCart[l].param].push(productsAddedToCart[l].id.toString());
                confirm.push(new Confirm(productsAddedToCart[l].param, productsAddedToCart[l].id, productsAddedToCart[l].quantity));
            }

            //Initializing an array to get the param used to the POST request and adding it to orderIds (see main.js)
            let paramOrder = [];

            //sending the POST request for all products' type
            for (let i in productsOrdered) {
                paramOrder.push(i);
                localStorage.setItem('paramOrder', JSON.stringify(paramOrder));

                sending("http://localhost:3000/api/" + i + "/order", new FormSent(newContact, productsOrdered[i])).then(function(){
                    //Checking the number of order's Id we're supposed to get and then redirecting to the confirmation page
                    if(Object.keys(productsOrdered).length === orderIds.length){
                            localStorage.setItem('confirm', JSON.stringify(confirm));
                            localStorage.removeItem('cart');
                            window.location.href = "./confirmation.html";
                    }
                });
            }
        }
    });
}

if (productsAddedToCart === null) { //If the cart is empty, creating a button to go back to homepage
    let textEmptyCart                   = document.createElement('h2');
    textEmptyCart.textContent           = "Votre panier est vide !!";
    textEmptyCart.className             = "cart__empty-title";
    sectionCart.id                      = "cart-empty";

    //Creating button to go back to Homepage
    let buttonReturnHomepage            = document.createElement('button');
    buttonReturnHomepage.textContent    = "Nos produits";
    buttonReturnHomepage.className      = "cart__home-btn"
    buttonReturnHomepage.addEventListener('click', function (event) {
        window.location.href = "../../index.html";
    });

    //Placing all elements in the cart page
    sectionCart.appendChild(textEmptyCart);
    sectionCart.appendChild(buttonReturnHomepage);
}

export {productsAddedToCart, sectionCart};