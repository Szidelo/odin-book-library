// library should have header with search and profile
// should be able to search books by name and author
// should have a list with books read, in progress and to be read
// books should have a status of to be read, in progress or finished
// should have a library object with a list of books and methods to read books, get books by category, search by keyword, add and remove a book
// a button to add a book that opens a modal where user can select what book to add and to select the status
// the book should have the option to remove, to change status and to update the pages read to keep track
// the in progress books should have a different card for desktop

import { createLargeCard } from "./cards.js";

// declare a constant with three status values

const STATUS = {
	QUEUE: "queue",
	IN_PROGRESS: "in progress",
	FINISHED: "finished",
};

const inProgressList = document.querySelector("#in-progress");
const inQueueList = document.querySelector("#in-queue");
const finishedList = document.querySelector("#finished");

// create a constructor for the book (can be converted to a class but for learning i will use function constructor and object prototype)
function Book(title, author, pages, status, pagesRead, category, cover) {
	// create a read only id
	Object.defineProperty(this, "id", {
		value: crypto.randomUUID(), // Generates a unique ID
		writable: false, // Makes it read-only
		enumerable: true, // Allows it to show up in Object.keys()
		configurable: false, // Prevents deletion or redefinition
	});

	this.title = title;
	this.author = author;
	this.pages = pages;
	this.status = status;
	this.pagesRead = pagesRead || 0;
	this.category = category;
	this.cover = cover;
}

// prototypes for Books
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
	this.status === `${STATUS.FINISHED}` && this.updateProgress(this.pages);
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
		return Object.values(book).join(" ").toLowerCase().includes(keyword.toLowerCase());
	});
};

const library = new Library();

const theHobbit = new Book("The Hobbit", "J.R.R Tolkien", 256, STATUS.IN_PROGRESS, 206, "fantasy");
const theShining = new Book("The Shining", "Stephen King", 511, STATUS.QUEUE, 0, "horror");
const atomicHabits = new Book("Atomic Habits", "James Clear", 489, STATUS.IN_PROGRESS, 100, "personal development");

const displayInProgressBooks = (book) => {
	const cardLarge = createLargeCard(book, "large");
	inProgressList.appendChild(cardLarge);
};

const displayInQueueBooks = (book) => {
	const card = createLargeCard(book, "small");
	inQueueList.appendChild(card);
};

const displayFinishedBooks = (book) => {
	const card = createLargeCard(book, "small");
	finishedList.appendChild(card);
};

library.addToBook(theHobbit);
library.addToBook(theShining);
library.addToBook(atomicHabits);
// console.log(library.getBooks());
// console.log("-------------");
// console.log(library.getBooks());
// console.log(library.getCategoryOfBooks("development"));
// console.log("-------------");
// console.log(library.searchBook("ato"));
// console.log(library.searchBook("king"));
// console.log(library.searchBook("ho"));
// console.log(theHobbit.updateProgress(200));
// console.log(theHobbit);

library.bookList.forEach((book) => {
	if (book.status === STATUS.IN_PROGRESS) {
		displayInProgressBooks(book);
	} else if (book.status === STATUS.QUEUE) {
		displayInQueueBooks(book);
	} else {
		displayFinishedBooks(book);
	}
});

const addBookBtn = document.querySelector("#add-book");
const formContainer = document.querySelector(".add-form-container");
const closeFormBtn = document.createElement("button");
const addForm = document.querySelector("#add-form");

closeFormBtn.textContent = "×";
closeFormBtn.classList.add("close-btn");
formContainer.appendChild(closeFormBtn);

addBookBtn.addEventListener("click", () => {
	formContainer.style.display = "block";

	setTimeout(() => {
		formContainer.classList.remove("hide");
		formContainer.classList.add("show");
	}, 10);
});

closeFormBtn.addEventListener("click", () => {
	formContainer.classList.remove("show");
	formContainer.classList.add("hide");

	setTimeout(() => {
		formContainer.style.display = "none";
	}, 300);
});

addForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const title = e.target.title.value.trim();
	const author = e.target.author.value.trim();
	const pages = parseInt(e.target.pages.value.trim(), 10) || 0;
	const pagesRead = 0;
	const status = STATUS.QUEUE;
	const category = e.target.genre.value;
	const cover = e.target.cover.value || "";

	if (!title || !author || !status) {
		alert("Please fill in all required fields!");
		return;
	}

	const newBook = new Book(title, author, pages, status, pagesRead, category, cover);
	library.addToBook(newBook);

	displayInQueueBooks(newBook);

	addForm.reset();

	formContainer.classList.remove("show");
	formContainer.classList.add("hide");

	setTimeout(() => {
		formContainer.style.display = "none";
	}, 300);
	console.log(library.getBooks());
});
