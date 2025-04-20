from flask import Flask, render_template, request, jsonify
import os
from pathlib import Path
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import google.generativeai as genai

# Initialize Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load environment variables
load_dotenv()

# Configure Gemini AI
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel('gemini-2.0-flash')

# Analysis prompt
input_prompt = """
As a plant pathologist, analyze the provided image and provide:
1. Disease identification (scientific names if possible)
2. Visible symptoms
3. Likely causes (pathogens/environmental)
4. Treatment options (organic & chemical)
5. Prevention measures
6. Additional health observations

If the image is unclear or not a plant, request a better image.
Keep the response concise but informative.
"""
@app.route('/plant-disease-detector')
def plant_disease_detector():
    return render_template('index.html')  # This should point to your plant disease detection page
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Verify the image was saved
        img = Path(filepath)
        if not img.exists():
            return jsonify({'error': 'Failed to save image'}), 500
            
        # Generate analysis
        response = model.generate_content([
            input_prompt,
            {"mime_type": "image/jpeg", "data": img.read_bytes()}
        ])
        
        return jsonify({
            'success': True,
            'result': response.text,
            'image_url': f"/static/uploads/{filename}"
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)