// Auth check — redirects to login if not authenticated
function checkAuth() {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/login.html";
    }
}

// Logout
function logout() {
    localStorage.removeItem("user");
    window.location.href = "/login.html";
}

// Back button
function goBack() {
    window.location.href = "/index.html";
}

// Get logged-in user
function getUser() {
    const user = localStorage.getItem("user");
    if (!user) return null;
    return JSON.parse(user);
}