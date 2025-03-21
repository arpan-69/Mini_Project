// DOM Elements
const frames = document.querySelectorAll('.frame');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('sketch-upload');
const previewImage = document.getElementById('preview-image');
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
    previewImage.style.display = 'none';
    progressFill.style.width = '0';
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

// Handle file upload
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            previewImage.src = event.target.result;
            previewImage.style.display = 'block';
            uploadArea.querySelector('svg').style.display = 'none';
            uploadArea.querySelector('h3').style.display = 'none';
            uploadArea.querySelectorAll('p').forEach(p => p.style.display = 'none');
            hasUploadedSketch = true;
        }

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
                outputImage.src = outputUrlPng; // Show the generated image
                outputImage.style.display = "block"; // Make sure the image is visible
                document.getElementById('download-png').href = outputUrlPng;
                document.getElementById('download-jpg').href = outputUrlJpg;
                showFrame(4);
            } else {
                console.error("Error: output_url not found in response");
            }
        })
        .catch(error => console.error("Error:", error));
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
