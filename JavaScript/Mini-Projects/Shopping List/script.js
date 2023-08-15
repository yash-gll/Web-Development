const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clear = document.getElementById('clear');
const filter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;


//DISPLAY ITEMS FROM STORAGE
function displayItemFromSTorage(){
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));
    checkUI();
}

//ADD ITEM TO LIST
function createNewItem(e){
    e.preventDefault();
    const newItem = itemInput.value;
    if(newItem === ''){
        alert('Please add an item');
        return;
    }
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }
    else{
        if(checkIfItemExists(newItem)){
            alert('This item already exists!!');
            return;
        }
        else{
            
        }
    }
    if(checkIfItemExists(newItem) === false){
        addItemToDOM(newItem);
        addItemToStorage(newItem);
    }
    else{
        alert('This item already exists!!');
    }
    
    checkUI();
    itemInput.value = '';
    
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemFromStorage();
    return itemsFromStorage.includes(item);
}

function addItemToDOM(item){
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    itemList.appendChild(li);
}

function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
    
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);

    return button;
}

function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item){
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

//REMOVE ITEM FROM LIST
function onClickItem(e){
    if (e.target.parentElement.classList.contains('remove-item')){
        if(confirm('Are you sure you want to remove this item?')){
            removeItem(e.target.parentElement.parentElement);
        }
    }
    else{
        setItemToEdit(e.target);
    }
}
function removeItem(item){
    item.remove();
    removeItemFromStorage(item.textContent);
    checkUI();
}
function removeItemFromStorage(item){
    let itemsFromStorage = getItemFromStorage();
    itemsFromStorage = itemsFromStorage.filter((i)=> i !== item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function setItemToEdit(item){
    isEditMode = true;
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class = "fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
    removeItemFromStorage(item.textContent);
    itemInput.addEventListener('input', (e) => {
        changeText(e, item);
    });
}
function changeText(e, item){
    item.textContent = (e.target.value);
}
//REMOVE ALL ITEMS FROM LIST
function clearItems(e){
    if(confirm('Are you sure you want to all the items?')){
        while (itemList.firstChild){
            itemList.firstChild.remove();
        }
        checkUI();
    }
    localStorage.removeItem('items');
}

//FILTER ITEMS
function filterItems(e){
    const items = itemList.querySelectorAll('li');
    items.forEach(function(item){
        if(item.innerText.toLowerCase().includes(e.target.value.toLowerCase())){
            item.style.display = 'flex';
        }
        else{
            item.style.display = 'none';
        }
    });
}

// DYNAMICALLY REMOVE CLEAR AND FILTER
function checkUI(){
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        clear.style.display = 'none';
        filter.style.display = 'none';
    }
    else{
        clear.style.display = 'block';
        filter.style.display = 'block';
    }
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    isEditMode = false;
}

//GET ITEMS FROM STORAGE
function getItemFromStorage(){
    let itemsFromStorage;
    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    }
    else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

//EVENT LISTENERS

//Add Item to List
function init(){
    itemForm.addEventListener('submit', createNewItem);
    itemList.addEventListener('click', onClickItem);
    clear.addEventListener('click', clearItems);
    filter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItemFromSTorage);
    checkUI();
}

init();