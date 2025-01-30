function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
    this.info = function () {
        return `${this.title} from ${this.author}, ${this.pages}, ${
            isRead ? "already read" : "not read yet"
        }`;
    };
}

const theHobbit = new Book("The Hobbit", "J.R.R Tolkein", 256, true);
const theShining = new Book("The Shining", "Stephen King", 511, false);

console.log(theHobbit.info());
console.log(theShining.info());

Book.prototype.getBookLength = function () {
    return `The book ${this.title} has ${this.pages}. Yes is a ${
        this.pages < 300 ? "short" : "lomg"
    } book`;
};

console.log(theHobbit.getBookLength());
console.log(theShining.getBookLength());

console.log(Object.getPrototypeOf(theHobbit));

console.log(theHobbit.valueOf());
