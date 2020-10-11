// STORAGE CONTROLLER
const StorageController = (function () {
    return {
        storeProduct: function (product) {
            let products;

            if (localStorage.getItem('products') === null) {
                products = [];

                products.push(product);
            } else {
                products = JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            localStorage.setItem('products', JSON.stringify(products));
        },
        getProducts: function () {
            let products;

            if (localStorage.getItem('products') === null) {
                products = [];
            } else {
                products = JSON.parse(localStorage.getItem('products'));
            }
            return products;
        },
        updateProduct: function (product) {
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach((prd, index) => {
                if (product.id == prd.id) {
                    products.splice(index, 1, product);
                }
            });
            localStorage.setItem('products', JSON.stringify(products));
        },
        deleteProduct: function (id) {
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach((prd, index) => {
                if (id == prd.id) {
                    products.splice(index, 1,);
                }
            });
            localStorage.setItem('products', JSON.stringify(products));
        }
    }
})();

// PRODUCT CONTROLLER
const ProductController = (function () {

    const Product = function (id, name, price) {
        this.id = id,
            this.name = name,
            this.price = price
    }

    const data = {
        products: StorageController.getProducts(),
        selectedProduct: null,
        totalPrice: 0
    }

    return {
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },
        getProductById: function (id) {
            let product = null;
            data.products.forEach(prd => {
                if (prd.id == id) {
                    product = prd;
                }
            });
            return product;
        },
        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },
        getCurrentProduct: function () {
            return data.selectedProduct;
        },
        addProduct: function (name, price) {
            let id;

            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;
            } else {
                id = 0;
            }

            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },
        updateProduct: function (name, price) {
            let product = null;

            data.products.forEach(prd => {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }
            });

            return product;
        },
        deleteProduct: function (product) {
            data.products.forEach((prd, index) => {
                if (prd.id == product.id) {
                    data.products.splice(index, 1);
                }
            });
        },
        getTotal: function () {
            let total = 0;

            data.products.forEach(item => {
                total += item.price;
            });

            data.totalPrice = total;
            return data.totalPrice;
        }
    }
})();

// UI CONTROLLER
const UIController = (function () {

    const Selectors = {
        productList: '#itemList',
        productListItems: '#itemList tr',
        addButton: '#addBtn',
        updateButton: '#updateBtn',
        deleteButton: '#deleteBtn',
        cancelButton: '#cancelBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        productCard: '#productCard',
        totalTl: '#totalTl',
        totalDolar: '#totalDolar'
    }

    return {
        createProductList(products) {
            let html = '';

            products.forEach(prd => {
                html += `
                    <tr>
                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td>${prd.price} $</td>
                        <td class="text-right">
                            <button type="submit" class="btn btn-warning btn-sm">
                                <i class="far fa-edit edit-product"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function () {
            return Selectors;
        },
        addProduct: function (prd) {

            document.querySelector(Selectors.productCard).style.display = 'block';

            let item = `
                <tr>
                    <td>${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price} $</td>
                    <td class="text-right">
                        <button type="submit" class="btn btn-warning btn-sm">
                            <i class="far fa-edit edit-product"></i>
                        </button>
                    </td>
                </tr>
            `;

            document.querySelector(Selectors.productList).innerHTML += item;
        },
        updateProduct: function (prd) {
            let updatedItem = null;

            let items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(item => {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + ' $';
                    updatedItem = item;
                }
            });

            return updatedItem;
        },
        deleteProduct: function () {
            let items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(item => {
                if (item.classList.contains('bg-warning')) {
                    item.remove();
                }
            });
        },
        clearInputs: function () {
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';
        },
        clearWarnings: function () {
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(item => {
                if (item.classList.contains('bg-warning')) {
                    item.classList.remove('bg-warning');
                }
            });
        },
        hideCard: function () {
            document.querySelector(Selectors.productCard).style.display = 'none';
        },
        showTotal: function (total) {
            document.querySelector(Selectors.totalDolar).textContent = total;
            document.querySelector(Selectors.totalTl).textContent = total * 8;
        },
        addProductToForm: function () {
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },
        addingState: function (item) {
            UIController.clearInputs();
            UIController.clearWarnings();

            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.updateButton).style.display = 'none';
        },
        editState: function (tr) {

            UIController.clearWarnings();

            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.updateButton).style.display = 'inline';
        }
    }
})();

// APP CONTROLLER
const App = (function (ProductCtrl, UICtrl, StorageCtrl) {

    const UISelectors = UICtrl.getSelectors();

    // Load Event Listeners
    const loadEventListeners = function () {

        // Add Product Event
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);

        // Edit Product Click
        document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);

        // Edit Product Submit
        document.querySelector(UISelectors.updateButton).addEventListener('click', productEditSubmit);

        // Cancel Button Click
        document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelUpdate);

        // Delete Product Submit
        document.querySelector(UISelectors.deleteButton).addEventListener('click', deleteProductSubmit);
    }

    // Event Listeners Functions
    const productAddSubmit = function (e) {
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {

            // Add Product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);

            // Add Product to List
            UICtrl.addProduct(newProduct);

            //Add Product to LS
            StorageCtrl.storeProduct(newProduct);

            // Get Total
            const total = ProductCtrl.getTotal();

            // Show Total
            UICtrl.showTotal(total);

            // Clear Inputs
            UICtrl.clearInputs();
        }

        e.preventDefault();
    }

    const productEditClick = function (e) {
        let id;
        let tr;

        if (e.target.classList.contains('edit-product') || e.target.classList.contains('btn')) {
            if (e.target.classList.contains('edit-product')) {
                id = e.target.parentNode.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
                tr = e.target.parentNode.parentNode.parentNode;
            } else if (e.target.classList.contains('btn')) {
                id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
                tr = e.target.parentNode.parentNode;
            }

            // Get Selected Product
            const product = ProductCtrl.getProductById(id);

            // Set Current Product
            ProductCtrl.setCurrentProduct(product);

            // Add Product to UI
            UICtrl.addProductToForm();

            UIController.editState(tr);
        }
        e.preventDefault();
    }

    const productEditSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {

            // Update Product
            const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);

            // Update UI
            let item = UIController.updateProduct(updatedProduct);

            // Get Total
            const total = ProductCtrl.getTotal();

            // Show Total
            UICtrl.showTotal(total);

            // Update LS
            StorageCtrl.updateProduct(updatedProduct);

            UICtrl.addingState();
        }

        e.preventDefault();
    }

    const deleteProductSubmit = function (e) {

        // Get Selected Product
        const selectedProduct = ProductCtrl.getCurrentProduct();

        // Delete Product
        ProductCtrl.deleteProduct(selectedProduct);

        // Delete From UI
        UIController.deleteProduct();

        // Get Total
        const total = ProductCtrl.getTotal();

        // Show Total
        UICtrl.showTotal(total);

        // Delete From Storage
        StorageCtrl.deleteProduct(selectedProduct.id);

        UICtrl.addingState();

        if (total == 0) {
            UICtrl.hideCard();
        }

        e.preventDefault();
    }

    const cancelUpdate = function (e) {

        UICtrl.addingState();

        e.preventDefault();
    }

    return {
        init: function () {
            console.log('Starting App..')
            UICtrl.addingState();
            const products = ProductCtrl.getProducts();

            if (products.length === 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createProductList(products);
            }

            // Get Total
            const total = ProductCtrl.getTotal();

            // Show Total
            UICtrl.showTotal(total);

            // Load Event Listeners
            loadEventListeners();
        }
    }
})(ProductController, UIController, StorageController);

App.init();