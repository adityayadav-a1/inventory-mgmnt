let editingSupplierId = null;

// LOAD SUPPLIERS
function loadSuppliers() {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`/suppliers/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
            let table = document.getElementById("supplierTable");
            table.innerHTML = "";

            data.forEach(s => {
                table.innerHTML += `
                <tr>
                    <td>${s.id}</td>
                    <td>${s.name}</td>
                    <td>${s.contact}</td>
                    <td>${s.address}</td>
                    <td>
                        <button onclick="editSupplier(${s.id}, '${s.name}', '${s.contact}', '${s.address}')">Edit</button>
                        <button onclick="deleteSupplier(${s.id})">Delete</button>
                    </td>
                </tr>
                `;
            });
        });
}

// ADD / UPDATE
function addSupplier() {
    const user = JSON.parse(localStorage.getItem("user"));

    const supplier = {
        name: supplierName.value,
        contact: supplierContact.value,
        address: supplierAddress.value,
        userId: user.id
    };

    let url = "/suppliers";
    let method = "POST";

    if (editingSupplierId) {
        url = "/suppliers/" + editingSupplierId;
        method = "PUT";
    }

    fetch(url, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(supplier)
    })
    .then(async res => {
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            let errMsg = errorData.error;
            if (!errMsg) {
                const values = Object.values(errorData);
                if (values.length > 0) errMsg = values.join("\\n");
            }
            throw new Error(errMsg || "Operation failed");
        }
        return res.json();
    })
    .then(() => {
        alert(editingSupplierId ? "Supplier Updated" : "Supplier Added");

        editingSupplierId = null;

        supplierName.value = "";
        supplierContact.value = "";
        supplierAddress.value = "";

        loadSuppliers();
    })
    .catch(err => alert(err.message));
}

// DELETE
function deleteSupplier(id) {
    const user = JSON.parse(localStorage.getItem("user"));
    fetch(`/suppliers/${id}?userId=${user.id}`, {
        method: "DELETE"
    })
    .then(async res => {
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ timeout: "Operation failed" }));
            throw new Error(errorData.error || "Operation failed");
        }
        alert("Supplier Deleted");
        loadSuppliers();
    })
    .catch(err => alert(err.message));
}

// EDIT
function editSupplier(id, name, contact, address) {
    supplierName.value = name;
    supplierContact.value = contact;
    supplierAddress.value = address;

    editingSupplierId = id;
}