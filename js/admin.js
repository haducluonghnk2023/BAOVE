// ===================== COMMON DEFINE ==================== 
// Formatter VND
const formatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
})

// Auto Generate ID
// Hàm để tạo UUID v4
function generateUUIDV4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// ==================== DATABASE ==========================
let DATABASE = localStorage.getItem('DATABASE') ? JSON.parse(localStorage.getItem('DATABASE')) : {
    // ACCOUNTS: [
    //     // Đặt vai trò mặc định của người dùng là ADMIN
    //     {
    //         ID: generateUUIDV4(),
    //         username: "Hạ Đức Lương",
    //         phoneNumber: "0392096054",
    //         address: "Phú Thọ",
    //         email: "admin@gmail.com",
    //         password: "123",
    //         role: "Admin"
    //     }
    // ],
    ACCOUNTS:  JSON.parse(localStorage.getItem("ACCOUNTS")) || [],
    ORDERS: JSON.parse(localStorage.getItem("ORDERS")) || [],
    PRODUCTS: JSON.parse(localStorage.getItem("PRODUCTS")) || [],
};
let {PRODUCTS, ACCOUNTS, ORDERS } = DATABASE;
localStorage.setItem('PRODUCTS', JSON.stringify(PRODUCTS));
localStorage.setItem('ACCOUNTS', JSON.stringify(ACCOUNTS));
localStorage.setItem('ORDERS', JSON.stringify(ORDERS));
// localStorage.setItem('ADMIN',JSON.stringify(ADMIN));


// localStorage.setItem('DATABASE', JSON.stringify(DATABASE));
// Lấy các bảng để sử dụng
// let PRODUCTS = DATABASE.PRODUCTS;
// let ACCOUNTS = DATABASE.ACCOUNTS;
// let ORDERS = DATABASE.ORDERS;


// ********************************* Generate DATA ********************************

// let generate = document.getElementById('generate');
// generate.addEventListener('click', generateData);

// function generateData() {
//     // read json file
//     $.getJSON("./js/data.json", function (data) {
//         DATABASE.PRODUCTS = data.PRODUCTS;
//         localStorage.setItem('DATABASE', JSON.stringify(DATABASE));
//         location.reload();
//     });
// }


// Lấy reference của button và dropdown select
let addButton = document.getElementById('btnn');
let selectDropdown = document.getElementById('category');
let inputField = document.getElementById('ab');

document.addEventListener('DOMContentLoaded', function() {
    loadCategoriesFromLocalStorage();
});

// Sự kiện click cho nút "Thêm"
addButton.addEventListener('click', function() {
    console.log(888);
    // đặt lại chỗ hàm render
    // renderCategoriesToTable();
        // Lấy giá trị từ ô input
        let inputValue = inputField.value.trim();
        if (inputValue === '') {
            alert("Danh mục không hợp lệ! Vui lòng nhập giá trị.");
            return; // Dừng lại nếu giá trị trống
        }
        // Kiểm tra xem giá trị đã tồn tại trong dropdown chưa
        let optionExists = Array.from(selectDropdown.options).some(option => option.text === inputValue);

        // Nếu giá trị không tồn tại trong dropdown, thêm mới
        if (!optionExists) {
            let id = generateUUIDV4();
            let newOption = new Option(inputValue, inputValue);
            selectDropdown.add(newOption);
            inputField.value = ''; // Làm trống ô input sau khi thêm
            // Lưu giá trị vào Local Storage
            saveCategoryToLocalStorage(id,inputValue);
             // Hiển thị Snackbar
            showSnackbar("Đã thêm thành công!");
        } else {
            showSnackbar('Danh mục đã tồn tại!')
        }
        renderCategoriesToTable();
});

// Hàm render danh sách danh mục từ Local Storage
function renderCategoriesFromLocalStorage() {
    let selectDropdown = document.getElementById('category');
    // selectDropdown.innerHTML = ''; // Xóa tất cả các option hiện có trong dropdown
    
    let CATEGORIES = JSON.parse(localStorage.getItem('CATEGORIES')) || [];

    // Tạo các option cho dropdown từ danh sách danh mục trong Local Storage
    CATEGORIES.forEach(function(category) {
        let option = document.createElement('option');
        option.value = category.ID; // Sét giá trị của option là ID của danh mục
        option.textContent = category.category; // Sét nội dung của option là tên danh mục
        selectDropdown.appendChild(option); // Thêm option vào dropdown
    });
}


// Gọi hàm render khi trang được tải
// document.addEventListener('DOMContentLoaded', function() {
//     renderCategoriesFromLocalStorage();
// });

// Hàm lưu giá trị vào Local Storage

function saveCategoryToLocalStorage(id,category,xoa) {
    let CATEGORIES = JSON.parse(localStorage.getItem('CATEGORIES')) || [];
    CATEGORIES.push({ID:id,name:category});
    localStorage.setItem('CATEGORIES', JSON.stringify(CATEGORIES));
}
// Hàm load danh sách danh mục từ Local Storage
function loadCategoriesFromLocalStorage() {
    selectDropdown.innerHTML = '';
    let CATEGORIES = JSON.parse(localStorage.getItem('CATEGORIES')) || [];
    for (let category of CATEGORIES) {
        let newOption = new Option(category.name);
        selectDropdown.add(newOption);
    }
}
// Hàm hiển thị Snackbar
function showSnackbar(message) {
    let snackbar = document.getElementById('snackbar');
    snackbar.textContent = message;
    snackbar.className = "show"; // Hiển thị Snackbar
    setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000); // Ẩn Snackbar sau 3 giây
}



// ========================================= PRODUCT MANAGER ===========================================


// Declare form input
let stt = document.getElementById('stt');
let code = document.getElementById('code');
let category = document.getElementById('category');
let name = document.getElementById('name');
let material = document.getElementById('material');
let price = document.getElementById('price');
let amount = document.getElementById('amount');
let entry = document.getElementById('entry');
let image = document.getElementById("image");


// Element Define
let tbody = document.getElementById('tbody');
let renderPagation = document.getElementsByClassName('pagination')[0]; 
let currentPage = 1;
window.onload = loadProductManager();

function loadProductManager() {
    let itemPerPage = 6; // Số lượng sản phẩm trên mỗi trang
    let totalPage = Math.ceil(PRODUCTS.length / itemPerPage);
    let start = (currentPage - 1) * itemPerPage;
    let end = currentPage * itemPerPage;
    tbody.innerHTML = '';
    renderPagation.innerHTML = '';
    renderePagation();
    PRODUCTS.forEach((product, index) => {
        if (index >= start && index < end) {
            renderProduct(product, index);
        }
    });

    // Thêm sự kiện click cho các nút phân trang
    let pageLinks = renderPagation.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
            let pageNumber = parseInt(this.textContent); // Lấy số trang từ nội dung của nút
            console.log(pageNumber);
            currentPage = pageNumber; // Cập nhật trang hiện tại
            loadProductManager(); // Tải lại dữ liệu cho trang mới
        });
    });
}

// Hàm để hiển thị sản phẩm và cập nhật số thứ tự
function renderProduct(product, index) {
    // console.log(product);
    // Tạo một chuỗi HTML để chèn vào tbody
    let newRow = `
        <tr>
            <td>${index + 1}</td>
            <td>${product.code}</td>    
            <td><img width="120" height="80" src="images/${product.image}"></td>
            <td>${product.productName}</td>
            <td>${product.idcategory === "Jordan" ? "Jordan" : product.idcategory === "nikes" ? "nikes" : product.idcategory === "adidas" ? "adidas": product.idcategory === "gucci" ? "gucci": product.idcategory === "yeezy" ? "yeezy": "oders brands"}</td>
            <td>${formatter.format(product.price)}</td>
            <td>${product.material}</td>
            <td>${product.amount}</td>
            <td>${product.entry}</td>
            <td class="text-center">
                <i class="fas fa-trash-alt text-danger" data-code="${product.code}" id="delete"></i>
                <i class="fas fa-edit text-info" data-code="${product.code}" id="edit"></i>
                <i class="fas fa-info-circle text-success" data-code="${product.code}" id="detail" data-toggle="modal" data-target="#productModal"></i>
            </td>
        </tr>
    `;
    // Chèn chuỗi HTML vào tbody
    tbody.innerHTML += newRow;
}

function renderePagation(){
    renderPagation.innerHTML = 
                                `
                                            <nav id="navbar" aria-label="Page navigation example" >
                                                <ul class="pagination justify-content-center">
                                                    <li class="page-item">
                                                        <a class="page-link" href="#" aria-label="Previous">
                                                            <span aria-hidden="true">&laquo;</span>
                                                        </a>
                                                    </li>
                                                    <li class="page-item"><a class="page-link" href="#">1</a></li>
                                                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                                                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                                                    <li class="page-item">
                                                        <a class="page-link" href="#" aria-label="Next">
                                                            <span aria-hidden="true">&raquo;</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </nav>
                                `
}

// Thêm mới sản phẩm
let add_new = document.getElementById('add_new');
add_new.addEventListener('click', actAddProduct);
function actAddProduct() {
    let images = image.value;

    let product = {
        code: code.value,   
        idcategory: category.value,
        productName: name.value,
        material: material.value,
        price: price.value,
        amount: amount.value,
        entry: entry.value,
        image: images.slice(12, images.length)
    }

    if ((validateForm(product) === true) && 
    (checkExistProductCodeAndName(product.code,product.productName) === false) && 
    (checkExistProductName(product.productName) === false)) {
        PRODUCTS.push(product); 
        localStorage.setItem('PRODUCTS', JSON.stringify(PRODUCTS));
        renderProduct(product,PRODUCTS.length - 1);
        notificationAction("Thêm Sản Phẩm Thành Công.", "#12e64b");

        //Xóa dữ liệu đầu vào
        let form_id = document.getElementById('form-id');
        form_id.querySelectorAll('input').forEach(function (input) {
            input.value = '';
            input.style.border = "1px solid #ced4da";
        });
    }
    add_new.disabled = false;
}

// Validate Form
function validateForm(product) {
    if (product.code === "" || product.productName === ""
        || product.material === "" || product.price === ""
        || product.amount === "" || product.entry === "" || product.image === "") {
        notificationAction("Vui Lòng Điền Đầy Đủ Thông Tin.", "#e61212");

        // Lỗi đầu vào
        let form_id = document.getElementById('form-id');
        let form_input = form_id.querySelectorAll('input');

        form_input.forEach(function (input) {
            if (input.value === "") {
                input.style.border = "1px solid red";
            } else {
                input.style.border = "1px solid #ced4da";
            }
        })

        add_new.disabled = true;
        return false;
    }
    return true;
}


// Kiểm tra mã và tên sản phẩm đã tồn tại 
function checkExistProductCodeAndName(code,name) {
    let check = 0;
    PRODUCTS.forEach(function (product) {
        if (product.code === code &&  product.productName === name) {
            notificationAction("Mã hoặc tên Sản Phẩm Đã Tồn Tại.", "#e61212");
            add_new.disabled = true;
            check++;
        }
    })
    if (check > 0) {
        return true;
    } else {
        return false;
    }
}
function checkExistProductName(name) {
    let check = 0;
    PRODUCTS.forEach(function (product) {
        if (product.productName === name) {
            notificationAction("Tên Sản Phẩm Đã Tồn Tại.", "#e61212");
            add_new.disabled = true;
            check++;
        }
    });
    if (check > 0) {
        return true;
    } else {
        return false;
    }
}


// Hiển thi thông báo
let notifi = document.getElementById('notifi');
let notifi_content = document.getElementById('notifi-content');
function notificationAction(content, color) {
    notifi_content.innerHTML = content;
    notifi.style.display = "block";
    notifi.style.width = "270px";
    notifi.style.backgroundColor = color;

    setTimeout(
        function () {
            notifi.style.display = "none";
        }, 3000);
}


// Xóa và cập nhật sản phẩm
tbody.addEventListener('click', actProduct);
function actProduct(event) {
    let ev = event.target;
    let data_code = ev.getAttribute('data-code');
    if (!ev) {
        return;
    }

    // Edit
    if (ev.matches('#edit')) {
        let update = document.getElementById('update');
        let productFilter = PRODUCTS.filter(product => product.code === data_code);

        code.value = productFilter[0].code;
        category.value = productFilter[0].idcategory;
        name.value = productFilter[0].productName;
        material.value = productFilter[0].material;
        price.value = productFilter[0].price;
        amount.value = productFilter[0].amount;
        entry.value = productFilter[0].entry;

        add_new.style.display = "none";
        update.style.display = "inline-block";
        code.disabled = true;
        document.documentElement.scrollTop = 0;
    }
    // Detail
    if (ev.matches('#detail')) {
        let product_detail = document.getElementById('product-detail');
        let productDetail = PRODUCTS.filter(product => product.code === data_code);
        let modals = `
                <h6>${productDetail[0].productName}</h6>
                <p>Code: ${productDetail[0].code} </p>
                <img width="220" height="180" src="images/${productDetail[0].image}" alt="">
                <div class="mt-2">Giá Tiền: ${formatter.format(productDetail[0].price)}</div>
                <div>Ngày Nhập Kho: ${productDetail[0].entry}</div>
        `;
        product_detail.innerHTML = modals;
    }
    // Delete
    if (ev.matches('#delete')) {
        // Hiển thị hộp thoại xác nhận
        let confirmDelete = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
        // Kiểm tra xem người dùng đã xác nhận xóa hay không
        if (confirmDelete) {
            // Xóa sản phẩm khỏi mảng PRODUCTS
            PRODUCTS = PRODUCTS.filter(product => product.code !== data_code);
            // Cập nhật lại localStorage
            localStorage.setItem('PRODUCTS', JSON.stringify(PRODUCTS));
            // Xóa hàng trong bảng
            ev.closest('tr').remove();
            // Cập nhật lại STT cho các sản phẩm còn lại
            updateProductIndex();
            notificationAction("Xóa Sản Phẩm Thành Công.", "#38e867");
        }
    }

}
function updateProductIndex() {
    let rows = tbody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName('td');
        // STT sẽ được cập nhật lại từ 1
        cells[0].textContent = i + 1;
    }
}

// Sửa
let update = document.getElementById('update');
update.addEventListener('click', actUpdate);
function actUpdate() {
    PRODUCTS.forEach(function (product) {
        if (product.code === code.value) {
            let images = image.value;
            product.idcategory = category.value;
            product.productName = name.value;
            product.material = material.value;
            product.price = price.value;
            product.amount = amount.value;
            product.entry = entry.value;
            if (images !== '') {
                product.image = images.slice(12, images.length);
            }
            localStorage.setItem('PRODUCTS', JSON.stringify(PRODUCTS));
            location.reload();
            notificationAction("Cập Nhật Sản Phẩm Thành Công.", "#1216e6");
        }
    })
}

// Search
let search = document.getElementById("search");
search.addEventListener('input', actSearch);
function actSearch() {
    let searchInput = search.value;
    let productCompare = PRODUCTS.filter(product => searchCompare(searchInput, product.productName));
    tbody.innerHTML = '';
    productCompare.forEach(product => {
        renderProduct(product);
    });
}
// Search Compare
function searchCompare(searchInput, productName) {
    let searchInputLower = searchInput.toLowerCase();
    let productNameLower = productName.toLowerCase();
    return productNameLower.includes(searchInputLower);
}

// ========================================= ACCOUNT MANAGER ===========================================

// Show Tab
let s_product = document.getElementById('s_product');
let s_user = document.getElementById('s_user');
let s_order = document.getElementById('s_order');
let s_category = document.getElementById('s_category');

let product_manager = document.getElementById('product-manager');
let user_manager = document.getElementById('user-manager');
let order_manager = document.getElementById('order-manager');
let category_manager = document.getElementById('category-manager');

let pageLink = document.querySelectorAll('.page-link'); 


s_product.addEventListener('click', showProductManager);
s_user.addEventListener('click', showUserManager);
s_order.addEventListener('click', showOrderManager);
s_category.addEventListener('click', showCategoryManager);

// document.addEventListener('DOMContentLoaded', function() {
//     // Hiển thị trang quản lý danh mục khi trang được tải lần đầu
//     showCategoryManager();
// });

function showProductManager() {
    document.getElementsByClassName("pagination")[0].style.display = 'block';
    product_manager.style.display = 'block';
    user_manager.style.display = 'none';
    order_manager.style.display = 'none';
    category_manager.style.display = 'none';
    loadProductManager(PRODUCTS);
}

function showUserManager() {
    document.getElementsByClassName("pagination")[0].style.display = 'none';

    user_manager.style.display = 'block';
    product_manager.style.display = 'none';
    order_manager.style.display = 'none';
    category_manager.style.display = 'none';
    renderAccount();
}

function showOrderManager() {
    document.getElementsByClassName("pagination")[0].style.display = 'none';

    product_manager.style.display = 'none';
    user_manager.style.display = 'none';
    order_manager.style.display = 'block';
    category_manager.style.display = 'none';
    renderOrder();
}
function showCategoryManager(){
    document.getElementsByClassName("pagination")[0].style.display = 'none';

    product_manager.style.display = 'none';
    user_manager.style.display = 'none';
    order_manager.style.display = 'none';
    category_manager.style.display = 'block';
    //  renderCategoriesToTable();
}

// ========================================= OPEN TAB MANAGER ===========================================

let user_tbody = document.getElementById('user_tbody');
function renderAccount() {
    let contents = '';
    ACCOUNTS.forEach(account => {
        contents += `
            <tr>
                <th scope="row">${account.ID}</th>
                <td>${account.username}</td>
                <td>${account.phoneNumber}</td>
                <td>${account.address}</td>
                <td>${account.email}</td>
                <td>${account.role}</td>
                <td>${account.status}</td>
            </tr>`;
    })
    user_tbody.innerHTML = contents;
}

// ==========================================CATEGORY ==============================
function renderCategoriesToTable() {
    // Lấy reference của tbody
    let CATEGORIES = JSON.parse(localStorage.getItem('CATEGORIES')) || [];
    let html="";
    let count=1;
    for (let i = 0; i < CATEGORIES.length; i++) {
      html +=
                `
                <tr>
                    <th scope="col">${count++}</th>
                    <th scope="col">${CATEGORIES[i].ID}</th>
                    <th scope="col">${CATEGORIES[i].name}</th>
                    
                </tr>
                `
        
    }
    document.getElementById("category_tbody").innerHTML=html
    
}
renderCategoriesToTable()

// Sử dụng hàm này sau khi có dữ liệu categories
// renderCategoriesToTable(categories);

// ========================================= ORDER MANAGER ===========================================
let order_tbody = document.getElementById('order_tbody');

function renderOrder() {
    let contents = '';
    let orderIndex = 0; // Biến đếm số thứ tự
    ORDERS.forEach(order => {
        orderIndex++; // Tăng biến đếm số thứ tự lên mỗi lần lặp
        let options = '';
        if (order.status === "Đặt Hàng") {
            options = `
                <option value="Đặt hàng" selected>Đặt hàng</option>
                <option value="Giao hàng thành công">Giao hàng thành công</option>`
        } else {
            options = `
                <option value="Đặt Hàng">Đặt Hàng</option>
                <option value="Giao Hàng Thành Công" selected>Giao Hàng Thành Công</option>`
        }
        contents += `
            <tr>
                <th scope="row">${orderIndex}</th> <!-- Hiển thị số thứ tự -->
                <th scope="row">${order.orderId}</th>
                <th scope="row">${order.userID}</th>
                <td>${order.createDate}</td>
                <td>${order.payMethod}</td>
                <td> 
                    <select class="form-control" id="orderStatus" data-id="${order.orderId}">
                        ${options}
                    </select>
                </td>
                <td>
                    <i class="fas fa-calendar-week text-info" data-code="${order.orderId}" id="order-detail" data-toggle="modal" data-target="#orderModal"></i>
                </td>
            </tr>`;
    })
    order_tbody.innerHTML = contents;

    actOrderDetail();
    actUpdateOrderStatus();
}

// Gọi hàm renderOrder để hiển thị danh sách đơn hàng khi trang được tải
renderOrder();


function actOrderDetail() {
    let order_detail = document.querySelectorAll('#order-detail');
   
    order_detail.forEach(orderbtn => {
        orderbtn.addEventListener('click', renderOrderDetail);
    })

    function renderOrderDetail() {
        let data_code = this.getAttribute('data-code');
        ORDERS.forEach(o => {
            if (o.orderId == data_code) {
                renderCustomerOrderInfor(o);
            }
        })
    }
}

function renderCustomerOrderInfor(order) {
    let customer_info = document.getElementById('customer-info');
    let customer = order.customerInfo;

    customer_info.innerHTML = `
        <div class="col-2">
            <p>Tên Khách Hàng: </p>
            <p>Số Điện Thoại: </p>
            <p>Thư Điện Tử: </p>
            <p>Địa Chỉ Giao Hàng:</p>
            <p>Ghi Chú: </p>
        </div>
        <div class="col-7">
            <p>${customer.customerName}</p>
            <p>${customer.customerNumber}</p>
            <p>${customer.customerEmail}</p>
            <p>${customer.customerAddress}</p>
            <p>${customer.customerNote}</p>
        </div>
        <div class="col-3">
            <div class="bg-light p-2">
                <p>Mã Hóa Đơn: #${order.orderId}</p>
                <p>Ngày Tạo: ${order.createDate}</p>
            </div>
        </div>
        <div class="col-6">
            <p>Phương Thức Thanh Toán</p>
        </div>
        <div class="col-6">
            <p>${order.payMethod}</p>
        </div>
    `;
    renderCustomerProductInfo(order);
}

function renderCustomerProductInfo(order) {
    let customer_product = document.getElementById('customer-product');
    let total_order = document.getElementById('total-order');
    let contents = ``;
    let products = order.products;
    let total = 0;
    products.forEach(p => {
        contents += `
        <tr>
            <td>
                <img width="50" height="25" src="images/${p.image}" alt="">
            </td>
            <td>
              ${p.productName}  
            </td>
            <td>
              ${formatter.format(p.price)}
            </td>
            <td class="text-center">
              ${p.quantity}  
            </td>
            <td>
              ${formatter.format(p.quantity * p.price)} 
            </td>
        </tr>`;

        total += p.quantity * p.price;
    })

    customer_product.innerHTML = contents;
    total_order.innerText = `${formatter.format(total)}`;
}

function actUpdateOrderStatus() {
    let orderStatuss = document.querySelectorAll('#orderStatus');

    orderStatuss.forEach(orderStatus => {
        orderStatus.addEventListener('change', function () {
            ORDERS.forEach(order => {
                if (order.orderId === orderStatus.getAttribute('data-id')) {
                    order.status = orderStatus.value;
                    localStorage.setItem('ORDERS', JSON.stringify(ORDERS));
                }
            })
        });
    })

}

// Hàm để render dữ liệu của khách hàng và cập nhật số thứ tự
function renderAccount() {
    let contents = '';
    ACCOUNTS.forEach((account,index) => {
        const customerIndex = index + 1; // Tăng số thứ tự lên 1 cho mỗi khách hàng
        contents += `
            <tr>
                <th scope="row">${customerIndex}</th>
                <td>${account.ID}</td>
                <td>${account.username}</td>
                <td>${account.phoneNumber}</td>
                <td>${account.address}</td>
                <td>${account.email}</td>
                <td>${account.role}</td>
                <td>
                <button class="btn btn-primary" onclick="lockUnlockAccount('${account.ID}')">${account.status === 'true' ? 'Khóa' : ' Mở khóa'}</button>
            </td>
            </tr>
            `;
    });
    user_tbody.innerHTML = contents;
}
// Gọi hàm renderAccount() khi trang được tải
window.onload = function() {
    renderAccount(); // Render dữ liệu của khách hàng
};
// Hàm xử lý sự kiện khi nhấn nút "Khóa" hoặc "Mở khóa"
function lockUnlockAccount(accountID) {
    let account = ACCOUNTS.find(account => account.ID === accountID);
    if (account) {
        account.status = account.status === 'true' ? 'false' : 'true';
        // Cập nhật trạng thái của tài khoản trong localStorage
        localStorage.setItem('ACCOUNTS', JSON.stringify(ACCOUNTS));
        renderAccount();
    }
}
