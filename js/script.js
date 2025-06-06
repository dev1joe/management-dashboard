"use strict"; //activating strict mode

// product properties
var productName = document.getElementById('productName');
var nameRegex = /^(?! )[A-Za-z0-9À-ÿ'&.,-]+(?: [A-Za-z0-9À-ÿ'&.,-]+)*$/;
var nameError = document.getElementById('nameError');

var productPrice = document.getElementById('productPrice');
var priceRegex = /^(10000|[1-9][0-9]{3})$/;
var priceError = document.getElementById('priceError');

// TODO: rename to category
// TODO: suitable category regex
var productCategory = document.getElementById('productCategory');
var categoryRegex = /^[A-Za-z0-9À-ÿ'&()\- ]{3,50}$/;
var categoryError = document.getElementById('categoryError');

var productDesc = document.getElementById('productDesc');
var descRegex = /^[A-Za-z0-9À-ÿ.,;:!?'"()\-&%$@#\/ ]{3,500}$/;
var descError = document.getElementById('descError');

// other elements in the page
var tableBody = document.getElementById('tableBody');
var newProductButton = document.getElementById('newButton');
var createButton = document.getElementById('createButton');
var updateButton = document.getElementById('updateButton');
var dataModal = document.getElementById('createModal');
var closeModalButton = document.getElementById('closeButton');
var searchInput = document.getElementById('searchInput');

// [_____ Read and Display Data _____]
var productList = JSON.parse(localStorage.getItem('products')) ?? []
display();

// [_____ Modal Handling _____]
newProductButton.addEventListener('click', () => {
    updateButton.classList.add('d-none');
    createButton.classList.remove('d-none');
});

// [_____ Handling delete and update buttons using event delegation _____]
tableBody.addEventListener('click', function(event){
    const row = event.target.closest('tr');
    const productId = row.dataset.id;

    if (event.target.classList.contains('update-btn')) {
        // handling update button
        console.log('update button clicked!');

        // show data in the form
        productName.value = productList[productId].name;
        productPrice.value = productList[productId].price;
        productCategory.value = productList[productId].type;
        productDesc.value = productList[productId].desc;
        
        // saving product id in update button, important !
        updateButton.setAttribute('data-id', productId);

        createButton.classList.add('d-none');
        updateButton.classList.remove('d-none');

    } else if (event.target.classList.contains('delete-btn')) {
        // handling delete button
        console.log('delete button clicked!');
        deleteProduct(productId);
    }
});

// [_____ Adding event listeners to input fields for validation  _____]
productName.addEventListener('input', () => {validateSingleInput(productName, nameError, nameRegex)})
productPrice.addEventListener('input', () => {validateSingleInput(productPrice, priceError, priceRegex)})
productCategory.addEventListener('input', () => {validateSingleInput(productCategory, categoryError, categoryRegex)})
productDesc.addEventListener('input', () => {validateSingleInput(productDesc, descError, descRegex)})

// [_____ Functions _____]
function display(items) {
    var content = '';
    var i = 0;

    var itemsList = items ?? productList;
    itemsList.forEach(p => {
        content += `<tr data-id="${i}">
                        <th scope="row">${i+1}</th>
                        <td>${p.name}</td>
                        <td>${p.price}</td>
                        <td>${p.type}</td>
                        <td>${p.desc}</td>
                        <td>
                        <button class="btn btn-warning me-1 update-btn" data-bs-toggle="modal" data-bs-target="#createModal">Edit</button>
                        <button class="btn btn-danger delete-btn">Delete</button>
                        </td>
                    </tr>`

        i++;
    });

    tableBody.innerHTML = content;
    console.log('products displayed :)');
}

function updateProduct() {
    if(validateInputs()) {

        // collecting data
        var product = {
            name: productName.value,
            price: productPrice.value,
            type: productCategory.value,
            desc: productDesc.value,
        };
        
        // replacing old data with new data
        var index = updateButton.getAttribute('data-id');
        productList.splice(index, 1, product);
        localStorage.setItem('products', JSON.stringify(productList));
        
        console.log('product updated')
        display();
        resetForm();
        // showCreateButton();
    } else {
        console.log('Errors Found');
    }
}

function deleteProduct(index) {
    productList.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(productList));
    display();
}

function createProduct() {
    if(validateInputs()) {
        console.log('NO Errors');

        // collect data
        var product = {
            name: productName.value,
            price: productPrice.value,
            type: productCategory.value,
            desc: productDesc.value,
        };

        // store data
        productList.push(product);
        localStorage.setItem('products', JSON.stringify(productList));
        
        console.log('product added');
        
        display();
        resetForm();
    } else {
        console.log('Errors Found');
    }
}

function validateInputs() {
    var flag = true;

    if (!validateSingleInput(productName, nameError, nameRegex)) flag = false;
    if (!validateSingleInput(productPrice, priceError, priceRegex)) flag = false;
    if (!validateSingleInput(productCategory, categoryError, categoryRegex)) flag = false;
    if (!validateSingleInput(productDesc, descError, descRegex)) flag = false;

    return flag;
}

function validateSingleInput(inputField, errorField, regex) {
    if (! regex.test(inputField.value)) {
        // validation error
        inputField.classList.remove('is-valid');
        inputField.classList.add('is-invalid');
        errorField.classList.remove('d-none');
        return false;
    } else {
        // NO error
        inputField.classList.remove('is-invalid');
        inputField.classList.add('is-valid');
        errorField.classList.add('d-none');
        return true;
    }
}


function searchProduct() {
    var query = searchInput.value.toLowerCase();
    console.log(query);

    var result = [];

    productList.forEach(p => {
        if(p.name.toLowerCase().includes(query)) {
            result.push(p);
        }
    });

    display(result);
}

function resetForm() {
    productName.value = '';
    productName.classList.remove('is-valid');
    productName.classList.remove('is-invalid');
    nameError.classList.add('d-none');

    productPrice.value = '';
    productPrice.classList.remove('is-valid');
    productPrice.classList.remove('is-invalid');
    priceError.classList.add('d-none');

    productCategory.value = '';
    productCategory.classList.remove('is-valid');
    productCategory.classList.remove('is-invalid');
    categoryError.classList.add('d-none');

    productDesc.value = '';
    productDesc.classList.remove('is-valid');
    productDesc.classList.remove('is-invalid');
    descError.classList.add('d-none');

    closeModalButton.click();

    searchInput.value = '';
}

function showCreateButton() {
    newProductButton.classList.remove('d-none');
    updateButton.classList.add('d-none');
}

function showUpdateButton() {
    updateButton.classList.remove('d-none');
    newProductButton.classList.add('d-none');
}