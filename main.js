let books = [];
const storageKey = "bookshelf_apps";

function addBook(event) {
  event.preventDefault();
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = document.getElementById("bookFormYear").value;
  const bookIsComplete = document.getElementById("bookFormIsComplete").checked;

  const book = {
    id: +new Date(),
    title: bookTitle,
    author: bookAuthor,
    year: Number(bookYear),
    isComplete: bookIsComplete,
  };

  books.push(book);
  saveData();
  renderBooks();
  event.target.reset();
  updateSubmitButtonText();
}

function renderBooks(filteredBooks = books) {
  const incompleteBookshelf = document.getElementById("incompleteBookList");
  const completeBookshelf = document.getElementById("completeBookList");
  incompleteBookshelf.innerHTML = "";
  completeBookshelf.innerHTML = "";

  for (const book of filteredBooks) {
    const bookElement = createElement(book);

    if (book.isComplete) {
      completeBookshelf.appendChild(bookElement);
    } else {
      incompleteBookshelf.appendChild(bookElement);
    }
  }
}

function createElement(book) {
  const bookElement = document.createElement("div");
  bookElement.classList.add("book-item");
  bookElement.setAttribute("data-bookid", book.id);
  bookElement.setAttribute("data-testid", "bookItem");

  const bookTitle = document.createElement("h2");
  bookTitle.textContent = book.title;
  bookTitle.setAttribute("data-testid", "bookItemTitle");

  const bookAuthor = document.createElement("p");
  bookAuthor.textContent = `Penulis : ${book.author}`;
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");

  const bookYear = document.createElement("p");
  bookYear.textContent = `Tahun : ${book.year}`;
  bookYear.setAttribute("data-testid", "bookItemYear");

  bookElement.appendChild(bookTitle);
  bookElement.appendChild(bookAuthor);
  bookElement.appendChild(bookYear);

  const toggleButton = document.createElement("button");
  toggleButton.textContent = book.isComplete
    ? "Belum Selesai dibaca"
    : "Selesai dibaca";
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleButton.addEventListener("click", () => toggleBookStatus(book.id));

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Hapus";
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.addEventListener("click", () => deleteBook(book.id));

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.addEventListener("click", () => editBook(book.id));

  bookElement.appendChild(toggleButton);
  bookElement.appendChild(deleteButton);
  bookElement.appendChild(editButton);

  return bookElement;
}

function toggleBookStatus(bookId) {
  const book = books.find((book) => book.id === bookId);

  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();
  }
}

function updateSubmitButtonText() {
  const checkbox = document.getElementById("bookFormIsComplete");
  const submitButton = document.getElementById("bookFormSubmit");
  const submitButtonText = submitButton.querySelector("span");

  if (checkbox.checked) {
    submitButtonText.textContent = "Selesai dibaca";
  } else {
    submitButtonText.textContent = "Belum selesai dibaca";
  }
}

function searchBooks(event) {
  event.preventDefault();
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  if (searchTitle === "") {
    renderBooks();
  } else {
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTitle)
    );
    renderBooks(filteredBooks);
  }
}

function deleteBook(bookId) {
  books = books.filter((book) => book.id !== bookId);
  saveData();
  renderBooks();
}

function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(books));
}

function editBook(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;

    deleteBook(bookId);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const checkbox = document.getElementById("bookFormIsComplete");

  checkbox.addEventListener("change", updateSubmitButtonText);
  updateSubmitButtonText();
  bookForm.addEventListener("submit", addBook);

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", searchBooks);

  if (localStorage.getItem(storageKey)) {
    books = JSON.parse(localStorage.getItem(storageKey));
  } else {
    books = [];
  }
  renderBooks();
});
