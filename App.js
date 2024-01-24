import React, { useState } from 'react';

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    // Fetch data from the Flask backend
    fetch('http://localhost:5000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "user_input": userInput }),
    })
    .then(response => response.json())
    .then(data => {
      setSearchResults(data);
    });
  };

  const renderTable = (document) => {
    // Extract headings and values from the document
    const headings = [];
    const values = [];

    Object.entries(document).forEach(([key, value]) => {
      headings.push(<th key={key} style={headerCellStyle}>{key}</th>);
      values.push(
        <td key={`${key}_value`} style={cellStyle}>
          {typeof value === 'object' ? (
            // If the value is an object, recursively render its properties
            renderTable(value)
          ) : (
            // Otherwise, limit the display length and add ellipsis
            value.length > 30 ? `${value.slice(0, 30)}...` : value
          )}
        </td>
      );
    });

    return (
      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {headings}
            </tr>
          </thead>
          <tbody>
            <tr>
              {values}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    marginTop: '10px',
  };

  const headerCellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  };

  const cellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    maxWidth: '150px', // Set a maximum width for the cell
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <h1>Search Documents</h1>
      <label>
        Enter Search String:
        <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
      </label>
      <button onClick={handleSearch}>Search</button>

      {searchResults.length > 0 && (
        <div>
          {searchResults.map((result, index) => (
            <div key={index}>
              <h2>{result.collection_name}</h2>
              {renderTable(result.document)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
