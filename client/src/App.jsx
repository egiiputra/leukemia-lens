import { useState, useRef, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [ mode, setMode ] = useState('single')

  const [ files, setFiles ] = useState([])

  const [singlePreview, setSinglePreview] = useState(() => <></>)

  const [isLoading, setIsLoading] = useState(false)
  
  const [results, setResults] = useState([])
  const singleFileInput = useRef(null);




  // function handleSingleFile(event) {
  //   setFiles([event.target.files[0]])
  //   if (file) {
  //     singleFile = file;
  //     displaySinglePreview(file);
  //     document.getElementById('single-analyze').disabled = false;
  //   }
  // }

  function generateMockSingleResult() {
    const classifications = ['Acute Lymphoblastic Leukemia', 'Acute Myeloid Leukemia', 'Chronic Lymphocytic Leukemia', 'Normal Blood Cells'];
    const classification = classifications[Math.floor(Math.random() * classifications.length)];
    const confidence = (Math.random() * 0.3 + 0.7) * 100;
    
    return {
      classification,
      confidence: confidence.toFixed(1),
      image: URL.createObjectURL(files[0])
    };
  }

  function analyzeSingle() {
    setIsLoading(true)
    // Simulate AI processing
    setTimeout(() => {
      setResults([generateMockSingleResult()]);
      // displaySingleResult(mockResults);
      setIsLoading(false)
    }, 3000);

  }

  useEffect(() => {

    console.log('loading', isLoading)
  }, [isLoading])

  useEffect(() => {
    console.log(files)
    if (files.length > 0) {
      const reader = new FileReader()
      reader.onload = function (e) {
        setSinglePreview(
          <div>
            <img src={e.target.result} alt="Preview" className="preview-image"/>
            <div className="preview-name">{files[0].name}</div>
          </div>
        )
        console.log(e.target.result)
      }
      reader.readAsDataURL(files[0])
    }
  }, [files])

  return (
    <div className="container">
      <div className="header">
        <h1>🩸 Leukemia Classification System</h1>
        <p>Advanced AI-powered blood cell analysis for medical diagnosis</p>
      </div>

      <div className="main-content">
        <div className="mode-selector">
          <button 
            className={`mode-btn ${(mode=='single') && 'active'}`}
            onClick={() => setMode('single')}
          >
            Single Inference
          </button>
          <button 
            className={`mode-btn ${(mode=='batch') && 'active'}`}
            onClick={() => setMode('batch')}
          >
            Batch Inference
          </button>
        </div>

        {/* Single Inference Section */}
        <div 
          id="single-section"
          className={`inference-section ${(mode=='single') && 'active'}`}
        >
          <div 
            className="upload-area" 
            onClick={() => singleFileInput.current.click()}
          >
            <span className="upload-icon">🔬</span>
            <div className="upload-text">Upload Blood Cell Image</div>
            <div className="upload-subtext">Click or drag & drop microscopy image (JPG, PNG)</div>
          </div>
          <input
            ref={singleFileInput}
            type="file"
            id="single-file"
            className="file-input"
            accept="image/*"
            onChange={() => setFiles([singleFileInput.current.files[0]])}
          />

          <div 
            id="single-preview"
            className="preview-container"
          >
            {singlePreview}
          </div>
          <button 
            id="single-analyze" 
            className="analyze-btn"
            onClick={analyzeSingle}
            disabled={(mode=='single' && (files.length === 0))}
          >
            Analyze Image
          </button>
          <div 
            id="single-results"
            className="results-container">
              {isLoading && (
                <div className="loading"><div className="spinner"></div>Analyzing blood cell image...</div>
              )}

              {(results.length > 0) && (
                <div class="single-result">
                  <img src={results[0].image} alt="Analyzed Image" class="result-image"/>
                  <div class="result-classification">${results[0].classification}</div>
                  <div class="result-confidence">Confidence: {results[0].confidence}%</div>
                  <div class="confidence-bar">
                      <div class="confidence-fill" style={{width: {results[0].confidence}%}}></div>
                  </div>
                  <div class="medical-info">
                      <h3>Analysis Summary</h3>
                      <p>The AI model has classified this blood cell image with {results[0].confidence}% confidence. Please consult with a medical professional for proper diagnosis and treatment recommendations.</p>
                  </div>
                </div>
              )}

          </div>
        </div>

        {/* Batch Inference Section */}
        <div 
          id="batch-section"
          className={`inference-section ${(mode=='batch') && 'active'}`}
        >
          <div
            className="upload-area"
            onClick="document.getElementById('batch-files').click()"
          >
            <span className="upload-icon">📊</span>
            <div className="upload-text">Upload Multiple Blood Cell Images</div>
            <div className="upload-subtext">Select multiple microscopy images for batch analysis</div>
          </div>
          <input type="file" id="batch-files" className="file-input" accept="image/*" multiple onChange="handleBatchFiles(event)"/>
          
          <div id="batch-preview" className="preview-container"></div>
          <button id="batch-analyze" className="analyze-btn" onClick="analyzeBatch()" disabled>Analyze Batch</button>
          <div id="batch-results" className="results-container"></div>
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
