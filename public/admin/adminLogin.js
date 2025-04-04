document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("adminLoginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("http://localhost:5000/api/admin/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();

                if (response.ok) {
                    localStorage.setItem("adminToken", result.token);
                    alert("✅ Login successful!");
                    window.location.href = "admin.html"; // Redirect to admin dashboard
                } else {
                    document.getElementById("loginMessage").textContent = result.message;
                    document.getElementById("loginMessage").style.color = "red";
                }
            } catch (error) {
                console.error("Login error:", error);
                document.getElementById("loginMessage").textContent = "Server error, try again later!";
                document.getElementById("loginMessage").style.color = "red";
            }
        });
    }
});

// Logout function
function logout() {
    localStorage.removeItem("adminToken");
    alert("✅ Logged out successfully!");
    window.location.href = "/adminLogin.html";
}
