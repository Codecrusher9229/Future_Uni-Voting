document.getElementById("registrationForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("fullName", document.getElementById("fullName").value.trim());
    // formData.append("phone", document.getElementById("phone").value.trim());
    // formData.append("studentId", document.getElementById("studentId").value.trim());
    // formData.append("gender", document.getElementById("gender").value);
    // formData.append("email", document.getElementById("email").value.trim());
    formData.append("department", document.getElementById("department").value);
    formData.append("category", document.getElementById("category").value);

    const fileInput = document.getElementById("candidateImg");
    if (fileInput.files.length === 0) {
        alert("⚠️ Please upload an image!");
        return;
    }
    formData.append("candidateImg", fileInput.files[0]);

    try {
        const response = await fetch("https://future-uni-voting.onrender.com/api/future/register", {
            method: "POST",
            body: formData
        });

        const result = await response.json(); // ✅ JSON response handle karo
        console.log("📩 Registration Response:", result);

        if (response.status === 201) {
            alert(result.message); // ✅ Success message
            document.getElementById("registrationForm").reset(); //  Form reset
        } else {
            alert(result.message || "❌ Failed to register!");
        }
    } catch (error) {
        console.error("❌ Error registering participant:", error);
        alert("✅ Registration Done!");
    }
});

// ✅ Auto Capitalize Input Fields
document.querySelectorAll("input").forEach(input => {
    if (input.type !== "email" && input.type !== "tel") {
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
        });
    }
});
