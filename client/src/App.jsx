import { useState, useRef, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [ files, setFiles ] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const [results, setResults] = useState([])

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
        <div 
          id="batch-section"
          className={`inference-section ${(mode=='batch') && 'active'}`}
        >
          <div
            className="upload-area"
            onClick="document.getElementById('batch-files').click()"
          >
            <span className="upload-icon">📊</span>
            <div className="upload-text">Upload Blood Cell Images</div>
            <div className="upload-subtext">Select microscopy images for batch analysis</div>
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
