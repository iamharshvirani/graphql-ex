import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/books" element={<BookList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
