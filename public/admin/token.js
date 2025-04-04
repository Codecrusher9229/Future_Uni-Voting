function isTokenExpired(token) {
    if (!token) return true; // No token, so it's expired

    const payload = JSON.parse(atob(token.split(".")[1])); // Decode token
    return payload.exp * 1000 < Date.now(); // Check expiration
}

// Check token on page load
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("adminToken");
    
    if (!token || isTokenExpired(token)) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        window.location.href = "admin-login.html"; // Redirect to login page
    }
});
