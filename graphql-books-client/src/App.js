import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/edit-book/:id" element={<EditBook />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
