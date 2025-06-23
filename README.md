# Text File Editor

A Blazor WebAssembly single-page application that allows users to upload text files and edit them using the Monaco Editor (VS Code editor) component. The application runs entirely in the browser without any server-side dependencies.

## 🚀 Live Demo

The application is automatically deployed to GitHub Pages: [https://maximshlain.github.io/xlogs/](https://maximshlain.github.io/xlogs/)

## ✨ Features

- **File Upload**: Support for multiple text-based file formats
- **Monaco Editor**: Full VS Code editor experience in the browser
- **Syntax Highlighting**: Automatic detection based on file extension
- **Language Selection**: Manual language selection for the editor
- **Theme Switching**: Dark, Light, and High Contrast themes
- **File Information**: Display file name and size
- **URL Content Sharing**: Load and share content via URL parameters
- **Responsive Design**: Works on various screen sizes
- **Error Handling**: Comprehensive user feedback

## 🛠️ Technologies

- **Blazor WebAssembly** (.NET 8)
- **Monaco Editor** (Microsoft's web-based code editor)
- **Bootstrap 5** for UI styling
- **JavaScript Interop** for Monaco Editor integration

## 🏗️ Architecture

- Single-page application with no server-side components
- Client-side file reading using HTML5 File API
- Monaco Editor integration via CDN and JavaScript interop
- Responsive design supporting various screen sizes

## 📁 Project Structure

```
├── Pages/
│   └── Home.razor              # Main component with file upload and Monaco Editor
├── Layout/
│   └── MainLayout.razor        # Simplified full-screen layout
├── wwwroot/
│   ├── js/
│   │   └── monaco-editor.js    # JavaScript interop functions
│   ├── css/
│   │   └── app.css            # Custom styles for full-screen editor
│   └── index.html             # Main HTML with Monaco Editor CDN references
└── .github/
    └── workflows/
        └── deploy.yml         # GitHub Actions workflow for deployment
```

## 🔗 URL Content Sharing

This application supports loading and sharing content via URL parameters, making it easy to share log files and other text content without uploading files to a server.

### How to Share Content

#### Method 1: Using the Share Button (Recommended)
1. Load or paste your content into the editor
2. Click the **"Share"** button next to the file upload
3. The shareable URL will be automatically copied to your clipboard
4. Share the URL with others - they can access the content by simply visiting the link

#### Method 2: Manual URL Creation
You can manually create shareable URLs by converting your local file content to compressed base64 and adding it as a URL parameter.

**For a local file `mylog.txt`:**

1. **Convert file to compressed base64** (choose one method):
   
   **Using Node.js (Recommended - with compression):**
   ```javascript
   const fs = require('fs');
   const zlib = require('zlib');
   
   const content = fs.readFileSync('mylog.txt', 'utf8');
   const compressed = zlib.deflateSync(Buffer.from(content, 'utf8'));
   const base64 = compressed.toString('base64')
     .replace(/\+/g, '-')
     .replace(/\//g, '_')
     .replace(/=/g, '');
   console.log(base64);
   ```
   
   **Using Python (with compression):**
   ```python
   import zlib
   import base64
   
   with open('mylog.txt', 'r', encoding='utf-8') as f:
       content = f.read()
   
   compressed = zlib.compress(content.encode('utf-8'))
   base64_content = base64.b64encode(compressed).decode('ascii')
   url_safe = base64_content.replace('+', '-').replace('/', '_').replace('=', '')
   print(url_safe)
   ```
   
   **Legacy method (uncompressed - may hit URL limits):**
   ```bash
   base64 -i mylog.txt | tr -d '\n' | sed 's/+/-/g; s/\//_/g; s/=//g'
   ```

2. **Create the shareable URL:**
   
   **For compressed content (recommended):**
   ```
   https://maximshlain.github.io/xlogs/?content=COMPRESSED_BASE64_CONTENT&compressed=1&filename=mylog.txt
   ```
   
   **For uncompressed content (legacy):**
   ```
   https://maximshlain.github.io/xlogs/?content=BASE64_CONTENT&filename=mylog.txt
   ```
   Replace `COMPRESSED_BASE64_CONTENT` or `BASE64_CONTENT` with the output from step 1.

### URL Parameters

- `content` (required): Base64-encoded file content (URL-safe: `+` → `-`, `/` → `_`, padding `=` removed)
- `compressed` (optional): Set to `1` if the content is compressed with deflate algorithm
- `filename` (optional): Original filename for proper syntax highlighting and display

### Example

**Original file content:**
```
Hello World!
This is a test log file.
```

**Generated URL:**
```
https://maximshlain.github.io/xlogs/?content=SGVsbG8gV29ybGQhClRoaXMgaXMgYSB0ZXN0IGxvZyBmaWxlLg&filename=test.log
```

### Advantages of URL Sharing

- ✅ **No server storage** - Content is embedded in the URL
- ✅ **Instant sharing** - No upload time required
- ✅ **Privacy-friendly** - No data stored on external servers
- ✅ **Permanent links** - URLs work as long as the application is hosted
- ✅ **Cross-platform** - Works on any device with a web browser
- ✅ **Compression support** - Larger files supported through deflate compression

### Limitations

- URLs have practical length limits (typically ~2000 characters for compatibility)
- Very large files may still create unwieldy URLs even with compression
- Content is visible in browser history and server logs (don't share sensitive data)
- Compression requires modern browsers that support the Compression Streams API

## 🚀 Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

Every push to the `main` branch automatically triggers a deployment to GitHub Pages through the GitHub Actions workflow defined in `.github/workflows/deploy.yml`.

### Manual Deployment Setup

If you fork this repository, you'll need to:

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Select "GitHub Actions" as the source

2. **Update the repository name** in the workflow file:
   - Edit `.github/workflows/deploy.yml`
   - Change `xlogs` to your repository name in the sed command:
     ```yaml
     - name: Change base-tag in index.html from / to GitHub repository name
       run: sed -i 's/<base href="\/" \/>/<base href="\/YOUR_REPO_NAME\/" \/>/g' release/wwwroot/index.html
     ```

3. **Push to main branch** to trigger the deployment

### Local Development

To run the project locally:

```bash
# Clone the repository
git clone https://github.com/maximshlain/xlogs.git
cd xlogs

# Restore dependencies
dotnet restore

# Run the application
dotnet run
```

The application will be available at `https://localhost:5001` or `http://localhost:5000`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.