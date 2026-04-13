let chart;

// Load default (date-wise)
function loadPurchases() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("User not logged in");
        return;
    }

    fetch(`/purchase/user/${user.id}`)
        .then(res => res.json())
        .then(data => {

            if (!Array.isArray(data)) {
                console.error("Invalid data:", data);
                return;
            }

            let grouped = {};

            data.forEach(s => {
                let date = s.purchaseDate ? s.purchaseDate.split("T")[0] : "Unknown Date";

                if (!grouped[date]) grouped[date] = 0;

                grouped[date] += s.quantity;
            });

            renderTableDate(grouped);

            renderChart(
                Object.keys(grouped),
                Object.values(grouped),
                "Purchases Per Day"
            );
        })
        .catch(err => console.error(err));
}

function renderTableDate(grouped) {
    const head = document.getElementById("tableHead");
    const table = document.getElementById("purchasesTable");

    head.innerHTML = `
        <tr>
            <th>Date</th>
            <th>Total Quantity</th>
        </tr>
    `;

    table.innerHTML = "";

    if (Object.keys(grouped).length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="2">No purchases made</td>
            </tr>
        `;
        renderChart([], [], "No Purchases");
        return;
    }

    Object.keys(grouped).forEach(date => {
        table.innerHTML += `
            <tr>
                <td>${date}</td>
                <td>${grouped[date]}</td>
            </tr>
        `;
    });
}


// Search by date
function searchByDate() {
    const input = document.getElementById("searchDate").value;
    const user = JSON.parse(localStorage.getItem("user"));

    if (!input) {
        alert("Select a date");
        return;
    }

    Promise.all([
        fetch(`/purchase/user/${user.id}`).then(res => res.json()),
        fetch(`/products/user/${user.id}`).then(res => res.json())
    ])
    .then(([purchaseData, productData]) => {

        if (!Array.isArray(purchaseData)) {
            console.error("Purchase data is not array:", purchaseData);
            return;
        }

        // Map productId → name
        let productMap = {};
        productData.forEach(p => {
            productMap[p.id] = p.name;
        });

        // Filter by date
        let filtered = purchaseData.filter(s =>
            (input === "") || (s.purchaseDate && s.purchaseDate.startsWith(input)) || (!s.purchaseDate && input === "Unknown Date")
        );

        // Group by product
        let grouped = {};

        filtered.forEach(s => {
            if (!grouped[s.productId]) {
                grouped[s.productId] = {
                    name: productMap[s.productId] || "Unknown",
                    qty: 0
                };
            }
            grouped[s.productId].qty += s.quantity;
        });

        renderTableProductFull(grouped);

        renderChart(
            Object.values(grouped).map(g => g.name),
            Object.values(grouped).map(g => g.qty),
            "Product Purchases"
        );
    })
    .catch(err => console.error(err));
}


// Table (product view — full)
function renderTableProductFull(grouped) {
    const head = document.getElementById("tableHead");
    const table = document.getElementById("purchasesTable");

    head.innerHTML = `
        <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Quantity Purchased</th>
        </tr>
    `;

    table.innerHTML = "";

    const keys = Object.keys(grouped);

    if (keys.length === 0) {
        table.innerHTML = "<tr><td colspan='3'>No data</td></tr>";
        return;
    }

    keys.forEach(id => {
        table.innerHTML += `
            <tr>
                <td>${id}</td>
                <td>${grouped[id].name}</td>
                <td>${grouped[id].qty}</td>
            </tr>
        `;
    });
}


// Chart
function renderChart(labels, values, labelName) {
    const canvas = document.getElementById("purchasesChart");

    if (!canvas) return;

    if (chart) chart.destroy();

    if (labels.length === 0) {
        chart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ["No Data"],
                datasets: [{
                    label: "No Purchases",
                    data: [0],
                    backgroundColor: '#ccc'
                }]
            }
        });
        return;
    }

    chart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: labelName,
                data: values,
                backgroundColor: '#3498db'
            }]
        }
    });
}