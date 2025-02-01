// library should have header with search and profile
// should be able to search books by name and author
// should have a list with books read, in progress and to be read
// books should have a status of to be read, in progress or finished
// should have a library object with a list of books and methods to read books, get books by category, search by keyword, add and remove a book
// a button to add a book that opens a modal where user can select what book to add and to select the status
// the book should have the option to remove, to change status and to opdate the pages read to keep track
// the in progress books should have a diffrent card for desktop

// declare a constant with three status values
const STATUS = {
    QUEUE: "queue",
    IN_PROGRESS: "in progress",
    FINISHED: "finished",
};

// create a constructor for the book (can be convertated to a class but for learning i will use function constructor and object prototype)
function Book(title, author, pages, status, pagesRead, category) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.pagesRead = pagesRead || 0;
    this.category = category;
}

// prototypes for Books
Book.prototype.getBookLength = function () {
    return `The book ${this.title} has ${this.pages}. Yes is a ${
        this.pages < 300 ? "short" : "lomg"
    } book`;
};

Book.prototype.updateProgress = function (value) {
    this.pagesRead = value;
    return this.pagesRead;
};

Book.prototype.updateStatus = function (status) {
    this.status = status;
};

// create a constructor for library with list of books and methods
function Library() {
    this.bookList = [];
}

// protoypes for Library
Library.prototype.getBooks = function () {
    return this.bookList;
};

Library.prototype.getCategoryOfBooks = function (category) {
    return this.bookList.filter((book) => {
        return book.category.includes(category);
    });
};

Library.prototype.addToBook = function (book) {
    this.bookList.push(book);
};

Library.prototype.removeBook = function (bookToBeRemoved) {
    const newList = this.bookList.filter((book) => {
        return book.title !== bookToBeRemoved.title;
    });

    this.bookList = newList;
};

Library.prototype.searchBook = function (keyword) {
    const found = this.bookList.filter((obj) => {
        return Object.keys(obj).some(function (key) {
            return obj[key].includes(keyword); // error in console
        });
    });

    return found;
};

const library = new Library();

const theHobbit = new Book(
    "The Hobbit",
    "J.R.R Tolkein",
    256,
    STATUS.FINISHED,
    256,
    "fantasy"
);
const theShining = new Book(
    "The Shining",
    "Stephen King",
    511,
    STATUS.QUEUE,
    0,
    "horror"
);
const atomicHabbits = new Book(
    "Atomic Habbits",
    "James Clear",
    489,
    STATUS.QUEUE,
    0,
    "personal development"
);

console.log(theHobbit.updateProgress(10));

library.addToBook(theHobbit);
library.addToBook(theShining);
library.addToBook(atomicHabbits);
console.log(library.getBooks());
library.removeBook(theHobbit);
console.log("-------------");
console.log(library.getBooks());
console.log(library.getCategoryOfBooks("development"));
console.log("-------------");
console.log(library.searchBook("ato"));
console.log(library.searchBook("king"));
