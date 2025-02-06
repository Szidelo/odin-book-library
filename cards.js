export function createLargeCard(book, size) {
    const card = document.createElement("div");

    card.classList.add("card-xl");

    if (size === "small") {
        card.classList.add("variation-col");
    }

    // book cover
    const bookCover = document.createElement("div");
    bookCover.classList.add("card-xl__book-cover");

    const title = document.createElement("h3");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.textContent = book.author;

    bookCover.appendChild(title);
    bookCover.appendChild(author);

    // info section
    const info = document.createElement("div");
    info.classList.add("card-xl__info");

    const infoHeader = document.createElement("div");
    infoHeader.classList.add("info-header");

    const infoTitle = document.createElement("h3");
    infoTitle.textContent = book.title;

    const infoAuthor = document.createElement("p");
    infoAuthor.textContent = book.author;

    infoHeader.appendChild(infoTitle);
    infoHeader.appendChild(infoAuthor);

    const progress = document.createElement("div");
    progress.classList.add("info-progress");

    const progressTitle = document.createElement("h3");
    progressTitle.textContent = "Your Progress";

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");

    const progressFill = document.createElement("div");
    progressFill.classList.add("progress-bar__fill");
    progressFill.style.width = `${book.getPercentRead()}%`;

    const progressText = document.createElement("p");
    progressText.innerHTML = `
        <span class="pages-finished">${book.pagesRead}</span> of 
        <span class="pages-total">${book.pages}</span> Pages
    `;

    progressBar.appendChild(progressFill);

    progress.appendChild(progressTitle);
    progress.appendChild(progressBar);
    progress.appendChild(progressText);

    info.appendChild(infoHeader);
    info.appendChild(progress);

    card.appendChild(bookCover);
    card.appendChild(info);

    return card;
}
