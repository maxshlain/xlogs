// Global variable to store Monaco Editor instance
let monacoEditor = null;

// Monaco Editor interop functions
window.monacoEditorInterop = {
    init: function (containerId, language, theme) {
        return new Promise((resolve, reject) => {
            require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
            require(['vs/editor/editor.main'], function () {
                try {
                    const container = document.getElementById(containerId);
                    if (container) {
                        monacoEditor = monaco.editor.create(container, {
                            value: '',
                            language: language || 'plaintext',
                            theme: theme || 'vs-dark',
                            automaticLayout: true,
                            minimap: { enabled: true },
                            fontSize: 14,
                            lineNumbers: 'on',
                            wordWrap: 'on',
                            scrollBeyondLastLine: false
                        });
                        
                        // Ensure editor resizes properly
                        window.addEventListener('resize', () => {
                            if (monacoEditor) {
                                monacoEditor.layout();
                            }
                        });
                        
                        resolve();
                    } else {
                        reject('Container not found');
                    }
                } catch (error) {
                    reject(error.toString());
                }
            });
        });
    },

    setValue: function (value) {
        if (monacoEditor) {
            monacoEditor.setValue(value || '');
        }
    },

    getValue: function () {
        return monacoEditor ? monacoEditor.getValue() : '';
    },

    setLanguage: function (language) {
        if (monacoEditor) {
            const model = monacoEditor.getModel();
            if (model) {
                monaco.editor.setModelLanguage(model, language);
            }
        }
    },

    setTheme: function (theme) {
        if (monacoEditor) {
            monaco.editor.setTheme(theme);
        }
    },

    dispose: function () {
        if (monacoEditor) {
            monacoEditor.dispose();
            monacoEditor = null;
        }
    },

    resize: function () {
        if (monacoEditor) {
            monacoEditor.layout();
        }
    }
};

// File reading functionality
window.fileReaderInterop = {
    readFileAsText: function (fileInput) {
        return new Promise((resolve, reject) => {
            const file = fileInput.files[0];
            if (!file) {
                reject('No file selected');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                resolve({
                    content: e.target.result,
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type
                });
            };
            reader.onerror = function () {
                reject('Error reading file');
            };
            reader.readAsText(file);
        });
    }
};

// Log that the interop objects are ready
console.log('Monaco Editor JavaScript interop objects loaded:', {
    monacoEditorInterop: typeof window.monacoEditorInterop,
    fileReaderInterop: typeof window.fileReaderInterop,
    fileDownloadInterop: typeof window.fileDownloadInterop
});
