<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Text File Editor - Blazor WebAssembly Project

This is a Blazor WebAssembly single-page application that allows users to upload text files and edit them using the Monaco Editor (VS Code editor) component. The application runs entirely in the browser without any server-side dependencies.

## Key Technologies:
- Blazor WebAssembly (.NET 8)
- Monaco Editor (Microsoft's web-based code editor)
- Bootstrap 5 for UI styling
- JavaScript Interop for Monaco Editor integration

## Architecture:
- Single-page application with no server-side components
- Client-side file reading using HTML5 File API
- Monaco Editor integration via CDN and JavaScript interop
- Responsive design supporting various screen sizes

## Key Features:
- File upload with support for multiple text-based file formats
- Syntax highlighting based on file extension auto-detection
- Manual language selection for editor
- Theme switching (Dark, Light, High Contrast)
- File information display (name, size)
- Error handling and user feedback

## File Structure:
- `Pages/Home.razor` - Main component containing file upload and Monaco Editor
- `wwwroot/js/monaco-editor.js` - JavaScript interop functions for Monaco Editor
- `wwwroot/index.html` - Main HTML file with Monaco Editor CDN references
- `Layout/MainLayout.razor` - Simplified full-screen layout
- `wwwroot/css/app.css` - Custom styles for full-screen editor experience
