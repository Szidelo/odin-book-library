// library should have header with search and profile
// should be able to search books by name and author
// should have a list with books read, in progress and to be read
// books should have a status of to be read, in progress or finished
// should have a library object with a list of books and methods to read books, get books by category, search by keyword, add and remove a book
// a button to add a book that opens a modal where user can select what book to add and to select the status
// the book should have the option to remove, to change status and to update the pages read to keep track
// the in progress books should have a different card for desktop
// when click on book card, open a modal to edit book

import { createLargeCard } from "./cards.js";
import { createBookModal } from "./bookModal.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
	getFirestore,
	getDoc,
	doc,
	setDoc,
	addDoc,
	updateDoc,
	collection,
	getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
	apiKey: "AIzaSyD5afL-Mohj4kQwRu7mtaMv-o6qs6AQRTY",
	authDomain: "book-library-60b1e.firebaseapp.com",
	projectId: "book-library-60b1e",
	storageBucket: "book-library-60b1e.firebasestorage.app",
	messagingSenderId: "845622686464",
	appId: "1:845622686464:web:ea9296f8065188bdfbb9e5",
	measurementId: "G-GL7TZYDBX5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// declare a constant with three status values
const STATUS = {
	QUEUE: "queue",
	IN_PROGRESS: "in progress",
	FINISHED: "finished",
};

let userName = "";
let userPhotoURL = "";

// ui
const inProgressList = document.querySelector("#in-progress");
const inQueueList = document.querySelector("#in-queue");
const finishedList = document.querySelector("#finished");
const addBookBtn = document.querySelector("#add-book");
const formContainer = document.querySelector(".add-form-container");
const closeFormBtn = document.createElement("button");
const addForm = document.querySelector("#add-form");
const searchInput = document.querySelector("#search");
const spinner = document.createElement("div");
const loadingSpinner = document.createElement("div");
loadingSpinner.classList.add("spinner");
spinner.classList.add("spinner-container");
spinner.appendChild(loadingSpinner);
spinner.id = "loading-spinner";
const body = document.querySelector("body");
body.appendChild(spinner);

onAuthStateChanged(auth, (user) => {
	const loggedInUserId = localStorage.getItem("userId");
	const userNameElement = document.getElementById("user-name");
	const userAvatar = document.getElementById("avatar");

	if (loggedInUserId) {
		console.log(user);
		const docRef = doc(db, "users", loggedInUserId);
		getDoc(docRef)
			.then((docSnap) => {
				if (docSnap.exists()) {
					const userData = docSnap.data();
					userName = userData.lastName;
					userPhotoURL = userData.photoURL;
					userNameElement.textContent = userName;
					userAvatar.src = userPhotoURL;
					body.removeChild(spinner);
					console.log("Document data:", userData);
				} else {
					console.log("no document found matching id");
				}
			})
			.catch((error) => {
				console.log("Error getting document", error);
			});
	} else {
		console.log("User Id not Found in Local storage");
		window.location.href = "./auth.html";
	}
});

// create a constructor for the book (can be converted to a class but for learning i will use function constructor and object prototype)
function Book(title, author, pages, status, pagesRead, category, cover) {
	this.userId = localStorage.getItem("userId") || "no user";
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.status = status;
	this.pagesRead = pagesRead || 0;
	this.category = category;
	this.cover = cover;
}

// prototypes for Books
Book.prototype.updateProgress = async function (value) {
	this.pagesRead = value;
	try {
		const docRef = doc(db, "users", this.userId, "books", this.id);
		await updateDoc(docRef, { pagesRead: value });
	} catch (error) {
		console.log(error);
	}
	return this.pagesRead;
};

Book.prototype.getPercentRead = function () {
	if (this.pagesRead === 0) return 0;
	return ((this.pagesRead / this.pages) * 100).toFixed(2);
};

Book.prototype.updateStatus = async function (status) {
	this.status = status;
	console.log(this.id);
	try {
		const docRef = doc(db, "users", this.userId, "books", this.id);
		console.log(docRef);
		await updateDoc(docRef, { status });
		console.log(`Updated status for book ${this.id} to ${status}`);
	} catch (error) {
		console.error("Error updating status:", error);
	}
};

Book.prototype.updateCategory = function (category) {
	this.category = category;
};

Book.prototype.updateCover = function (cover) {
	this.cover = cover;
};

// create a constructor for library with list of books and methods
function Library() {
	this.bookList = [];
	this.userId = localStorage.getItem("userId") || "no user";
}

// TODO: create a method to update the list of books so getBooks() returns the updated list without accessing the database
// TODO: updateList method should be called when a book is added, edited or removed

// prototypes for Library
Library.prototype.getBooks = async function () {
	try {
		const booksCollectionRef = collection(db, "users", this.userId, "books");
		const querySnapshot = await getDocs(booksCollectionRef);

		this.bookList = querySnapshot.docs
			.map((doc) => {
				const data = doc.data();
				return new Book(data.title, data.author, data.pages, data.status, data.pagesRead, data.category, data.cover);
			})
			.map((book, index) => {
				book.id = querySnapshot.docs[index].id; // Assign correct Firestore ID
				return book;
			});

		console.log("Books retrieved:", this.bookList);
		return this.bookList;
	} catch (error) {
		console.error("Error getting books:", error);
		return [];
	}
};

Library.prototype.getCategoryOfBooks = function (category) {
	return this.bookList.filter((book) => {
		return book.category.includes(category);
	});
};

Library.prototype.addToBook = async function (book) {
	const booksCollectionRef = collection(db, "users", this.userId, "books");

	try {
		const docRef = await addDoc(booksCollectionRef, {
			title: book.title || "title not defined",
			author: book.author || "author not defined",
			pages: book.pages || "pages not defined",
			status: book.status || STATUS.QUEUE,
			pagesRead: book.pagesRead || 0,
			category: book.category || "category not defined",
			cover: book.cover || "",
		});

		book.id = docRef.id;
		this.bookList.push(book);
		console.log("Book added:", book);
	} catch (error) {
		console.log("Error adding book:", error);
	}
};

Library.prototype.removeBook = async function (bookToBeRemoved) {
	try {
		await deleteDoc(doc(db, "users", this.userId, "books", bookToBeRemoved.id));
		this.bookList = this.bookList.filter((book) => book.id !== bookToBeRemoved.id);
		console.log("Book deleted:", bookToBeRemoved.title);
	} catch (error) {
		console.log("Error deleting book:", error);
	}
};

Library.prototype.searchBook = function (keyword) {
	return this.bookList.filter((book) => {
		return Object.values(book).join(" ").toLowerCase().includes(keyword.toLowerCase());
	});
};

const library = new Library();

// // mock books
// const theHobbit = new Book("The Hobbit", "J.R.R Tolkien", 256, STATUS.IN_PROGRESS, 206, "fantasy");
// const theShining = new Book("The Shining", "Stephen King", 511, STATUS.QUEUE, 0, "horror");
// const atomicHabits = new Book("Atomic Habits", "James Clear", 489, STATUS.IN_PROGRESS, 100, "personal development");

// // add mock books to library
// library.addToBook(theHobbit);
// library.addToBook(theShining);
// library.addToBook(atomicHabits);

const displayBooksByStatus = (book, status) => {
	const { IN_PROGRESS, QUEUE, FINISHED } = STATUS;
	const cssClass = status === IN_PROGRESS ? "large" : "small";
	const card = createLargeCard(book, cssClass);
	switch (status) {
		case IN_PROGRESS:
			inProgressList.appendChild(card);
			break;
		case QUEUE:
			inQueueList.appendChild(card);
			break;
		case FINISHED:
			finishedList.appendChild(card);
	}
};

closeFormBtn.textContent = "×";
closeFormBtn.classList.add("close-btn");
closeFormBtn.classList.add("form-close");
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

addForm.addEventListener("submit", async (e) => {
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

	const books = await library.getBooks();
	renderBooks(books);

	addForm.reset();

	formContainer.classList.remove("show");
	formContainer.classList.add("hide");

	setTimeout(() => {
		formContainer.style.display = "none";
	}, 300);
});

const renderBooks = (books) => {
	const { IN_PROGRESS, QUEUE, FINISHED } = STATUS;

	inProgressList.innerHTML = "";
	inQueueList.innerHTML = "";
	finishedList.innerHTML = "";

	let hasInProgress = false;
	let hasQueue = false;
	let hasFinished = false;
	console.log("books", books);
	books.forEach((book) => {
		if (book.status === IN_PROGRESS) {
			displayBooksByStatus(book, IN_PROGRESS);
			hasInProgress = true;
		} else if (book.status === QUEUE) {
			displayBooksByStatus(book, QUEUE);
			hasQueue = true;
		} else {
			displayBooksByStatus(book, FINISHED);
			hasFinished = true;
		}
	});

	inProgressList.parentElement.style.display = hasInProgress ? "initial" : "none";
	inQueueList.parentElement.style.display = hasQueue ? "initial" : "none";
	finishedList.parentElement.style.display = hasFinished ? "initial" : "none";
};

(async () => {
	const books = await library.getBooks();
	renderBooks(books);
})();

searchInput.addEventListener("input", (e) => {
	const keyword = e.target.value;
	const filteredBooks = library.searchBook(keyword);
	renderBooks(filteredBooks);
});

document.addEventListener("click", async (e) => {
	if (e.target.classList.contains("edit-book-btn")) {
		const bookId = e.target.dataset.id;
		const books = await library.getBooks();

		// Log to debug
		console.log("Clicked Book ID:", bookId);
		console.log(
			"Book List:",
			books.map((book) => book.id)
		);

		const selectedBook = books.find((book) => book.id === bookId);

		if (selectedBook) {
			createBookModal(selectedBook, library, renderBooks);
			console.log("Selected book:", selectedBook);
		} else {
			console.log("No book found with this ID:", bookId);
		}
	}
});

const enableHorizontalScroll = (containerId) => {
	const list = document.getElementById(containerId);
	let isDown = false;
	let startX;
	let scrollLeft;

	list.addEventListener("mousedown", (e) => {
		isDown = true;
		list.classList.add("active");
		startX = e.pageX - list.offsetLeft;
		scrollLeft = list.scrollLeft;
	});

	list.addEventListener("mouseleave", () => {
		isDown = false;
		list.classList.remove("active");
	});

	list.addEventListener("mouseup", () => {
		isDown = false;
		list.classList.remove("active");
	});

	list.addEventListener("mousemove", (e) => {
		if (!isDown) return;
		e.preventDefault();
		const x = e.pageX - list.offsetLeft;
		const walk = (x - startX) * 2; // adjust scroll speed
		list.scrollLeft = scrollLeft - walk;
	});

	// Touch support for mobile
	list.addEventListener("touchstart", (e) => {
		startX = e.touches[0].clientX;
		scrollLeft = list.scrollLeft;
	});

	list.addEventListener("touchmove", (e) => {
		const x = e.touches[0].clientX;
		const walk = (x - startX) * 2;
		list.scrollLeft = scrollLeft - walk;
	});
};

["in-progress", "in-queue", "finished"].forEach((containerId) => {
	enableHorizontalScroll(containerId);
});

const logOutBtn = document.getElementById("logout");

logOutBtn.addEventListener("click", () => {
	localStorage.removeItem("userId");
	signOut(auth);
});
