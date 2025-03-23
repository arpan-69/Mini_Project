// DOM Elements
const frames = document.querySelectorAll('.frame');

const progressFill = document.getElementById('progress-fill');
const progressStatus = document.getElementById('progress-status');
const modelCards = document.querySelectorAll('.model-card');
const outputModel = document.getElementById('output-model');
const outputImage = document.getElementById('output-image');
const stepIcons = document.querySelectorAll('.step-icon');
const selectedModelInput = document.getElementById('selected-model');


// Navigation buttons
const next1Button = document.getElementById('next-1');
const next2Button = document.getElementById('next-2');
const back2Button = document.getElementById('back-2');
const startOver3Button = document.getElementById('start-over-3');
const startOver4Button = document.getElementById('start-over-4');

// Variables to store state
let selectedModel = '';
let hasUploadedSketch = false;

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const themeText = document.getElementById('theme-text');
const lightIcon = document.getElementById('light-icon');
const darkIcon = document.getElementById('dark-icon');

// Check for saved theme preference or use system preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme');



// Toggle theme
if (themeToggle) {
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-theme');
        themeText.textContent = 'Light Mode';
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'block';
    } else {
        document.body.classList.remove('dark-theme');
        themeText.textContent = 'Dark Mode';
        lightIcon.style.display = 'block';
        darkIcon.style.display = 'none';
    }

    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            themeText.textContent = 'Dark Mode';
            lightIcon.style.display = 'block';
            darkIcon.style.display = 'none';
        } else {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            themeText.textContent = 'Light Mode';
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
        }
    });
}

const downloadAllButton = document.getElementById('download-all');
downloadAllButton.addEventListener('click', () => {
    const pngLink = document.getElementById('download-png');
    const jpgLink = document.getElementById('download-jpg');
    pngLink.click();
    jpgLink.click();
});
document.querySelectorAll('.model-card').forEach((card, index) => {
    card.style.setProperty('--order', index);
});

// Show a specific frame
function showFrame(frameNumber) {
    frames.forEach((frame, index) => {
        if (index + 1 === frameNumber) {
            frame.classList.add('active');
        } else {
            frame.classList.remove('active');
        }
    });

    // If showing the translation frame, start the progress animation
    if (frameNumber === 3) {
        simulateTranslation();
    }
}

// Reset everything to initial state
function startOver() {
    hasUploadedSketch = false;
    selectedModel = '';
    selectedModelInput.value = '';

    // Reset preview image
    previewImage.src = "{{ url_for('static', filename='placeholder/400/320') }}";
    previewImage.style.display = 'none';

    // Reset upload area
    const uploadArea = document.getElementById('upload-area');
    uploadArea.querySelector('svg').style.display = 'block';
    uploadArea.querySelector('h3').style.display = 'block';
    uploadArea.querySelectorAll('p').forEach(p => p.style.display = 'block');

    // Clear file input
    fileInput.value = '';

    // Reset progress and model selection
    progressFill.style.width = '0';
    progressStatus.textContent = "Processing your sketch...";
    modelCards.forEach(card => card.classList.remove('selected'));
    stepIcons.forEach((icon, index) => {
        if (index === 0) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    });

    showFrame(1);
}

const fileInput = document.getElementById('sketch-upload');
const previewImage = document.getElementById('preview-image');

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            previewImage.src = event.target.result;
            previewImage.style.display = 'block';

            // Hide other elements if needed
            const uploadArea = document.getElementById('upload-area');
            uploadArea.querySelector('svg').style.display = 'none';
            uploadArea.querySelector('h3').style.display = 'none';
            uploadArea.querySelectorAll('p').forEach(p => p.style.display = 'none');
        }
        hasUploadedSketch= true;
        reader.readAsDataURL(file);
    }
});

// Handle model selection
modelCards.forEach(card => {
    card.addEventListener('click', () => {
        modelCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedModel = card.dataset.model;
        outputModel.textContent = card.querySelector('h3').textContent;
        selectedModelInput.value = selectedModel;
    });
});

// Simulate translation process
// function simulateTranslation() {
//     let progress = 0;
//     const interval = setInterval(() => {
//         progress += 1;
//         progressFill.style.width = `${progress}%`;
//
//         // Update steps
//         if (progress === 25) {
//             stepIcons[0].classList.remove('active');
//             stepIcons[1].classList.add('active');
//             progressStatus.textContent = "Processing features...";
//         } else if (progress === 50) {
//             stepIcons[1].classList.remove('active');
//             stepIcons[2].classList.add('active');
//             progressStatus.textContent = "Refining details...";
//         } else if (progress === 75) {
//             stepIcons[2].classList.remove('active');
//             stepIcons[3].classList.add('active');
//             progressStatus.textContent = "Finalizing image...";
//         }
//
//         if (progress >= 100) {
//             clearInterval(interval);
//             // Wait a bit before showing the output
//             //setTimeout(() => {
//             showFrame(4);
//            // }, 500);
//         }
//     }, 140);
// }
// Simulate translation with API response
function simulateTranslation() {
    progressFill.style.width = '0%';
    progressStatus.textContent = "Initializing...";

    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        progressFill.style.width = `${progress}%`;

        if (progress === 25) {
            stepIcons[0].classList.remove('active');
            stepIcons[1].classList.add('active');
            progressStatus.textContent = "Processing features...";
        } else if (progress === 50) {
            stepIcons[1].classList.remove('active');
            stepIcons[2].classList.add('active');
            progressStatus.textContent = "Refining details...";
        } else if (progress === 75) {
            stepIcons[2].classList.remove('active');
            stepIcons[3].classList.add('active');
            progressStatus.textContent = "Finalizing image...";
        }

        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 155);  // Updated to simulate better progress
}


// Navigation button event listeners
next1Button.addEventListener('click', () => {
    if (hasUploadedSketch) {
        showFrame(2);
    } else {
        alert("Please upload a sketch first!");
    }
});

next2Button.addEventListener('click', () => {
    if (selectedModel) {
        showFrame(3);
        const formData = new FormData();
        formData.append("file", fileInput.files[0]);
        formData.append("model", selectedModel);

        fetch("/generate", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.output_url) {
                const outputUrlPng = data.output_url.png;
                const outputUrlJpg = data.output_url.jpg;
                outputImage.src = outputUrlPng;
                outputImage.style.display = "block";

                // Extract filename from the URL for download route
                const pngFilename = outputUrlPng.split('/').pop().split('.')[0];
                const jpgFilename = outputUrlJpg.split('/').pop().split('.')[0];

                // Set download links using the Flask download route
                document.getElementById('download-png').href = `/download/png/${pngFilename}`;
                document.getElementById('download-jpg').href = `/download/jpg/${jpgFilename}`;

                showFrame(4);
            } else {
                console.error("Error: output_url not found in response");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred during image processing.");
            showFrame(1); // Go back to start on error
        });
    } else {
        alert("Please select a translation model!");
    }
});

back2Button.addEventListener('click', () => {
    showFrame(1);
});

startOver3Button.addEventListener('click', startOver);
startOver4Button.addEventListener('click', startOver);

// Prevent actual form submission and file drops
document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

// JS: Dispatch change event correctly
document.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.target === uploadArea || uploadArea.contains(e.target)) {
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        }
    }
});
console.log("Output PNG URL:", data.output_url.png);
console.log("Output JPG URL:", data.output_url.jpg);
