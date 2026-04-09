function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Enter username & password");
        return;
    }

    fetch("/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    })
    .then(res => {
        if (!res.ok) throw new Error("Invalid credentials");
        return res.json();
    })
    .then(data => {
        localStorage.setItem("user", JSON.stringify(data));
        window.location.href = "/index.html";
    })
    .catch(err => alert(err.message));
}