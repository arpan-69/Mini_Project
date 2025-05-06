# Mini Project: Bidirectional Image Conversion — Sketch to Real and Real to Sketch

This project explores a deep learning-based approach for **bidirectional image conversion**: generating realistic images from sketches and converting real images into sketch-like representations.

---

## 🧠 Bidirectional GAN (BiGAN)

A PyTorch-based implementation of a **Bidirectional Generative Adversarial Network (BiGAN)** designed to learn efficient bidirectional mappings between image and latent spaces.

### 🔍 Overview

BiGANs extend traditional GANs by introducing an encoder network, enabling the model to learn both image generation and inverse mapping tasks — a core idea for sketch-to-real and real-to-sketch transformations.

### ⚙️ Architecture

- **Generator (G)**: Maps latent vector `z` to image `x`
- **Encoder (E)**: Maps image `x` to latent vector `z`
- **Discriminator (D)**: Differentiates between real `(x, E(x))` and fake `(G(z), z)` pairs

### 🧪 Training Details

- **Datasets**: Shoes, CelebA, Flowers, Birds, Cats
- **Latent Dim**: 64
- **Epochs**: 100
- **Loss Function**: Binary Cross-Entropy (BCE)
- **Evaluation**: Visual comparison, reconstruction quality

---

# RenderX - AI Image Enhancer ✨🖼️

**RenderX** is an AI-powered web application that transforms low-quality images into high-quality visuals using advanced image processing and deep learning. It features a sleek UI and seamless user experience for image enhancement.

---

## 🚀 Features

- 🧠 AI-based image enhancement using deep learning
- ⏳ Real-time loading animations during processing
- 🌗 Light/Dark mode toggle with smooth transitions
- 👤 Profile section with circular avatar and name hover
- 📊 Image count tracker for each user
- 📁 Upload and download enhanced images
- 🔐 Full user authentication (login/register/logout)
- 🎨 Intuitive and responsive frontend with modern UI

---

## 🛠️ Tech Stack

### Frontend

- HTML5, CSS3, JavaScript
- Responsive design with animations
- Theme toggle using radio buttons
- Profile dialog with hover effects

### Backend

- Python + Flask
- Image processing with OpenCV and PIL
- Deep learning models (e.g., ESRGAN or custom-trained BiGAN)
- MongoDB (or any preferred database)
- User authentication system



## 📦 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/sankhyapatra0808/renderx.git
   cd renderx
   ```

2. (Optional) Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:

   ```bash
   python app.py
   ```


---

## 📃 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Pull requests and feedback are welcome! If you have suggestions or improvements, feel free to fork the repo and submit a PR.