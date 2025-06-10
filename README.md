# 🕵️ DeepGuard : An Deepfake detection system

<div align="center">
  <br />
      <img src="face-recognition-personal-identification-collage.jpg" alt="Project Banner">
      <br />
  <br />
  <br />
</div>

![Python](https://img.shields.io/badge/Python-3.10-blue)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.10-orange)
![Streamlit](https://img.shields.io/badge/Streamlit-1.45-red)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

An AI-powered web app that detects deepfake images/videos using **MesoNet** and **Hugging Face Transformers**, deployed via Streamlit.

![Demo](https://deepguard-g8tg.onrender.com/)

## 🌟 Features

- **Image Analysis**:  
  - Uses MesoNet model (`mesonet_deepfake_model.h5`)  
  - Real-time confidence scores with visualization  

- **Video Analysis**:  
  - Frame-by-frame detection with Hugging Face ViT  
  - Face cropping and temporal smoothing  

- **Modern UI**:  
  - Dark/light mode toggle  
  - Interactive charts and metrics  

## 🚀 Quick Start

### Prerequisites
- Python 3.10
- Git

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/deepfake_detection_system.git
   cd deepfake_detection_system
  
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
3. Install dependencies:
   ```
   pip install -r requirements.txt

4. Add Hugging Face token (get yours here):
   ```
   echo "HUGGINGFACE_TOKEN=your_token_here" > .env

### Run Locally
    ```
    streamlit run main.py
Open http://localhost:8501 in your browser.

### 🛠️ Project Structure
    ```
    DEEP_FAKE_FINAL_CODE/
    ├── debug_frames/          # Temporary frame outputs
    ├── venv/                  # Virtual environment
    ├── .gitignore
    ├── main.py                # Streamlit app code
    ├── mesonet_deepfake_model.h5  # Pre-trained MesoNet model
    ├── requirements.txt       # Dependencies
    └── runtime.txt            # Python 3.10 for Streamlit Cloud

### 🌐 Deployment
1. Streamlit Cloud:
  - Push to GitHub and deploy via Streamlit Cloud.
  - Ensure runtime.txt and requirements.txt are committed.
2. Manual Setup:
  - Follow Streamlit deployment guide.

### 📜 License
MIT License. See LICENSE for details.

### 🤝 Contributing
1. Fork the project
2. Create a branch (git checkout -b feature/AmazingFeature)
3. Commit changes (git commit -m 'Add feature')
4. Push (git push origin feature/AmazingFeature)
5. Open a Pull Request

Made with ❤️ by Sunil Sowrirajan

