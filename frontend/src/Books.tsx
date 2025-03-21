import React, { useState, useEffect } from 'react';

// Define the Book interface
export interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  category: string;
  price: number;
  pageCount: number;
}

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch books data from the API
  const fetchBooks = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const response = await fetch(`https://localhost:5000/api/Books?page=${page}&pageSize=${pageSize}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBooks(data.books);
      setTotalBooks(data.totalBooks); // Get total books for pagination
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false); // Set loading to false after fetch completes
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, pageSize]); // Fetch books whenever page or pageSize changes

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalBooks / pageSize);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="my-4">Books</h1>

      {/* Display books */}
      <ul className="list-group mb-4">
        {books.map((book) => (
          <li key={book.bookId} className="list-group-item">
            <strong>{book.title}</strong> by {book.author}
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-primary"
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="btn btn-primary"
          onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Ensure default export
export default Books;
