document.addEventListener("DOMContentLoaded", () => {
    // FAQ Toggle with Animation
    document.querySelectorAll(".faq-question").forEach(button => {
        button.addEventListener("click", () => {
            const answer = button.nextElementSibling;
            const isOpen = answer.style.display === "block";

            document.querySelectorAll(".faq-answer").forEach(p => {
                p.style.display = "none";
                p.style.opacity = "0";
            });

            document.querySelectorAll(".plus").forEach(span => {
                span.style.transform = "rotate(0deg)";
            });

            if (!isOpen) {
                answer.style.display = "block";
                setTimeout(() => {
                    answer.style.opacity = "1";
                }, 100);
                button.querySelector(".plus").style.transform = "rotate(45deg)";
            }
        });
    });

    // Contact Form Submission with JSON
    document.getElementById("contact-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitButton = document.querySelector(".btn");
        submitButton.textContent = "Sending...";
        submitButton.disabled = true;

        const formData = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            message: document.getElementById("message").value.trim()
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Failed to send message.");
            }

            alert("Your message has been sent!");
            document.getElementById("contact-form").reset();
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            submitButton.textContent = "Submit";
            submitButton.disabled = false;
        }
    });

    // Auto-Suggestions for Search Bar
    const searchInput = document.querySelector(".search-bar");
    const suggestions = [
        "How does RenderX work?",
        "Is there a free trial?",
        "What payment methods do you accept?",
        "How to reset my password?",
        "How do I cancel my subscription?",
        "What are the system requirements?"
    ];

    const suggestionBox = document.createElement("div");
    suggestionBox.classList.add("suggestion-box");
    searchInput.parentNode.appendChild(suggestionBox);

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        suggestionBox.innerHTML = "";

        if (query) {
            const filtered = suggestions.filter(s => s.toLowerCase().includes(query));
            filtered.forEach(s => {
                const item = document.createElement("div");
                item.textContent = s;
                item.classList.add("suggestion-item");
                item.addEventListener("click", () => {
                    searchInput.value = s;
                    suggestionBox.innerHTML = "";
                });
                suggestionBox.appendChild(item);
            });
        }
    });

    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target)) {
            suggestionBox.innerHTML = "";
        }
    });
});

