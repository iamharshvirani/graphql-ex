import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';

const GET_BOOK = gql`
  query GetBook($id: Int!) {
    book(id: $id) {
      id
      title
      author
      summary
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: Int!, $title: String, $author: String, $summary: String) {
    updateBook(id: $id, title: $title, author: $author, summary: $summary) {
      id
      title
      author
      summary
    }
  }
`;

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

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookId = parseInt(id, 10);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    summary: ''
  });
  const [errors, setErrors] = useState({});

  const { loading: queryLoading, error: queryError, data } = useQuery(GET_BOOK, {
    variables: { id: bookId },
    onCompleted: (data) => {
      if (data && data.book) {
        setFormData({
          title: data.book.title || '',
          author: data.book.author || '',
          summary: data.book.summary || ''
        });
      }
    }
  });

  const [updateBook, { loading: mutationLoading }] = useMutation(UPDATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
    onCompleted: () => {
      navigate('/');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      await updateBook({
        variables: {
          id: bookId,
          title: formData.title,
          author: formData.author,
          summary: formData.summary || null
        }
      });
    } catch (err) {
      console.error('Error updating book:', err);
      setErrors({
        ...errors,
        form: 'Failed to update book. Please try again.'
      });
    }
  };

  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <p>Error: {queryError.message}</p>;
  if (!data || !data.book) return <p>Book not found</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Edit Book</h2>
      
      {errors.form && (
        <div className="alert alert-danger" role="alert">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>
        
        <div className="mb-3">
          <label htmlFor="author" className="form-label">Author</label>
          <input
            type="text"
            className={`form-control ${errors.author ? 'is-invalid' : ''}`}
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
          {errors.author && <div className="invalid-feedback">{errors.author}</div>}
        </div>
        
        <div className="mb-3">
          <label htmlFor="summary" className="form-label">Summary</label>
          <textarea
            className="form-control"
            id="summary"
            name="summary"
            rows="4"
            value={formData.summary}
            onChange={handleChange}
          ></textarea>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={mutationLoading}
          >
            {mutationLoading ? 'Saving...' : 'Update Book'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
