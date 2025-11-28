# chdmarkdown2word
Convert Markdown with LaTeX math to Word DOCX
# 📝 Markdown to Word Converter

Công cụ chuyển đổi Markdown (có công thức LaTeX) sang file Word DOCX chuyên nghiệp.

## ✨ Tính năng

- ✅ Chuyển đổi Markdown sang Word DOCX
- ✅ Hỗ trợ công thức toán LaTeX ($...$, $$...$$)
- ✅ Công thức toán được chuyển thành OMML Equation trong Word (có thể chỉnh sửa)
- ✅ Hỗ trợ bảng, danh sách, code blocks, blockquotes
- ✅ Giao diện thân thiện, xem trước trực tiếp
- ✅ Miễn phí 100%

## 🚀 Cách sử dụng

1. Truy cập trang web
2. Dán hoặc tải file Markdown của bạn
3. Xem trước nội dung
4. Click "Chuyển đổi và Tải xuống DOCX"
5. Mở file Word và chỉnh sửa công thức như bình thường!

## 📦 Công nghệ sử dụng

**Frontend:**
- HTML5, CSS3, JavaScript
- Marked.js (Markdown rendering)
- KaTeX (Math preview)

**Backend:**
- Python + Flask
- Pandoc (Markdown to DOCX conversion)

## 🛠️ Hướng dẫn Deploy

### Phần 1: Deploy Frontend lên GitHub Pages

1. **Tạo repository trên GitHub**
   - Tên: `markdown-to-word-converter`
   - Public repository

2. **Upload các file:**
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`

3. **Bật GitHub Pages:**
   - Vào Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / root
   - Save

4. **Truy cập website:**
   - URL: `https://YOUR-USERNAME.github.io/markdown-to-word-converter/`

### Phần 2: Deploy Backend lên PythonAnywhere

1. **Đăng ký tài khoản:**
   - Truy cập: https://www.pythonanywhere.com
   - Tạo tài khoản FREE (Beginner)

2. **Upload code:**
   - Vào Dashboard → Files
   - Tạo thư mục: `markdown-converter`
   - Upload: `app.py`, `requirements.txt`

3. **Cài đặt dependencies:**
   ```bash
   # Mở Bash console
   cd markdown-converter
   pip3 install --user -r requirements.txt
   ```

4. **Cài đặt Pandoc:**
   ```bash
   # Trong Bash console
   wget https://github.com/jgm/pandoc/releases/download/3.1.11/pandoc-3.1.11-linux-amd64.tar.gz
   tar xvzf pandoc-3.1.11-linux-amd64.tar.gz
   mkdir -p ~/bin
   cp pandoc-3.1.11/bin/pandoc ~/bin/
   export PATH=$PATH:~/bin
   echo 'export PATH=$PATH:~/bin' >> ~/.bashrc
   ```

5. **Cấu hình Web App:**
   - Vào Web tab → Add a new web app
   - Choose: Flask
   - Python version: 3.10
   - Path: `/home/YOUR-USERNAME/markdown-converter/app.py`
   - Working directory: `/home/YOUR-USERNAME/markdown-converter`

6. **Cập nhật WSGI file:**
   - Vào Web tab → WSGI configuration file
   - Sửa path cho đúng với thư mục của bạn

7. **Reload web app:**
   - Click nút "Reload" màu xanh

8. **Test API:**
   - Truy cập: `https://YOUR-USERNAME.pythonanywhere.com/`
   - Nên thấy JSON response

### Phần 3: Kết nối Frontend với Backend

1. **Cập nhật `script.js`:**
   ```javascript
   const BACKEND_API_URL = 'https://YOUR-USERNAME.pythonanywhere.com/convert';
   ```

2. **Commit và push lên GitHub**

3. **Đợi GitHub Pages rebuild** (khoảng 1-2 phút)

4. **Test thử!**

## 📝 Ví dụ Markdown

```markdown
# Tiêu đề chính

## Công thức toán

Công thức inline: $x^2 + y^2 = z^2$

Công thức block:

$$
\int_0^1 x^2 dx = \frac{1}{3}
$$

$$
E = mc^2
$$

## Bảng

| Tên | Tuổi | Thành phố |
|-----|------|-----------|
| An  | 25   | Hà Nội    |
| Bình| 30   | TP.HCM    |

## Code

```python
def hello():
    print("Hello World!")
```

> Đây là quote
```

## 🐛 Xử lý lỗi thường gặp

### Frontend không gọi được Backend
- Kiểm tra CORS đã enable chưa
- Kiểm tra URL backend trong `script.js`
- Xem Console log trong trình duyệt (F12)

### Pandoc không chạy
- Kiểm tra đã cài đúng chưa: `pandoc --version`
- Kiểm tra PATH environment variable
- Restart web app trong PythonAnywhere

### Công thức toán không hiển thị đúng
- Kiểm tra cú pháp LaTeX
- Dùng `$$...$$` cho công thức block
- Dùng `$...$` cho công thức inline

## 📄 License

MIT License - Sử dụng tự do cho mọi mục đích!

## 👨‍💻 Tác giả

Phát triển bởi LÊ CHÂN ĐỨC

## 🙏 Credits

- Pandoc - Document converter
- Flask - Python web framework
- Marked.js - Markdown parser
- KaTeX - Math rendering
