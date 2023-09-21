const itemsPerPage = 12; // 每页显示的数据条目数量
let currentPage = 1; // 当前页数
let productsList = []; // 存储所有产品信息的数组
let selectedProduct = null; // 存储选中的产品信息的变量
let selectedRow = null; // 存储选中的行元素
let selectedView = null; // 存储预览的行元素

// show products
fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
        productsList = data["products"];
        displayPage(currentPage);
    })
    .catch(error => {
        console.log('Error:', error);
    });

function displayPage(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = productsList.slice(startIndex, endIndex);

    const tbody = document.getElementById('data');
    tbody.innerHTML = '';

    pageProducts.forEach(product => {
        const row = document.createElement('tr');
        row.addEventListener('click', () => selectRow(row, product)); // 添加点击事件监听器

        const idCell = document.createElement('td');
        idCell.textContent = product.id;
        row.appendChild(idCell);

        const titleCell = document.createElement('td');
        titleCell.textContent = product.title;
        row.appendChild(titleCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = product.price;
        row.appendChild(priceCell);

        const ratingCell = document.createElement('td');
        ratingCell.textContent = product.rating;
        row.appendChild(ratingCell);
        
        const categoryCell = document.createElement('td');
        categoryCell.textContent = product.category;
        row.appendChild(categoryCell);

        const stockCell = document.createElement('td');
        stockCell.textContent = product.stock;
        row.appendChild(stockCell);

        const commandCell = document.createElement('td');
        const viewLink = document.createElement('a');
        viewLink.textContent = 'View';
        viewLink.classList.add('command-link');
        viewLink.classList.add('view-link');
        viewLink.addEventListener('click', () => displayViewDialog(product));
        commandCell.appendChild(viewLink);

        const editLink = document.createElement('a');
        editLink.textContent = 'Edit';
        editLink.classList.add('command-link');
        editLink.classList.add('edit-link');
        editLink.addEventListener('click', () => displayEditDialog(product));
        commandCell.appendChild(editLink);

        row.appendChild(commandCell);

        tbody.appendChild(row);
    });

    updatePageInfo(page);
}

function updatePageInfo(page) {
    const totalItems = productsList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const pageInfo = document.getElementById('pageInfo');
    pageInfo.textContent = `第 ${page} 页，共 ${totalItems} 条，每页显示 ${itemsPerPage} 条`;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
    }
}

function nextPage() {
    const totalItems = productsList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        displayPage(currentPage);
    }
}

function selectRow(row, product) {
    if (selectedRow) {
        selectedRow.classList.remove('selectedProduct'); // 移除之前选中行的样式
    }

    selectedRow = row;
    selectedRow.classList.add('selectedProduct'); // 添加选中行的样式

    selectedProduct = product;
    console.log(selectedProduct);
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.getElementsByTagName('input');

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }
}

function displayMask() {
    const mask = document.querySelector('.mask');
    mask.classList.remove('hidden');
}

function hiddenMask() {
    const mask = document.querySelector('.mask');
    mask.classList.add('hidden');
}

function displayAddDialog() {
    const addDialog = document.querySelector('.add-dialog');
    addDialog.classList.remove('hidden');

    displayMask();
}

function hiddenAddDialog() {
    const addDialog = document.querySelector('.add-dialog');
    addDialog.classList.add('hidden');
    clearForm('add-form');

    hiddenMask();
}

function addProduct() {
    const id = document.getElementById('id').value;
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const rating = document.getElementById('rating').value;
    const category = document.getElementById('category').value;
    const stock = document.getElementById('stock').value;

    const newProduct = {
        id: id,
        title: title,
        price: price,
        rating: rating,
        category: category,
        stock: stock
    };

    fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        displayPage(currentPage);
        hiddenAddDialog();
    })
    .catch(error => {
        console.log('Error:', error);
    });

    clearForm('add-form')
}

function updateProduct() {
    const id = document.querySelector('.edit-id').value;
    const title = document.querySelector('.edit-title').value;
    const price = document.querySelector('.edit-price').value;
    const rating = document.querySelector('.edit-rating').value;
    const category = document.querySelector('.edit-category').value;
    const stock = document.querySelector('.edit-stock').value;

    const editProduct = {
        title: title,
        price: price,
        rating: rating,
        category: category,
        stock: stock
    };

    fetch(`https://dummyjson.com/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProduct)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        displayPage(currentPage);
        hiddenEditDialog();
    })
    .catch(error => {
        console.log('Error:', error);
    });

    clearForm('edit-form')
}

function deleteProduct() {
    if (selectedProduct && selectedProduct.id) {
        const id = selectedProduct.id;
        fetch(`https://dummyjson.com/products/${id}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(console.log);
    } else {
        console.log("请选中一个产品！");
    }
}

function displayViewDialog(product) {
    selectedView = product;

    const viewDialog = document.querySelector('.view-dialog');
    viewDialog.classList.remove('hidden');
    displayMask();

    const selectedId = selectedView.id;
    const selectedTitle = selectedView.title;
    const selectedDescription = selectedView.description;
    const selectedPrice = selectedView.price;
    const selectedRating = selectedView.rating;
    const selectedCategory = selectedView.category;
    const selectedStock = selectedView.stock;

    const idSpan = document.querySelector('.view-id');
    const titleSpan = document.querySelector('.view-title');
    const descriptionSpan = document.querySelector('.view-description');
    const priceSpan = document.querySelector('.view-price');
    const ratingSpan = document.querySelector('.view-rating');
    const categorySpan = document.querySelector('.view-category');
    const stockSpan = document.querySelector('.view-stock');

    idSpan.textContent = selectedId;
    titleSpan.textContent = selectedTitle;
    descriptionSpan.textContent = selectedDescription;
    priceSpan.textContent = selectedPrice;
    ratingSpan.textContent = selectedRating;
    categorySpan.textContent = selectedCategory;
    stockSpan.textContent = selectedStock;
}

function hiddenViewDialog() {
    const viewDialog = document.querySelector('.view-dialog');
    viewDialog.classList.add('hidden');

    hiddenMask();
}

function displayEditDialog(product) {
    selectedView = product;

    console.log(selectedView);

    const editDialog = document.querySelector('.edit-dialog');
    editDialog.classList.remove('hidden');
    displayMask();

    const selectedId = selectedView.id;
    const selectedTitle = selectedView.title;
    const selectedPrice = selectedView.price;
    const selectedRating = selectedView.rating;
    const selectedCategory = selectedView.category;
    const selectedStock = selectedView.stock;

    const idInput = document.querySelector('.edit-id');
    console.log(idInput);
    const titleInput = document.querySelector('.edit-title');
    const priceInput = document.querySelector('.edit-price');
    const ratingInput = document.querySelector('.edit-rating');
    const categoryInput = document.querySelector('.edit-category');
    const stockInput = document.querySelector('.edit-stock');

    idInput.value = selectedId;
    titleInput.value = selectedTitle;
    priceInput.value = selectedPrice;
    ratingInput.value = selectedRating;
    categoryInput.value = selectedCategory;
    stockInput.value = selectedStock;
}

function hiddenEditDialog() {
    const viewDialog = document.querySelector('.edit-dialog');
    viewDialog.classList.add('hidden');

    hiddenMask();
}