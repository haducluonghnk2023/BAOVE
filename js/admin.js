// ===================== COMMON DEFINE ==================== 
// Formatter VND
const formatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
})

// Auto Generate ID
function generateUUIDV4() {
    return 'xxx-xxy'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// ==================== DATABASE ==========================
let DATABASE = localStorage.getItem('DATABASE') ? JSON.parse(localStorage.getItem('DATABASE')) : {
    PRODUCTS: [],
    ACCOUNTS: [
        // Set User Default role ADMIN
        {
            ID: generateUUIDV4(),
            username: "Hạ Đức Lương",
            phoneNumber: "00000000000",
            address: "Phú Thọ",
            email: "admin@gmail.com",
            password: "123",
            role: "Admin"
            
        }
    ],
    ORDERS: []
};

localStorage.setItem('DATABASE', JSON.stringify(DATABASE));

// Get table to use
let PRODUCTS = DATABASE.PRODUCTS;
let ACCOUNTS = DATABASE.ACCOUNTS;
let ORDERS = DATABASE.ORDERS;

// ********************************* Generate DATA ********************************

let generate = document.getElementById('generate');
generate.addEventListener('click', generateData);

function generateData() {
    // read json file
    $.getJSON("js/data.json", function (data) {
        DATABASE.PRODUCTS = data.PRODUCTS;
        localStorage.setItem('DATABASE', JSON.stringify(DATABASE));
        location.reload();
    });
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
window.onload = loadProductManager(PRODUCTS);

function loadProductManager(PRODUCTS) {
    PRODUCTS.forEach((product,index) => {
        renderProduct(product,index);
    });
}

// Hàm để hiển thị sản phẩm và cập nhật số thứ tự
function renderProduct(product, index) {
    let newRow = tbody.insertRow();

    // Chèn ô vào hàng mới
    let cellIndex = newRow.insertCell(0); // Chèn ô số thứ tự ở đầu tiên
    let cellCode = newRow.insertCell(1);
    let cellImage = newRow.insertCell(2);
    let cellName = newRow.insertCell(3);
    let cellCategory = newRow.insertCell(4);
    let cellPrice = newRow.insertCell(5);
    let cellMaterial = newRow.insertCell(6);
    let cellAmount = newRow.insertCell(7);
    let cellEntry = newRow.insertCell(8);
    let cellActions = newRow.insertCell(9);

    // Đặt nội dung cho mỗi ô
    cellIndex.textContent = index + 1; // Đặt số thứ tự của sản phẩm
    cellCode.textContent = product.code;
    cellImage.innerHTML = `<img width="120" height="80" src="images/${product.image}">`;
    cellName.textContent = product.productName;
    cellCategory.textContent = product.idcategory === "0" ? "Giày Nam" : product.idcategory === "1" ? "Giày Nữ" : "Phụ Kiện";
    cellPrice.textContent = formatter.format(product.price);
    cellMaterial.textContent = product.material;
    cellAmount.textContent = product.amount;
    cellEntry.textContent = product.entry;
    cellActions.innerHTML = `
    <td class="text-center">
            <i class="fas fa-trash-alt text-danger" data-code="${product.code}" id="delete"></i>
            <i class="fas fa-edit text-info" data-code="${product.code}" id="edit"></i>
            <i class="fas fa-info-circle text-success" data-code="${product.code}" id="detail" data-toggle="modal" data-target="#productModal"></i>
    </td>
`;
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

    if ((validateForm(product) === true) && (checkExistProductCode(product.code) === false)) {
        PRODUCTS.push(product);
        localStorage.setItem('DATABASE', JSON.stringify(DATABASE));
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


// Kiểm tra mã sản phẩm đã tồn tại 
function checkExistProductCode(code) {
    let check = 0;
    PRODUCTS.forEach(function (product) {
        if (product.code === code) {
            notificationAction("Mã Sản Phẩm Đã Tồn Tại.", "#e61212");
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
        // Xóa sản phẩm khỏi mảng PRODUCTS
        PRODUCTS = PRODUCTS.filter(product => product.code !== data_code);
        // Cập nhật lại localStorage
        DATABASE.PRODUCTS = PRODUCTS;
        localStorage.setItem('DATABASE', JSON.stringify(DATABASE));
        // Xóa hàng trong bảng
        ev.closest('tr').remove();
        // Cập nhật lại STT cho các sản phẩm còn lại
        updateProductIndex();
        notificationAction("Xóa Sản Phẩm Thành Công.", "#38e867");
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
            localStorage.setItem('DATABASE', JSON.stringify(DATABASE));
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

let categoriess = document.getElementById('category');

s_product.addEventListener('click', showProductManager);
s_user.addEventListener('click', showUserManager);
s_order.addEventListener('click', showOrderManager);

function showProductManager() {
    product_manager.style.display = 'block';
    user_manager.style.display = 'none';
    order_manager.style.display = 'none';
   

}

function showUserManager() {
    product_manager.style.display = 'none';
    user_manager.style.display = 'block';
    order_manager.style.display = 'none';
  
    renderAccount();
}

function showOrderManager() {
    product_manager.style.display = 'none';
    user_manager.style.display = 'none';
    order_manager.style.display = 'block';
    
    renderOrder();
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
                    localStorage.setItem('DATABASE', JSON.stringify(DATABASE));
                }
            })
        });
    })

}

// Biến toàn cục để lưu trữ số thứ tự hiện tại của khách hàng


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
                <button class="btn btn-primary" onclick="lockUnlockAccount('${account.ID}')">${account.status === 'Active' ? 'Mở Khóa' : ' khóa'}</button>
            </td>
            </tr>`;
    });
    user_tbody.innerHTML = contents;
}

// Gọi hàm renderAccount() khi trang được tải
window.onload = function() {
    renderAccount(); // Render dữ liệu của khách hàng
};

// Hàm xử lý sự kiện khi nhấn nút "Khóa" hoặc "Mở khóa"
function lockUnlockAccount(accountID, index) {
    let account = ACCOUNTS.find(account => account.ID === accountID);
    if (account) {
        account.status = account.status === 'Active' ? 'Locked' : 'Active';
        // Cập nhật trạng thái của tài khoản trong localStorage
        localStorage.setItem('ACCOUNTS', JSON.stringify(ACCOUNTS));
        renderAccount();
    }
}

