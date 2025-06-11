import { useState, useRef } from 'react'
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

  function downloadJSONAsCSV() {
    let csvData = jsonToCsv(results); // Add .items.data
    // Create a CSV file and allow the user to download it
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    document.body.appendChild(a);
    a.click();
  }

  function jsonToCsv(jsonData) {
    let csv = '';
    let headers = ['filename', 'benign', 'early', 'pre', 'pro', 'class'];
    csv += headers.join(',') + '\n';

    jsonData.forEach(function (row) {
      const data = [
        row.filename,
        ...['benign', 'early', 'pre', 'pro'].map(cls => row.scores[cls]),
        row.class
      ].join(',')
      csv += data + '\n';
    });
    return csv;
  }

  function analyzeBatch(formData) {
    setIsLoading(true)

    fetch('/api/predicts', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(body => body['predictions'])
      .then(predictions => {
        setResults(predictions.map(pred => {
          return {
            ...pred,
            class: Object.keys(pred.scores).reduce((a, b) => pred.scores[a] > pred.scores[b] ? a : b)
          }
        }))
      })
      .catch((e) => alert(e))
      .finally(setIsLoading(false))
  }

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
          <form action={analyzeBatch}>
            <input
              ref={filesInputRef}
              type="file"
              id="batch-files"
              className="file-input"
              accept="image/*"
              onChange={handleBatchFiles}
              name="images"
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
            <button id="batch-analyze" className="analyze-btn" type='submit'>Analyze Batch</button>
          </form>
          <button className="analyze-btn" onClick={downloadJSONAsCSV} disabled={results.length == 0}>Download CSV</button>
          <div id="batch-results" className="results-container">
            {(isLoading) && (
              <div className="loading"><div className="spinner"></div>Processing batch analysis...</div>
            )}
            {(results.length > 0) &&
              <table class="results-table">
                <thead>
                  <tr>
                    <th rowSpan={2}>Image</th>
                    <th rowSpan={2}>Filename</th>
                    <th colSpan={4}>Score</th>
                    <th rowSpan={2}>Class</th>
                  </tr>
                  <tr>
                    <th>benign</th>
                    <th>early</th>
                    <th>pre</th>
                    <th>pro</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, i) => 
                    <tr>
                      <td><img src={URL.createObjectURL(files[i])} alt="Cell" className="table-image"/></td>
                      <td>{result.filename}</td>
                      <td>{result.scores.benign}</td>
                      <td>{result.scores.early}</td>
                      <td>{result.scores.pre}</td>
                      <td>{result.scores.pro}</td>
                      <td>
                        <span
                          className={
                            `status-badge status-${result.class =='benign' ? 'negative':(result.class == 'pro' ? 'positive':'warning')}`
                          }
                        >
                          {result.class}
                        </span>
                      </td>
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
