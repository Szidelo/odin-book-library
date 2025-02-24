export function createLargeCard(book, size) {
	const card = document.createElement("div");
	card.classList.add("card-xl");
	card.dataset.id = book.id;

	console.log("+++++++++++book card id", book.id);

	if (size === "small") {
		card.classList.add("variation-small");
	}

	// Book Cover
	const bookCover = document.createElement("div");
	bookCover.classList.add("card-xl__book-cover");

	const title = document.createElement("h3");
	title.textContent = book.title;

	const author = document.createElement("p");
	author.textContent = book.author;

	if (book.cover) {
		bookCover.style.backgroundImage = `url(${book.cover})`;
		bookCover.style.backgroundSize = "cover";
	} else {
		bookCover.appendChild(title);
		bookCover.appendChild(author);
	}

	// Info Section
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

	const getReadPercentage = () => {
		if (book.pagesRead === 0) return 0;
		return ((book.pagesRead / book.pages) * 100).toFixed(2);
	};
	progressFill.style.width = `${getReadPercentage}%`;

	const progressText = document.createElement("p");
	progressText.innerHTML = `
        <span class="pages-finished">${book.pagesRead}</span> of 
        <span class="pages-total">${book.pages}</span> Pages
    `;

	progressBar.appendChild(progressFill);

	progress.appendChild(progressTitle);
	progress.appendChild(progressBar);
	progress.appendChild(progressText);

	const editButton = document.createElement("button");
	editButton.textContent = "Edit Book -->";
	editButton.classList.add("edit-book-btn");
	editButton.dataset.id = book.id;

	console.log("card book id", book.id);

	info.appendChild(infoHeader);
	info.appendChild(progress);
	info.appendChild(editButton);

	card.appendChild(bookCover);
	card.appendChild(info);

	return card;
}
