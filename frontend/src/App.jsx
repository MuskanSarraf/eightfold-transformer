import React, { useState, useRef } from 'react';
import './index.css';

const DEFAULT_CONFIG = `{
  "fields": [
    { "path": "full_name", "type": "string", "required": true },
    { "path": "primary_email", "from": "emails[0]", "type": "string", "required": true },
    { "path": "phone", "from": "phones[0]", "type": "string", "normalize": "E164" },
    { "path": "skills", "from": "skills[].name", "type": "string[]", "normalize": "canonical" }
  ],
  "include_confidence": true,
  "on_missing": "null"
}`;

function App() {
  const [files, setFiles] = useState([]);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    // Add config payload
    formData.append('config', config);

    try {
      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Eightfold Pipeline</h1>
        <p className="subtitle">Configurable Merge Engine</p>
        
        <div style={{marginBottom: '2rem'}}>
          <h4 style={{marginBottom: '0.5rem', color: 'var(--text-color)'}}>Runtime Configuration (JSON)</h4>
          <textarea 
            value={config}
            onChange={(e) => setConfig(e.target.value)}
            style={{ width: '100%', height: '150px', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', fontFamily: 'monospace' }}
          />
        </div>

        <div 
          className="upload-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <div className="upload-icon">☁️</div>
          <h3>Drag & Drop Files Here</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0' }}>or</p>
          <button className="upload-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>
            Browse Files
          </button>
          <input 
            type="file" 
            multiple 
            ref={fileInputRef} 
            onChange={handleFileSelect}
            className="file-input"
          />
        </div>

        {files.length > 0 && (
          <div className="file-list">
            <h4 style={{ color: 'var(--text-muted)' }}>Selected Files ({files.length}):</h4>
            {files.map((file, i) => (
              <div key={i} className="file-item">
                <span>{file.name}</span>
                <button className="remove-btn" onClick={() => removeFile(i)}>✕</button>
              </div>
            ))}
            
            <button 
              className="upload-btn" 
              style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Process Candidate Data'}
            </button>
          </div>
        )}

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="results-area">
            <div className="results-header">
              <h3 className="success-message">✨ Processing Complete</h3>
            </div>
            <pre className="json-display">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
