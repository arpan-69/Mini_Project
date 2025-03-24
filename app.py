import os
import torch
import torchvision.transforms as transforms
import numpy as np
from PIL import Image
from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
import uuid
import base64
import requests
import logging
from pathlib import Path
from models.pix2pix import load_model

app = Flask(__name__)

# Configure folders and settings
UPLOAD_FOLDER = "static/uploads/"
OUTPUT_FOLDER = "static/outputs/"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB limit, matching frontend

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["OUTPUT_FOLDER"] = OUTPUT_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_FILE_SIZE
app.static_folder = 'static'
app.static_url_path = '/static'

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Available Models
models = {
    "flowers": "models/flower.pth",
    "shoes": "models/shoes.pth",
    "cats": "models/cats.pth",
    "birds": "models/birds.pth",
    "faces": "models/face_gen_ep10.pth"
}

# Load models
loaded_models = {}
for model_type, model_path in models.items():
    try:
        loaded_models[model_type] = load_model(model_path, device=device)
        logger.info(f"Loaded model: {model_type}")
    except Exception as e:
        logger.error(f"Failed to load model {model_type}: {str(e)}")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_image(image_path, model_type):
    if model_type not in loaded_models:
        logger.error(f"Model {model_type} not found in loaded_models")
        return None, "Model not found"

    try:
        generator = loaded_models[model_type]
        logger.info(f"Loading image: {image_path}")
        sketch = Image.open(image_path).convert("RGB")
        logger.info(f"Image size: {sketch.size}")

        transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ])
        sketch_tensor = transform(sketch).unsqueeze(0).to(device)
        logger.info(f"Image tensor shape: {sketch_tensor.shape}")

        with torch.no_grad():
            generated_image = generator(sketch_tensor).cpu().squeeze(0)

        generated_image = generated_image.permute(1, 2, 0).numpy()
        generated_image = (generated_image * 0.5 + 0.5) * 255
        generated_image = np.clip(generated_image, 0, 255).astype(np.uint8)
        logger.info(f"Generated image shape: {generated_image.shape}")

        original_filename = os.path.splitext(os.path.basename(image_path))[0]
        unique_filename = f"{original_filename}_converted_{model_type}"
        output_paths = {
            "png": os.path.join(OUTPUT_FOLDER, f"{unique_filename}.png"),
            "jpg": os.path.join(OUTPUT_FOLDER, f"{unique_filename}.jpg"),
        }

        logger.info(f"Saving enhanced image to: {output_paths['png']}")
        Image.fromarray(generated_image).save(output_paths["png"])
        Image.fromarray(generated_image).convert("RGB").save(output_paths["jpg"])

        Path(image_path).unlink(missing_ok=True)
        logger.info(f"Processed image: {image_path} -> {output_paths['png']}")
        return output_paths, None

    except Exception as e:
        logger.error(f"Image processing failed: {str(e)}", exc_info=True)
        return None, f"Processing error: {str(e)}"

@app.route("/generate", methods=["POST"])
def generate():
    model_type = request.form.get("model") or request.json.get("model") or "flowers"

    if "file" in request.files:
        file = request.files["file"]
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file format. Supported: PNG, JPG, JPEG"}), 415
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        input_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        file.save(input_path)

    elif request.is_json and request.json.get("image_base64"):
        try:
            image_data = base64.b64decode(request.json["image_base64"])
            if len(image_data) > MAX_FILE_SIZE:
                return jsonify({"error": "Base64 image exceeds 5MB limit"}), 413
            filename = f"base64_{uuid.uuid4().hex}.png"
            input_path = os.path.join(UPLOAD_FOLDER, filename)
            with open(input_path, "wb") as f:
                f.write(image_data)
        except Exception as e:
            return jsonify({"error": f"Invalid base64 image: {str(e)}"}), 400

    elif request.is_json and request.json.get("image_url"):
        try:
            image_url = request.json["image_url"]
            response = requests.get(image_url, timeout=10)
            if response.status_code != 200:
                return jsonify({"error": "Failed to download image from URL"}), 400
            if len(response.content) > MAX_FILE_SIZE:
                return jsonify({"error": "Image from URL exceeds 5MB limit"}), 413
            filename = f"url_{uuid.uuid4().hex}.png"
            input_path = os.path.join(UPLOAD_FOLDER, filename)
            with open(input_path, "wb") as f:
                f.write(response.content)
        except requests.RequestException as e:
            return jsonify({"error": f"Invalid image URL: {str(e)}"}), 400

    else:
        return jsonify({"error": "No image provided"}), 400

    output_paths, error = process_image(input_path, model_type)
    if error:
        return jsonify({"error": error}), 400

    relative_paths = {
        "png": output_paths["png"].replace("static/", ""),
        "jpg": output_paths["jpg"].replace("static/", "")
    }

    return jsonify({
        "message": "Image generated successfully",
        "output_url": {
            "png": f"http://localhost:5000/static/{relative_paths['png']}",
             "jpg": f"http://localhost:5000/static/{relative_paths['jpg']}"
        }
    }), 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)