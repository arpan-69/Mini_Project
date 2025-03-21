document.addEventListener("DOMContentLoaded", function () {
    const imageUpload = document.getElementById("imageUpload");
    const preview = document.getElementById("preview");
    const convertBtn = document.getElementById("convertBtn");
    const loading = document.getElementById("loading");
    const sketch = document.getElementById("sketch");
    const resultTitle = document.getElementById("resultTitle");
    const downloadLink = document.getElementById("downloadLink");

    imageUpload.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });

    convertBtn.addEventListener("click", function () {
        const file = imageUpload.files[0];
        if (!file) {
            alert("Please upload an image first.");
            return;
        }

        loading.style.display = "block";
        const formData = new FormData();
        formData.append("file", file);

        fetch("/upload", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.sketch_url) {
                sketch.src = data.sketch_url;
                sketch.style.display = "block";
                resultTitle.style.display = "block";
                downloadLink.href = data.sketch_url;
                downloadLink.style.display = "block";
            } else {
                alert("Error processing the image.");
            }
        })
        .catch(error => console.error("Error:", error))
        .finally(() => {
            loading.style.display = "none";
        });
    });
});
