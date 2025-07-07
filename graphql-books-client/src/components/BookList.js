import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_BOOKS = gql`
  query {
    books {
      id
      title
      author
      summary
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: Int!) {
    deleteBook(id: $id) {
      id
      title
    }
  }
`;

export default function BookList() {
  const { loading, error, data } = useQuery(GET_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }]
  });
  const [selectedBook, setSelectedBook] = useState(null);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook({ variables: { id } });
      } catch (err) {
        console.error('Error deleting book:', err);
      }
    }
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
  };

  const handleCloseDetails = () => {
    setSelectedBook(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Book List</h2>
      <div className="mb-4">
        <a href="/add-book" className="btn btn-primary">Add New Book</a>
      </div>
      <div className="row">
        {data.books.map((book) => (
          <div key={book.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">by {book.author}</h6>
                <p className="card-text">
                  {book.summary ? (
                    book.summary.length > 100 
                      ? `${book.summary.substring(0, 100)}...` 
                      : book.summary
                  ) : 'No summary available'}
                </p>
              </div>
              <div className="card-footer bg-transparent">
                <button 
                  className="btn btn-sm btn-info me-2" 
                  onClick={() => handleViewDetails(book)}
                >
                  View Details
                </button>
                <a 
                  href={`/edit-book/${book.id}`} 
                  className="btn btn-sm btn-warning me-2"
                >
                  Edit
                </a>
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => handleDelete(book.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedBook.title}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseDetails}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Author:</strong> {selectedBook.author}</p>
                <p><strong>Summary:</strong> {selectedBook.summary || 'No summary available'}</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseDetails}
                >
                  Close
                </button>
                <a 
                  href={`/edit-book/${selectedBook.id}`} 
                  className="btn btn-primary"
                >
                  Edit Book
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedBook && <div className="modal-backdrop show"></div>}
    </div>
  );
}
