// 🌙 Dark Mode by Default
document.body.classList.add("dark");

// 📸 Profile Section
document.addEventListener("DOMContentLoaded", function () {
    const images = [
        "av1.png", "av2.png", "av3.png", "av4.png",
        "av5.png", "av6.png", "av7.png", "av8.png"
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.getElementById("profileImage").src = randomImage;

    const profileContainer = document.getElementById("profile");
    const dialogBox = document.getElementById("dialogBox");

    // Toggle dialog box on profile click
    profileContainer.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent click from triggering the document event
        if (dialogBox.style.opacity === "1") {
            closeDialogBox();
        } else {
            openDialogBox();
        }
    });

    document.addEventListener("click", (event) => {
        if (!dialogBox.contains(event.target) && !profileContainer.contains(event.target)) {
            closeDialogBox();
        }
    });

    function openDialogBox() {
        dialogBox.style.display = "flex";
        setTimeout(() => {
            dialogBox.style.opacity = "1";
            dialogBox.style.transform = "translateY(0)";
        }, 10);
    }

    function closeDialogBox() {
        dialogBox.style.opacity = "0";
        dialogBox.style.transform = "translateY(-10px)";
        setTimeout(() => {
            dialogBox.style.display = "none";
        }, 300);
    }

    // Placeholder for openSettings function
    window.openSettings = function () {
        alert("Settings functionality not implemented yet.");
    };
});

// 🖼️ Image Enhancement Logic
const enhanceForm = document.getElementById("enhanceForm");
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const preview = document.getElementById("preview");
const enhancedPreview = document.getElementById("enhancedPreview");
const enhanceMessage = document.getElementById("enhanceMessage");
const downloadBtn = document.getElementById("downloadBtn");
const loaderOriginal = document.querySelector(".preview-box:nth-child(1) .loader");
const loaderEnhanced = document.querySelector(".preview-box:nth-child(3) .loader");
const imageCountSpan = document.getElementById("imageCount");
const arrow = document.querySelector(".arrow");

// Initialize image count from localStorage
let imageCount = parseInt(localStorage.getItem("imageCount")) || 0;
imageCountSpan.textContent = imageCount;

// Show file name and preview when an image is selected
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
        fileName.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            loaderOriginal.style.display = "block";
            preview.style.display = "none";
            arrow.style.display = "none";
            enhancedPreview.style.display = "none";
            downloadBtn.classList.add("hidden");

            setTimeout(() => {
                loaderOriginal.style.display = "none";
                preview.src = e.target.result;
                preview.style.display = "block";
            }, 2000);
        };
        reader.readAsDataURL(file);
    } else {
        fileName.textContent = "";
        preview.src = "";
        preview.style.display = "none";
    }
});

function showMessage(message, isSuccess = true) {
    enhanceMessage.textContent = message;
    enhanceMessage.style.color = isSuccess ? "green" : "red";
    enhanceMessage.style.opacity = "1";
    setTimeout(() => {
        enhanceMessage.style.opacity = "0";
    }, 3000);
}

enhanceForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(enhanceForm);
    const file = formData.get("file");

    if (!file || file.size === 0) {
        showMessage("Please select an image file!", false);
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showMessage("File size exceeds 5MB limit!", false);
        return;
    }

    try {
        // Show loaders
        loaderOriginal.style.display = "block";
        loaderEnhanced.style.display = "block";
        enhancedPreview.style.display = "none";
        arrow.style.display = "none";
        downloadBtn.classList.add("hidden");

        const response = await fetch("/enhanceImage", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        console.log("Response from /enhanceImage:", data); // Debug log

        if (!response.ok) {
            throw new Error(data.error || "Image enhancement failed");
        }

        // Hide loaders
        loaderOriginal.style.display = "none";
        loaderEnhanced.style.display = "none";

        // Display the enhanced image
        console.log("Setting enhancedPreview.src to:", data.output_url.png); // Debug log
        enhancedPreview.src = data.output_url.png;
        enhancedPreview.style.display = "block";
        enhancedPreview.onerror = () => {
            console.error("Failed to load enhanced image at:", data.output_url.png);
            showMessage("Failed to load enhanced image", false);
        };
        enhancedPreview.onload = () => {
            console.log("Enhanced image loaded successfully");
        };
        arrow.style.display = "block";
        downloadBtn.classList.remove("hidden");

        // Improved download functionality
        downloadBtn.onclick = () => {
            const link = document.createElement("a");
            link.href = data.output_url.png;
            link.download = "enhanced_image.png"; // Set the default filename for download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        // Update image count
        imageCount++;
        imageCountSpan.textContent = imageCount;
        localStorage.setItem("imageCount", imageCount);

        showMessage(data.message, true);
    } catch (error) {
        console.error("Enhance error:", error);
        loaderOriginal.style.display = "none";
        loaderEnhanced.style.display = "none";
        showMessage(`Something went wrong: ${error.message}`, false);
    }
});