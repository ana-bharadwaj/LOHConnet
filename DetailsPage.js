// src/index.js or src/App.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import DetailsPage from './DetailsPage';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/DetailsPage/:collectionName" element={<DetailsPage />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);