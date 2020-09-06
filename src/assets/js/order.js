import {priceCalculation} from "./main";
import Swal from "sweetalert2";

Swal.fire({
        icon: 'success',
        title: 'Commande validee',
        text: 'Merci pour votre commande !',
        showConfirmButton: false,
        timer: '3000',
        footer: '<a href="../../index.html">Retour à la page d\'accueil</a>'
})

//Getting all order's information
let confirmation                = JSON.parse(localStorage.getItem('confirm'));
let contact                     = JSON.parse(localStorage.getItem('contact'));
let orderId                     = JSON.parse(localStorage.getItem('orderId'));

//Creating the HTML structure of the order confirmation page
let sectionConfirm              = document.createElement('section');
let pageTitle                   = document.createElement('h1');
let orderIdText                 = document.createElement('p');
let orderIdList                 = document.createElement('ul');
let thanks                      = document.createElement('p');
let resume                      = document.createElement('p');
let yourProducts                = document.createElement('p');

sectionConfirm.className        = "order__section";
pageTitle.className             = "presentation__title";
yourProducts.className          = "order__products-list";

pageTitle.textContent           = "Confirmation de commande";
orderIdText.textContent         = "Référence(s) de votre commande : ";

for(let i in orderId) {
        let newRef = document.createElement('li');
        newRef.textContent = `${orderId[i].param[i]} : ${orderId[i].id}`;
        orderIdList.appendChild(newRef);
}

thanks.innerHTML                = "Merci <span>" + contact.firstName + " " + contact.lastName + "</span> pour votre commande chez Orinoco !";
resume.innerHTML                = "Un e-mail de confirmation vous sera très prochainement envoyé à <span>" + contact.email + "</span>";
yourProducts.textContent        = "Le(s) produit(s) que vous avez commandé(s) :"


//Placing all elements on confirmation's page
document.querySelector('#confirmation').appendChild(pageTitle);
document.querySelector('#confirmation').appendChild(sectionConfirm);
sectionConfirm.appendChild(orderIdText);
sectionConfirm.appendChild(orderIdList);
sectionConfirm.appendChild(thanks);
sectionConfirm.appendChild(resume);
sectionConfirm.appendChild(yourProducts);

//Thanks note for users (Placed at the end of the for loop)
let thanksEnd = document.createElement('p');
thanksEnd.className = "order__thanks";
thanksEnd.textContent = "Orinoco vous remercie ! A tres bientot sur notre site !";

//Initializing the order's total price variable (calculate at the end of the for loop)
let priceOrderLength = 0;
let priceOrder = document.createElement('p');
priceOrder.className = "order__total";

//Getting products' info with their types and id, then creating their visualisation
for (let i in confirmation) {
        fetch('http://localhost:3000/api/' + confirmation[i].param + "/" + confirmation[i].id).then(function (response) {
                if (!response.ok) {
                  throw new Error('HTTP error, status = ' + response.status);
                }
                return response.json();
              }).then(function (data) {
                let articleConfirm              = document.createElement('article');
                let imageConfirm                = document.createElement('img');
                let divConfirm                  = document.createElement('div');
                let titleConfirm                = document.createElement('h2');
                let priceConfirm                = document.createElement('p');
                let quantity                    = document.createElement('p');
                let totalPriceText              = document.createElement('p');

                articleConfirm.className        = "order__products-details";
                imageConfirm.className          = "order__img";
                divConfirm.className            = "order__products-description";
                titleConfirm.className          = "order__products-title";
                priceConfirm.className          = "order__products-price";
                quantity.className              = "order__products-quantity";
                totalPriceText.className        = "order__products-total";

                imageConfirm.src = data.imageUrl;
                imageConfirm.alt = "Photo " + data.name;
                imageConfirm.title = "Photo de " + data.name;
                
                titleConfirm.textContent = data.name;
                
                let priceConfirmLength = data.price;
                priceCalculation(priceConfirmLength, priceConfirm, 'Prix : ');
                
                quantity.textContent = "Quantité choisie : " + confirmation[i].quantity;
                
                let totalPriceByProducts = data.price * confirmation[i].quantity;
                priceCalculation(totalPriceByProducts, totalPriceText, 'Prix total pour cet article : ');

                sectionConfirm.appendChild(articleConfirm);
                articleConfirm.appendChild(imageConfirm);
                articleConfirm.appendChild(divConfirm);
                divConfirm.appendChild(titleConfirm);
                divConfirm.appendChild(priceConfirm);
                divConfirm.appendChild(quantity);
                divConfirm.appendChild(totalPriceText);

                //Calculating the order's price and placing it after all products purchased
                priceOrderLength += data.price * confirmation[i].quantity;
                priceCalculation(priceOrderLength, priceOrder, 'Prix de votre commande (TTC) : ');
                sectionConfirm.appendChild(priceOrder);
                sectionConfirm.appendChild(thanksEnd);

        }).catch();
}
localStorage.clear();