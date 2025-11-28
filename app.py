from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import tempfile
import subprocess
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Enable CORS for all routes (cho phép frontend gọi API)
CORS(app)

@app.route('/')
def home():
    """Home page - API information"""
    return jsonify({
        'status': 'running',
        'message': 'Markdown to Word Converter API',
        'version': '1.0',
        'endpoints': {
            '/convert': 'POST - Convert Markdown to DOCX'
        }
    })

@app.route('/convert', methods=['POST'])
def convert_markdown_to_word():
    """
    Convert Markdown to Word DOCX
    Expected JSON: {"markdown": "# Your markdown content here"}
    Returns: DOCX file
    """
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data or 'markdown' not in data:
            return jsonify({'error': 'Missing markdown content'}), 400
        
        markdown_content = data['markdown']
        
        if not markdown_content.strip():
            return jsonify({'error': 'Empty markdown content'}), 400
        
        logger.info('Received conversion request')
        
        # Create temporary files
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False, encoding='utf-8') as md_file:
            md_file.write(markdown_content)
            md_path = md_file.name
        
        # Output DOCX path
        docx_path = md_path.replace('.md', '.docx')
        
        try:
            # Run Pandoc conversion
            # --from=markdown: input format
            # --to=docx: output format
            # --standalone: create standalone document
            # --mathml: convert math to MathML (which Word converts to OMML)
            cmd = [
                'pandoc',
                md_path,
                '-f', 'markdown',
                '-t', 'docx',
                '--standalone',
                '--mathml',
                '-o', docx_path
            ]
            
            logger.info(f'Running command: {" ".join(cmd)}')
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode != 0:
                error_msg = result.stderr or 'Unknown error during conversion'
                logger.error(f'Pandoc error: {error_msg}')
                return jsonify({'error': f'Conversion failed: {error_msg}'}), 500
            
            # Check if output file exists
            if not os.path.exists(docx_path):
                return jsonify({'error': 'Output file was not created'}), 500
            
            logger.info('Conversion successful')
            
            # Send file to client
            return send_file(
                docx_path,
                mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                as_attachment=True,
                download_name='document.docx'
            )
            
        finally:
            # Clean up temporary files
            try:
                if os.path.exists(md_path):
                    os.remove(md_path)
                if os.path.exists(docx_path):
                    os.remove(docx_path)
            except Exception as e:
                logger.warning(f'Failed to clean up temp files: {e}')
    
    except Exception as e:
        logger.error(f'Unexpected error: {str(e)}')
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Check if pandoc is available
        result = subprocess.run(['pandoc', '--version'], capture_output=True, timeout=5)
        pandoc_available = result.returncode == 0
        
        return jsonify({
            'status': 'healthy',
            'pandoc_available': pandoc_available
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # For local testing
    app.run(debug=True, host='0.0.0.0', port=5000)
