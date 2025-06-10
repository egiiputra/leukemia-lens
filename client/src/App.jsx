import { useState, useRef, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [ files, setFiles ] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const [results, setResults] = useState([])

  const filesInputRef = useRef(null)

  function handleBatchFiles(event) {
    setFiles(Array.from(event.target.files))
    document.getElementById('batch-analyze').disabled = false;
  }
  function displayBatchResults(results) {
    const resultsContainer = document.getElementById('batch-results');
    
    let tableHTML = `
        <table class="results-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Filename</th>
                    <th>Classification</th>
                    <th>Confidence</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    results.forEach(result => {
      tableHTML += `
        <tr>
          <td><img src="${result.image}" alt="Cell" class="table-image"></td>
          <td>${result.filename}</td>
          <td>${result.fullName}</td>
          <td>${result.confidence}%</td>
          <td><span class="status-badge status-${result.status.toLowerCase()}">${result.status}</span></td>
        </tr>
      `;
    });

    tableHTML += `
        </tbody>
    </table>
    `;

    resultsContainer.innerHTML = tableHTML;
  }
  function generateMockBatchResults() {
    const classifications = ['ALL', 'AML', 'CLL', 'Normal'];
    const fullNames = {
        'ALL': 'Acute Lymphoblastic Leukemia',
        'AML': 'Acute Myeloid Leukemia', 
        'CLL': 'Chronic Lymphocytic Leukemia',
        'Normal': 'Normal Blood Cells'
    };
    
    return files.map((file, index) => {
        const classification = classifications[Math.floor(Math.random() * classifications.length)];
        const confidence = (Math.random() * 0.3 + 0.7) * 100;
        
        return {
            filename: file.name,
            classification,
            fullName: fullNames[classification],
            confidence: confidence.toFixed(1),
            status: classification === 'Normal' ? 'Negative' : 'Positive',
            image: URL.createObjectURL(file)
        };
    });
}

  function analyzeBatch() {
    console.log('ok')
    const resultsContainer = document.getElementById('batch-results');
    resultsContainer.innerHTML = '<div class="loading"><div class="spinner"></div>Processing batch analysis...</div>';
    
    // Simulate AI processing
    setTimeout(() => {
        setResults(generateMockBatchResults())
        displayBatchResults(mockResults);
    }, 4000);
  }

  useEffect(() => {
    console.log('loading', isLoading)
  }, [isLoading])

  return (
    <div className="container">
      <div className="header">
        <h1>🩸 Leukemia Classification System</h1>
        <p>Advanced AI-powered blood cell analysis for medical diagnosis</p>
      </div>

      <div className="main-content">
        <div 
          id="batch-section"
          className='inference-section active'
        >
          <div
            className="upload-area"
            onClick={() => filesInputRef.current.click()}
          >
            <span className="upload-icon">📊</span>
            <div 
              className="upload-text"
            >
              Upload Blood Cell Images
            </div>
            <div className="upload-subtext">
              Select microscopy images for batch analysis
            </div>
          </div>
          <input
            ref={filesInputRef}
            type="file"
            id="batch-files"
            className="file-input"
            accept="image/*"
            onChange={handleBatchFiles}
            multiple/>

          <div id="batch-preview" className="preview-container">
            {files.map((file, i) =>
              <div key={i} className='preview-item'>
                <img 
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="preview-image"/>
                <div className="preview-name">
                  {file.name}
                </div>
              </div>
            )}
          </div>
          <button id="batch-analyze" className="analyze-btn" onClick={analyzeBatch}>Analyze Batch</button>
          <div id="batch-results" className="results-container">
            {(results.length > 0) &&
              <table class="results-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Filename</th>
                    <th>Classification</th>
                    <th>Confidence</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(result => 
                      <tr>
                        <td><img src={result.image} alt="Cell" class="table-image"/></td>
                        <td>{result.filename}</td>
                        <td>{result.fullName}</td>
                        <td>{result.confidence}%</td>
                        <td><span class="status-badge status-${result.status.toLowerCase()}">${result.status}</span></td>
                      </tr>
                  )}
                </tbody>
              </table>
            }
          </div>
        </div>

        <div className="medical-info">
          <h3>⚕️ Medical Disclaimer</h3>
          <p>This AI classification system is designed to assist medical professionals in the analysis of blood cell images. Results should always be verified by qualified hematologists and should not be used as the sole basis for medical diagnosis or treatment decisions.</p>
        </div>
      </div>
    </div>
  )
}

export default App
