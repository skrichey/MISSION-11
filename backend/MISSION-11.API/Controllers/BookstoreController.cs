using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MISSION_11.API.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MISSION_11.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;

        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        // GET: api/books (Handles both paginated and non-paginated requests)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks([FromQuery] int page = 1, [FromQuery] int pageSize = 5, [FromQuery] string sortBy = "Title")
        {
            var skip = (page - 1) * pageSize;

            IQueryable<Book> query = _context.Books;

            if (sortBy == "Author")
            {
                query = query.OrderBy(b => b.Author);
            }
            else
            {
                query = query.OrderBy(b => b.Title);
            }

            var totalBooks = await _context.Books.CountAsync(); // Get the total number of books
            var books = await query.Skip(skip).Take(pageSize).ToListAsync();

            return Ok(new { books, totalBooks }); // Return books and the total count
        }


        // GET: api/books/{id} (Retrieves a single book by its ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        // POST: api/books (Creates a new book)
        [HttpPost]
        public async Task<ActionResult<Book>> CreateBook([FromBody] Book newBook)
        {
            _context.Books.Add(newBook);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBook), new { id = newBook.BookId }, newBook);
        }

        // PUT: api/books/{id} (Updates an existing book)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] Book updatedBook)
        {
            if (id != updatedBook.BookId)
            {
                return BadRequest();
            }

            _context.Entry(updatedBook).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/books/{id} (Deletes a book by ID)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookExists(int id)
        {
            return _context.Books.Any(e => e.BookId == id);
        }
    }
}
