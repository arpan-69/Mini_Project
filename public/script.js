document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const originalPreview = document.getElementById("preview");
        const enhancedPreview = document.getElementById("enhancedPreview");
        const loaders = document.querySelectorAll(".loader");
        const enhanceBtn = document.getElementById("enhanceBtn");
        const downloadBtn = document.getElementById("downloadBtn");
        const arrow = document.querySelector(".arrow");

        // Show loading animation
        loaders[0].style.display = "block";
        originalPreview.style.display = "none";
        enhancedPreview.style.display = "none";
        arrow.style.display = "none";
        downloadBtn.classList.add("hidden");

        setTimeout(() => {
            // Stop loading and display the image
            loaders[0].style.display = "none";
            originalPreview.src = e.target.result;
            originalPreview.style.display = "block";
            enhanceBtn.classList.remove("hidden"); // Show Enhance button
        }, 2000);
    };
    reader.readAsDataURL(file);
});

// 🖼️ Sketch Conversion Logic
document.getElementById("enhanceBtn").addEventListener("click", function () {
    const loaders = document.querySelectorAll(".loader");
    const originalPreview = document.getElementById("preview");
    const enhancedPreview = document.getElementById("enhancedPreview");
    const downloadBtn = document.getElementById("downloadBtn");
    const arrow = document.querySelector(".arrow");

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload an image first!");
        return;
    }

    // Show loading animation for enhancement
    loaders[1].style.display = "block";
    enhancedPreview.style.display = "none";
    arrow.style.display = "none";
    downloadBtn.classList.add("hidden");

    // Send image to Flask backend for processing
    const formData = new FormData();
    formData.append("image", file);

    fetch("http://localhost:5000/process_sketch", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server Error: ${response.statusText}`);
        }
        return response.blob();
    })
    .then(blob => {
        const imgURL = URL.createObjectURL(blob);
        enhancedPreview.src = imgURL;
        enhancedPreview.style.display = "block";
        downloadBtn.classList.remove("hidden");
        arrow.style.display = "block";

        // Enable download
        downloadBtn.onclick = function () {
            const a = document.createElement("a");
            a.href = imgURL;
            a.download = "sketch-image.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
    })
    .catch(error => {
        console.error("Error processing image:", error);
        alert("Error processing image. Please try again.");
    })
    .finally(() => {
        loaders[1].style.display = "none"; // Hide loader after completion
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const settingsBtn = document.getElementById("settingsBtn");
    const settingsOptions = document.getElementById("settingsOptions");
    const imgToSketchBtn = document.getElementById("imgToSketchBtn");
    const sketchToImgBtn = document.getElementById("sketchToImgBtn");

    // Toggle dropdown menu
    settingsBtn.addEventListener("click", function () {
        settingsOptions.classList.toggle("hidden");
    });

    // Refresh page on "Sketch to Image" button click
    sketchToImgBtn.addEventListener("click", function () {
        location.reload();
    });

    // Send a request to process_sketch and refresh page
    imgToSketchBtn.addEventListener("click", function () {
        fetch("/process_sketch", {
            method: "POST",
            body: new FormData(), // Assuming an image upload is required
        })
        .then(response => response.blob())
        .then(() => location.reload())
        .catch(error => console.error("Error:", error));
    });

    // Close dropdown if clicked outside
    document.addEventListener("click", function (event) {
        if (!settingsBtn.contains(event.target) && !settingsOptions.contains(event.target)) {
            settingsOptions.classList.add("hidden");
        }
    });
});



// 🌙 Dark Mode by Default
document.body.classList.add("dark");


// 📸 Profile Section
document.addEventListener("DOMContentLoaded", function () {
    const images = [
        "av1.png", "av2.png", "av3.png", "av4.png",
        "av5.png", "av6.png", "av7.png", "av8.png"
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.getElementById("profileImage").src = "/images/profiles/" + randomImage;

    document.getElementById("fileInput").addEventListener("change", function () {
        const fileNameDisplay = document.getElementById("fileName");
        if (this.files.length > 0) {
            fileNameDisplay.textContent = this.files[0].name;
        } else {
            fileNameDisplay.textContent = "";
        }
    });

    const profileContainer = document.getElementById("profile");
    const profileImage = document.getElementById("profileImage");
    const profileName = document.getElementById("profileName");
    const dialogBox = document.getElementById("dialogBox");
    const imageCount = document.getElementById("imageCount");


    // profileContainer.addEventListener("click", () => {
    //   window.location.href = "midroute/middex.html";
    // });

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

    // Fetch User Data from Backend
    // Fetch User Data from Backend
    function fetchUserData() {
        fetch("http://localhost:5000/api/user")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server Error: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                document.getElementById("profileName").textContent = data.name || "User";
            })
            .catch(error => console.error("Error fetching user data:", error));
    }

    fetchUserData();


    // Logout Function
    function logout() {
        fetch("/api/logout", { method: "POST" })
        .then(() => {
            alert("Logged out successfully!");
            window.location.href = "landing/index.html";
        })
        .catch(error => console.error("Logout failed:", error));
    }

    window.logout = logout;
});
