document.addEventListener("DOMContentLoaded", async () => {
    await fetchEvents(); // ✅ Fetch events after DOM is ready

    document.getElementById("registrationForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        // ✅ Start & End Time Validation
        const startTime = new Date("March 20, 2025 08:00:00").getTime();
        const endTime = new Date("April 5, 2025 10:00:00").getTime();
        const now = new Date().getTime();
        

        if (now < startTime) {
            alert("⚠ Registration has not started yet! Please come back on April 4, 2025, at 08:00 AM.");
            return;
        } else if (now > endTime) {
            alert("❌ Registration is now closed! You cannot register after April 5, 2025, 10:00 AM.");
            return;
        }

        // ✅ Form Data Collection
        const fullName = document.getElementById("fullName").value.trim();
        const department = document.getElementById("department").value;
        const studentId = document.getElementById("studentId").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const eventId = document.getElementById("event").value;

        if (!fullName || !department || !studentId || !email || !phone || !eventId) {
            alert("⚠ All fields are required!");
            return;
        }

        const formData = { fullName, department, studentId, email, phone, eventId };

        try {
            const response = await fetch("https://future-uni-voting.onrender.com/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log("📩 Registration Response:", result);

            if (response.ok) {
                alert("✅ Registration successful!"); // ✅ Replace with Toastify for better UI
                document.getElementById("registrationForm").reset();
            } else {
                alert(result.message || "❌ Failed to register!");
            }
        } catch (error) {
            console.error("❌ Error registering participant:", error);
            alert("⚠ Server error, try again later!");
        }
    });
});

// ✅ Fetch Events for Dropdown
async function fetchEvents() {
    try {
        const response = await fetch("https://future-uni-voting.onrender.com/api/events");
        const events = await response.json();

        const eventDropdown = document.getElementById("event");
        eventDropdown.innerHTML = '<option value="">Select an event</option>';

        events.forEach(event => {
            const option = document.createElement("option");
            option.value = event._id;
            option.textContent = `${event.title} - ${new Date(event.date).toDateString()}`;
            eventDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Error fetching events:", error);
    }
}

// ✅ Auto Capitalization for Input Fields
document.querySelectorAll("input").forEach(input => {
    if (input.type !== "email" && input.type !== "tel") {
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
        });
    }
});
