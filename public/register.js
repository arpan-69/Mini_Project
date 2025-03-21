const registerForm = document.querySelector(".register-form");
const registerMessage = document.querySelector(".register-message");

function showMessage(element, message, isSuccess = true) {
    element.textContent = message;
    element.style.color = isSuccess ? "green" : "red";
    element.style.opacity = "1";
    setTimeout(() => {
        element.style.opacity = "0";
    }, 3000);
}

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const agree = document.getElementById("agree").checked;

    if (!username || !email || !password) {
        showMessage(registerMessage, "All fields are required!", false);
        return;
    }
    if (!agree) {
        showMessage(registerMessage, "You must agree to terms & conditions.", false);
        return;
    }

    try {
        const response = await fetch(`/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Registration failed");
        }

        showMessage(registerMessage, data.message, true);

        setTimeout(() => {
            window.location.href = "/login";
        }, 1000);
    } catch (error) {
        console.error("Registration error:", error);
        showMessage(registerMessage, `Something went wrong: ${error.message}`, false);
    }
});