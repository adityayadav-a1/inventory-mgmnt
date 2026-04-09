function makePurchase() {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch("/purchase", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            productId: +document.getElementById("purchaseProductId").value,
            quantity: +document.getElementById("purchaseQty").value,
            userId: user.id
        })
    })
    .then(async res => {
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Purchase failed");
        }
        return res.json();
    })
    .then(() => {
        alert("Purchase Done");
        loadStock();
    })
    .catch(err => {
        alert(err.message);
    });
}