function loadStock() {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`/products/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
            renderTable(data);
            updateChart(data);
        });
}

// SEARCH
function search() {
    const id = document.getElementById("searchId").value;
    const name = document.getElementById("searchName").value.toLowerCase();
    const supplier = document.getElementById("searchSupplier").value;

    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`/products/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
            const filtered = data.filter(p => {
                return (
                    (id === "" || p.id == id) &&
                    (name === "" || p.name.toLowerCase().includes(name)) &&
                    (supplier === "" || p.supplierId == supplier)
                );
            });

            renderTable(filtered);
            updateChart(filtered);
        });
}

function renderTable(data) {
    const table = document.getElementById("stockTable");
    table.innerHTML = "";

    data.forEach(p => {
        table.innerHTML += `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.supplierId}</td>
            <td>${p.quantity}</td>
        </tr>`;
    });
}

let chart;

function updateChart(data) {
    let labels = data.map(p => p.name + " (S" + p.supplierId + ")");
    let quantities = data.map(p => p.quantity);

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("stockChart"), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Levels',
                data: quantities,
                backgroundColor: quantities.map(q => q < 5 ? 'red' : 'green')
            }]
        }
    });
}