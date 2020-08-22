import {myPopUp, priceCalculation, getData} from "./main";

myPopUp('success', 'Commande validée !','Merci pour votre commande !', '2000')

//Getting all order's information
let confirmation = JSON.parse(localStorage.getItem('confirm'));
let contact = JSON.parse(localStorage.getItem('contact'));
let orderId = JSON.parse(localStorage.getItem('orderId'));

//Creating the elements above the products purchased
let sectionConfirm = document.createElement('section');
sectionConfirm.className = "order";

let pageTitle = document.createElement('h1');
pageTitle.textContent = "Confirmation de commande";
pageTitle.className = "presentation__title";

//Creating the title of the resume section
let yourOrder = document.createElement('h2');
yourOrder.textContent = "Votre commande";
yourOrder.className = "order__title";


let orderIdText = document.createElement('p');
orderIdText.textContent = "Référence(s) de votre commande : ";
let orderIdList = document.createElement('ul');
for(let i in orderId){
        let newRef = document.createElement('li');
        newRef.textContent = `${orderId[i].param[i]} : ${orderId[i].id}`;
        orderIdList.appendChild(newRef);
}

let thanks = document.createElement('p');
thanks.innerHTML = "Merci <span>" + contact.firstName + " " + contact.lastName + "</span> pour votre commande chez Orinoco !";

let resume = document.createElement('p');
resume.innerHTML = "Un e-mail de confirmation vous sera très prochainement envoyé à <span>" + contact.email + "</span>";

let yourProducts = document.createElement('p');
yourProducts.textContent = "Le(s) produit(s) que vous avez commandé(s) :"
yourProducts.className = "order__products-list";

//Placing all elements on confirmation's page
document.getElementById('confirmation').appendChild(pageTitle);
document.getElementById('confirmation').appendChild(sectionConfirm);
sectionConfirm.appendChild(yourOrder);
sectionConfirm.appendChild(orderIdText);
sectionConfirm.appendChild(orderIdList);
sectionConfirm.appendChild(thanks);
sectionConfirm.appendChild(resume);
sectionConfirm.appendChild(yourProducts);

//Thanks note for users (Placed at the end of the for loop)
let thanksEnd = document.createElement('p');
thanksEnd.className = "order__thanks";
thanksEnd.textContent = "Orinoco vous remercie ! À très bientôt sur notre site !"
//Initializing the order's total price variable (calculate at the end of the for loop)
let priceOrderLength = 0;
let priceOrder = document.createElement('p');
priceOrder.className = "order__total";

//Getting products' info with their types and id, then creating their visualisation
for (let i in confirmation) {
        getData('http://localhost:3000/api/' + confirmation[i].param + "/" + confirmation[i].id)
        .then(function (response) {
                let articleConfirm = document.createElement('article');
                articleConfirm.className = "order__products-info";
                let imageConfirm = document.createElement('img');
                imageConfirm.className = "order__img";
                imageConfirm.src = response.imageUrl;
                imageConfirm.alt = "Photo " + response.name;
                imageConfirm.title = "Photo de " + response.name;
                let divConfirm = document.createElement('div');
                divConfirm.className = "order__products-details"
                let titleConfirm = document.createElement('h2');
                titleConfirm.textContent = response.name;
                titleConfirm.className = "order__products-title";
                let priceConfirm = document.createElement('p');
                let priceConfirmLength = response.price;
                priceConfirm.className = "order__products-price";
                priceCalculation(priceConfirmLength, priceConfirm, 'Prix : ');
                let quantity = document.createElement('p');
                quantity.className = "order__products-quantity";
                quantity.textContent = "Quantité choisie : " + confirmation[i].quantity;
                let totalPriceText = document.createElement('p');
                totalPriceText.className = "order__products-total";
                let totalPriceByProducts = response.price * confirmation[i].quantity;
                priceCalculation(totalPriceByProducts, totalPriceText, 'Prix total pour cet article : ');

                sectionConfirm.appendChild(articleConfirm);
                articleConfirm.appendChild(imageConfirm);
                articleConfirm.appendChild(divConfirm);
                divConfirm.appendChild(titleConfirm);
                divConfirm.appendChild(priceConfirm);
                divConfirm.appendChild(quantity);
                divConfirm.appendChild(totalPriceText);

                //Calculating the order's price and placing it after all products purchased
                priceOrderLength += response.price * confirmation[i].quantity;
                priceCalculation(priceOrderLength, priceOrder, 'Prix de votre commande (TTC) : ');
                sectionConfirm.appendChild(priceOrder);
                sectionConfirm.appendChild(thanksEnd);

        }).catch();
}
window.thanksAlert = thanksAlert;
localStorage.clear();