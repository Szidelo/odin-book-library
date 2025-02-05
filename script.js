// library should have header with search and profile
// should be able to search books by name and author
// should have a list with books read, in progress and to be read
// books should have a status of to be read, in progress or finished
// should have a library object with a list of books and methods to read books, get books by category, search by keyword, add and remove a book
// a button to add a book that opens a modal where user can select what book to add and to select the status
// the book should have the option to remove, to change status and to update the pages read to keep track
// the in progress books should have a different card for desktop

// declare a constant with three status values

import { createLargeCard } from "./card.js";

const STATUS = {
    QUEUE: "queue",
    IN_PROGRESS: "in progress",
    FINISHED: "finished",
};

const inProgressList = document.querySelector(".list");

// create a constructor for the book (can be converted to a class but for learning i will use function constructor and object prototype)
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
        this.pages < 300 ? "short" : "long"
    } book`;
};

Book.prototype.updateProgress = function (value) {
    this.pagesRead = value;
    return this.pagesRead;
};

Book.prototype.getPercentRead = function () {
    if (this.pagesRead === 0) return 0;
    return ((this.pagesRead / this.pages) * 100).toFixed(2);
};

Book.prototype.updateStatus = function (status) {
    this.status = status;
};

// create a constructor for library with list of books and methods
function Library() {
    this.bookList = [];
}

// prototypes for Library
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
    return this.bookList.filter((book) => {
        return Object.values(book)
            .join(" ")
            .toLowerCase()
            .includes(keyword.toLowerCase());
    });
};

const library = new Library();

const theHobbit = new Book(
    "The Hobbit",
    "J.R.R Tolkien",
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
const atomicHabits = new Book(
    "Atomic Habits",
    "James Clear",
    489,
    STATUS.QUEUE,
    100,
    "personal development"
);

// const cardLarge = createLargeCard(atomicHabits);
// const inProgressList = document.querySelector(".active-books");
// inProgressList.append(cardLarge);
// console.log(theHobbit.updateProgress(10));

const displayInProgreesBooks = (book) => {
    const cardLarge = createLargeCard(book);
    inProgressList.append(cardLarge);
};

displayInProgreesBooks(atomicHabits);
displayInProgreesBooks(theHobbit);
displayInProgreesBooks(theShining);

library.addToBook(theHobbit);
library.addToBook(theShining);
library.addToBook(atomicHabits);
console.log(library.getBooks());
library.removeBook(theHobbit);
console.log("-------------");
console.log(library.getBooks());
console.log(library.getCategoryOfBooks("development"));
console.log("-------------");
console.log(library.searchBook("ato"));
console.log(library.searchBook("king"));
console.log(library.searchBook("ho"));
console.log(`${theHobbit.getPercentRead()}%`);
console.log(theHobbit.updateProgress(200));
console.log(`${theHobbit.getPercentRead()}%`);
