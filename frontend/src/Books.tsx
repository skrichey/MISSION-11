import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  category: string;
  pageCount: number;
  price: number;
}

const Books = () => {
  // State for books, total books, current page, and page size
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [sortBy, setSortBy] = useState<string>('Title');

  // Fetch books from the API
  const fetchBooks = async () => {
    const response = await fetch(
      `https://localhost:5000/api/books?page=${pageNum}&pageSize=${pageSize}&sortBy=${sortBy}`
    );
    const data = await response.json();
    setBooks(data.books);
    setTotalBooks(data.totalBooks);
  };

  // Effect to run when pageNum, pageSize, or sortBy changes
  useEffect(() => {
    fetchBooks();
  }, [pageNum, pageSize, sortBy]);

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalBooks / pageSize);

  // Handle page change
  const handlePageChange = (newPageNum: number) => {
    if (newPageNum > 0 && newPageNum <= totalPages) {
      setPageNum(newPageNum);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPageNum(1); // Reset to the first page whenever the page size changes
  };

  return (
    <div className="App">
      <h1>Bookstore</h1>

      {/* Sort by dropdown */}
      <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
        <option value="Title">Title</option>
        <option value="Author">Author</option>
      </select>

      {/* Page size dropdown */}
      <select onChange={handlePageSizeChange} value={pageSize}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="16">16</option>
        <option value="20">20</option>
      </select>

      {/* Books List */}
      <ul>
        {books.map((book) => (
          <li key={book.bookId}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Publisher: {book.publisher}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Category: {book.category}</p>
            <p>Pages: {book.pageCount}</p>
            <p>Price: ${book.price}</p>
          </li>
        ))}
      </ul>

      {/* Pagination Buttons */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(pageNum - 1)}
          disabled={pageNum === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={pageNum === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(pageNum + 1)}
          disabled={pageNum === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Books;
