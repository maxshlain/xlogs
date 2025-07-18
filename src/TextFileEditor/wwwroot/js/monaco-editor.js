// Global variable to store Monaco Editor instance
let monacoEditor = null;

// Setup custom log language using built-in token types
function setupLogLanguage() {
    try {
        // Register the log language
        monaco.languages.register({ id: 'log' });
        
        // Define tokenizer rules for log files using built-in semantic tokens
        monaco.languages.setMonarchTokensProvider('log', {
            tokenizer: {
                root: [
                    // Log levels - map to built-in token types for automatic coloring
                    [/\b(ERROR|FATAL|EXCEPTION|FAIL|Failed|Exception|Error)\b/i, 'keyword'],
                    [/\b(WARN|WARNING|CAUTION)\b/i, 'number'],
                    [/\b(INFO|INFORMATION|SUCCESS|OK|PASS|Passed)\b/i, 'type'],
                    [/\b(DEBUG|TRACE|VERBOSE)\b/i, 'comment'],
                    
                    // Log levels with delimiters
                    [/\|(ERROR|FATAL|EXCEPTION|FAIL|Failed|Exception|Error)\|/i, 'keyword'],
                    [/\|(WARN|WARNING|CAUTION)\|/i, 'number'],
                    [/\|(INFO|INFORMATION|SUCCESS|OK|PASS|Passed)\|/i, 'type'],
                    [/\|(DEBUG|TRACE|VERBOSE)\|/i, 'comment'],
                    
                    [/\[(ERROR|FATAL|EXCEPTION|FAIL|Failed|Exception|Error)\]/i, 'keyword'],
                    [/\[(WARN|WARNING|CAUTION)\]/i, 'number'],
                    [/\[(INFO|INFORMATION|SUCCESS|OK|PASS|Passed)\]/i, 'type'],
                    [/\[(DEBUG|TRACE|VERBOSE)\]/i, 'comment'],
                    
                    // Timestamps - use string token type for green color
                    [/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?/, 'string'],
                    [/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/, 'string'],
                    [/\w{3} \d{2} \d{2}:\d{2}:\d{2}/, 'string'],
                    
                    // Class/namespace patterns - use type token
                    [/\b[A-Z][a-zA-Z0-9]*(?:\.[A-Z][a-zA-Z0-9]*)+/, 'type'],
                    
                    // URLs - use string token
                    [/https?:\/\/[^\s\]]+/, 'string'],
                    
                    // File paths - use comment token
                    [/[A-Za-z]:[\\\/][^\s\]]+|\/[^\s\]]*/, 'comment'],
                    
                    // File extensions - use string token
                    [/\b\w+\.(dll|exe|log|txt|json|xml|config)\b/, 'string'],
                    
                    // Numbers - use number token
                    [/\b\d+(?:\.\d+)?\b/, 'number'],
                    [/\b0x[0-9a-fA-F]+\b/, 'number'],
                    
                    // GUIDs - use identifier token
                    [/\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/, 'identifier'],
                    
                    // Stack traces - use keyword token for red color
                    [/^\s*at\s+.*/, 'keyword'],
                    
                    // IP addresses - use string token
                    [/\b(?:\d{1,3}\.){3}\d{1,3}\b/, 'string'],
                    
                    // Thread/Process IDs in brackets - use identifier token
                    [/\[[\w\d\-_:.]+\]/, 'identifier'],
                    
                    // HTTP status codes - use number token
                    [/\b[1-5]\d{2}\b/, 'number'],
                    
                    // Strings - use string token
                    [/"[^"]*"/, 'string'],
                    [/'[^']*'/, 'string'],
                    
                    // Keywords - use type token
                    [/\b(REQUEST|RESPONSE|GET|POST|PUT|DELETE|PATCH|Loading|Tweaks|Start|Stop|Running|Timer|refresher)\b/i, 'type'],
                ],
            },
        });
        
        console.log('Log language registered successfully');
    } catch (error) {
        console.error('Error setting up log language:', error);
    }
}

// Monaco Editor interop functions
window.monacoEditorInterop = {
    init: function (containerId, language, theme) {
        return new Promise((resolve, reject) => {
            try {
                require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
                require(['vs/editor/editor.main'], function () {
                    try {
                        // Setup custom log language after Monaco is loaded
                        setupLogLanguage();
                        
                        const container = document.getElementById(containerId);
                        if (!container) {
                            reject('Container not found');
                            return;
                        }

                        // Use only built-in themes to avoid errors
                        let effectiveTheme = theme || 'vs-dark';
                        let effectiveLanguage = language || 'log';

                        monacoEditor = monaco.editor.create(container, {
                            value: '',
                            language: effectiveLanguage,
                            theme: effectiveTheme,
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
                        
                        console.log('Monaco Editor initialized successfully with language:', effectiveLanguage, 'and theme:', effectiveTheme);
                        resolve();
                    } catch (error) {
                        console.error('Error creating Monaco Editor:', error);
                        reject(error.toString());
                    }
                });
            } catch (error) {
                console.error('Error loading Monaco Editor:', error);
                reject(error.toString());
            }
        });
    },

    setValue: function (value) {
        try {
            if (monacoEditor) {
                monacoEditor.setValue(value || '');
                console.log('Value set in editor');
            }
        } catch (error) {
            console.error('Error setting value:', error);
        }
    },

    getValue: function () {
        try {
            return monacoEditor ? monacoEditor.getValue() : '';
        } catch (error) {
            console.error('Error getting value:', error);
            return '';
        }
    },

    setLanguage: function (language) {
        try {
            if (monacoEditor) {
                const model = monacoEditor.getModel();
                if (model) {
                    monaco.editor.setModelLanguage(model, language);
                    console.log('Language set to:', language);
                }
            }
        } catch (error) {
            console.error('Error setting language:', error);
        }
    },

    setTheme: function (theme) {
        try {
            if (monacoEditor) {
                monaco.editor.setTheme(theme);
                console.log('Theme set to:', theme);
            }
        } catch (error) {
            console.error('Error setting theme:', error);
        }
    },

    dispose: function () {
        try {
            if (monacoEditor) {
                monacoEditor.dispose();
                monacoEditor = null;
                console.log('Editor disposed');
            }
        } catch (error) {
            console.error('Error disposing editor:', error);
        }
    },

    resize: function () {
        try {
            if (monacoEditor) {
                monacoEditor.layout();
                console.log('Editor resized');
            }
        } catch (error) {
            console.error('Error resizing editor:', error);
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
