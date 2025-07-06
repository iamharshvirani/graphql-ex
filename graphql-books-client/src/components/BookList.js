import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_BOOKS = gql`
  query {
    books {
      id
      title
      author
    }
  }
`;

export default function BookList() {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Book List</h2>
      <ul className="list-group">
        {data.books.map((book) => (
          <li key={book.id} className="list-group-item">
            <strong>{book.title}</strong> — {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}
