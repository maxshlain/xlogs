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