// ===== CONFIGURATION =====
// TODO: Thay đổi URL này sau khi deploy backend lên PythonAnywhere
const BACKEND_API_URL = 'https://chanduc.pythonanywhere.com/convert';

// ===== DOM ELEMENTS =====
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const markdownInput = document.getElementById('markdownInput');
const preview = document.getElementById('preview');
const convertBtn = document.getElementById('convertBtn');
const clearBtn = document.getElementById('clearBtn');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('errorMsg');
const successMsg = document.getElementById('successMsg');

// ===== EVENT LISTENERS =====

// File upload handler
fileInput.addEventListener('change', handleFileUpload);

// Markdown input handler - update preview on change
markdownInput.addEventListener('input', debounce(updatePreview, 300));

// Convert button
convertBtn.addEventListener('click', convertToWord);

// Clear button
clearBtn.addEventListener('click', clearContent);

// Initial preview update
updatePreview();

// ===== FUNCTIONS =====

/**
 * Handle file upload
 */
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    fileName.textContent = `Đã chọn: ${file.name}`;

    const reader = new FileReader();
    reader.onload = function(e) {
        markdownInput.value = e.target.result;
        updatePreview();
    };
    reader.readAsText(file);
}

/**
 * Update preview with rendered Markdown
 */
function updatePreview() {
    const markdownText = markdownInput.value.trim();
    
    if (!markdownText) {
        preview.innerHTML = '<p class="preview-placeholder">Nội dung xem trước sẽ hiển thị ở đây...</p>';
        return;
    }

    try {
        // Convert Markdown to HTML using marked.js
        let html = marked.parse(markdownText);
        
        // Render the HTML
        preview.innerHTML = html;
        
        // Render math equations using KaTeX
        renderMathInElement(preview, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\[', right: '\\]', display: true},
                {left: '\\(', right: '\\)', display: false}
            ],
            throwOnError: false
        });
    } catch (error) {
        console.error('Preview error:', error);
        preview.innerHTML = '<p style="color: red;">Lỗi khi hiển thị preview: ' + error.message + '</p>';
    }
}

/**
 * Convert Markdown to Word DOCX
 */
async function convertToWord() {
    const markdownText = markdownInput.value.trim();
    
    if (!markdownText) {
        showError('Vui lòng nhập nội dung Markdown trước khi chuyển đổi!');
        return;
    }

    // Hide previous messages
    hideMessages();
    
    // Show loading
    loading.style.display = 'block';
    convertBtn.disabled = true;

    try {
        // Send request to backend
        const response = await fetch(BACKEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                markdown: markdownText
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Lỗi khi chuyển đổi file');
        }

        // Get the blob
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.docx';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Show success message
        showSuccess('Tải xuống thành công! File DOCX đã được lưu.');
        
    } catch (error) {
        console.error('Conversion error:', error);
        showError('Lỗi: ' + error.message + '. Vui lòng kiểm tra kết nối đến server backend.');
    } finally {
        // Hide loading
        loading.style.display = 'none';
        convertBtn.disabled = false;
    }
}

/**
 * Clear all content
 */
function clearContent() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ nội dung?')) {
        markdownInput.value = '';
        fileInput.value = '';
        fileName.textContent = '';
        updatePreview();
        hideMessages();
    }
}

/**
 * Show error message
 */
function showError(message) {
    hideMessages();
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    
    // Auto hide after 8 seconds
    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 8000);
}

/**
 * Show success message
 */
function showSuccess(message) {
    hideMessages();
    successMsg.textContent = message;
    successMsg.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 5000);
}

/**
 * Hide all messages
 */
function hideMessages() {
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
}

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== CONFIGURATION NOTE =====
// Sau khi deploy backend lên PythonAnywhere, nhớ cập nhật URL ở đầu file này!
// Ví dụ: const BACKEND_API_URL = 'https://chdai.pythonanywhere.com/convert';
