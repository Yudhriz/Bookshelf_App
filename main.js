document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  let books = JSON.parse(localStorage.getItem("books")) || [];

  function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
  }

  function renderBooks(filteredBooks = books) {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    filteredBooks.forEach((book) => {
      const bookElement = document.createElement("div");
      bookElement.setAttribute("data-bookid", book.id);
      bookElement.setAttribute("data-testid", "bookItem");
      bookElement.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button data-testid="bookItemIsCompleteButton">${
            book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
          }</button>
          <button data-testid="bookItemDeleteButton">Hapus Buku</button>
          <button data-testid="bookItemEditButton">Edit Buku</button>
        </div>
      `;

      bookElement
        .querySelector("[data-testid='bookItemIsCompleteButton']")
        .addEventListener("click", () => toggleBookStatus(book.id));
      bookElement
        .querySelector("[data-testid='bookItemDeleteButton']")
        .addEventListener("click", () => deleteBook(book.id));
      bookElement
        .querySelector("[data-testid='bookItemEditButton']")
        .addEventListener("click", () => editBook(book.id));

      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  function addBook(title, author, year, isComplete) {
    const newBook = {
      id: +new Date(),
      title,
      author,
      year: parseInt(year, 10),
      isComplete,
    };
    books.push(newBook);
    saveBooks();
    renderBooks();
  }

  function toggleBookStatus(bookId) {
    books = books.map((book) =>
      book.id === bookId ? { ...book, isComplete: !book.isComplete } : book
    );
    saveBooks();
    renderBooks();
  }

  function deleteBook(bookId) {
    books = books.filter((book) => book.id !== bookId);
    saveBooks();
    renderBooks();
  }

  function editBook(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      document.getElementById("bookFormTitle").value = book.title;
      document.getElementById("bookFormAuthor").value = book.author;
      document.getElementById("bookFormYear").value = book.year;
      document.getElementById("bookFormIsComplete").checked = book.isComplete;
      deleteBook(bookId);
    }
  }

  function searchBook(query) {
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
    renderBooks(filteredBooks);
  }

  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value, 10);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    addBook(title, author, year, isComplete);
    bookForm.reset();
  });

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const query = document.getElementById("searchBookTitle").value;
    searchBook(query);
  });

  renderBooks();
});
