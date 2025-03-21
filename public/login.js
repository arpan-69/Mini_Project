const loginForm = document.querySelector(".login-form");
const loginMessage = document.querySelector(".login-message");

function showMessage(element, message, isSuccess = true) {
    element.textContent = message;
    element.style.color = isSuccess ? "green" : "red";
    element.style.opacity = "1";
    setTimeout(() => {
        element.style.opacity = "0";
    }, 3000);
}

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showMessage(loginMessage, "Email and password are required!", false);
        return;
    }

    try {
        const response = await fetch(`/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include", 
        });
    
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Login failed"); 
        }
    
        showMessage(loginMessage, data.message, true);
    
        setTimeout(() => {
            window.location.href = `/choseModel`;
        }, 1500);
    
    } catch (error) {
        console.error("Login error:", error);
        showMessage(loginMessage, "Something went wrong: " + error.message, false);
    }    
});
