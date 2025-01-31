// library should have header with search and profile
// should be able to search books by name and author
// should have a list with books read, in progress and to be read
// books should have a status of to be read, in progress or finished
// should have a library object with a lists for each status or three separatly lists
// a button to add a book that opens a modal where user can select what book to add and to select the status
// the book should have the option to remove, to change status and to opdate the pages read to keep track
// the in progress books should have a diffrent card for desktop

const STATUS = {
    QUEUE: "queue",
    IN_PROGRESS: "in progress",
    FINISHED: "finished",
};

function Book(title, author, pages, status, pagesRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
    this.pagesRead = pagesRead || 0;
    this.info = function () {
        return `${this.title} from ${this.author}, ${this.pages}, ${
            this.status === STATUS.FINISHED ? "already read" : "not read yet"
        }`;
    };
}

const theHobbit = new Book("The Hobbit", "J.R.R Tolkein", 256, STATUS.FINISHED);
const theShining = new Book("The Shining", "Stephen King", 511, STATUS.QUEUE);

console.log(theHobbit.info());
console.log(theShining.info());

Book.prototype.getBookLength = function () {
    return `The book ${this.title} has ${this.pages}. Yes is a ${
        this.pages < 300 ? "short" : "lomg"
    } book`;
};

Book.prototype.updateProgress = function (value) {
    this.pagesRead = value;
    return this.pagesRead;
};

console.log(theHobbit.getBookLength());
console.log(theShining.getBookLength());
console.log(theShining.updateProgress(0));
console.log(theHobbit.updateProgress(10));

console.log(Object.getPrototypeOf(theHobbit));

console.log(theHobbit.valueOf());
