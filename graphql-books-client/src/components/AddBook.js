import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $author: String!, $summary: String) {
    createBook(title: $title, author: $author, summary: $summary) {
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

export default function AddBook() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    summary: ''
  });
  const [errors, setErrors] = useState({});

  const [createBook, { loading }] = useMutation(CREATE_BOOK, {
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
      await createBook({
        variables: {
          title: formData.title,
          author: formData.author,
          summary: formData.summary || null
        }
      });
    } catch (err) {
      console.error('Error creating book:', err);
      setErrors({
        ...errors,
        form: 'Failed to create book. Please try again.'
      });
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add New Book</h2>
      
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
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Book'}
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
