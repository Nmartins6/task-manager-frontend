import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListPage from './pages/ListPage';
import ItemPage from './pages/ItemPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/list/:id" element={<ItemPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;