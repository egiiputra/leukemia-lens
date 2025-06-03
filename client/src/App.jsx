import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [ mode, setMode ] =useState('single')

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
          <div className="upload-area" onclick="document.getElementById('single-file').click()">
            <span className="upload-icon">🔬</span>
            <div className="upload-text">Upload Blood Cell Image</div>
            <div className="upload-subtext">Click or drag & drop microscopy image (JPG, PNG)</div>
          </div>
          <input type="file" id="single-file" className="file-input" accept="image/*" onchange="handleSingleFile(event)"/>
          
          <div id="single-preview" className="preview-container"></div>
          <button id="single-analyze" className="analyze-btn" onclick="analyzeSingle()" disabled>Analyze Image</button>
          <div id="single-results" className="results-container"></div>
        </div>

        {/* Batch Inference Section */}
        <div 
          id="batch-section"
          className={`inference-section ${(mode=='batch') && 'active'}`}
        >
          <div className="upload-area" onclick="document.getElementById('batch-files').click()">
            <span className="upload-icon">📊</span>
            <div className="upload-text">Upload Multiple Blood Cell Images</div>
            <div className="upload-subtext">Select multiple microscopy images for batch analysis</div>
          </div>
          <input type="file" id="batch-files" className="file-input" accept="image/*" multiple onchange="handleBatchFiles(event)"/>
          
          <div id="batch-preview" className="preview-container"></div>
          <button id="batch-analyze" className="analyze-btn" onclick="analyzeBatch()" disabled>Analyze Batch</button>
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
