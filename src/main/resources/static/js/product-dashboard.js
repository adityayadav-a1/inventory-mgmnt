let editingId = null;
let chart;

// Load all products
function loadProducts() {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`/products/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
            renderTable(data);
            renderChart(data);
        });
}

// Table
function renderTable(data) {
    const table = document.getElementById("productTable");
    table.innerHTML = "";

    data.forEach(p => {
        table.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>₹ ${p.price}</td>
                <td>${p.supplierId}</td>
                <td>${p.quantity}</td>
                <td>
                    <button onclick="editProduct(${p.id}, '${p.name}', ${p.price}, ${p.quantity}, ${p.supplierId})">Edit</button>
                    <button onclick="deleteProduct(${p.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Save (add / update)
function saveProduct() {
    const user = JSON.parse(localStorage.getItem("user"));

    const product = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        quantity: document.getElementById("quantity").value,
        supplierId: document.getElementById("supplierId").value,
        userId: user.id
    };

    let url = "/products";
    let method = "POST";

    if (editingId) {
        url += "/" + editingId;
        method = "PUT";
    }

    fetch(url, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(product)
    })
    .then(res => {
        if (!res.ok) return res.text().then(t => { throw new Error(t) });
        return res.json();
    })
    .then(() => {
        clearForm();
        loadProducts();
    })
    .catch(err => alert(err.message));
}

// Edit
function editProduct(id, name, price, qty, supplier) {
    editingId = id;

    document.getElementById("name").value = name;
    document.getElementById("price").value = price;
    document.getElementById("quantity").value = qty;
    document.getElementById("supplierId").value = supplier;
}

// Delete
function deleteProduct(id) {
    const user = JSON.parse(localStorage.getItem("user"));
    fetch("/products/" + id + "?userId=" + user.id, { method: "DELETE" })
        .then(() => loadProducts());
}

// Clear form
function clearForm() {
    editingId = null;
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("supplierId").value = "";
}

// Chart
function renderChart(data) {
    const labels = data.map(p => p.name + " (S" + p.supplierId + ")");
    const values = data.map(p => p.quantity);

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("productChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Stock Quantity",
                data: values,
                backgroundColor: values.map(v => v < 5 ? "red" : "green")
            }]
        }
    });
}

// Load suppliers
function loadSuppliers() {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`/suppliers/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("supplierTable");
            table.innerHTML = "";

            if (data.length === 0) {
                table.innerHTML = `
                    <tr>
                        <td colspan="3">No suppliers found</td>
                    </tr>
                `;
                return;
            }

            data.forEach(s => {
                table.innerHTML += `
                    <tr>
                        <td>${s.id}</td>
                        <td>${s.name}</td>
                        <td>${s.contact}</td>
                    </tr>
                `;
            });
        });
}