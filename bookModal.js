const STATUS = {
	QUEUE: "queue",
	IN_PROGRESS: "in progress",
	FINISHED: "finished",
};

export function createBookModal(selectedBook, library, renderBooks) {
	const modal = document.createElement("div");
	modal.classList.add("book-modal");

	modal.innerHTML = `
        <div class="modal-content">
            <button class="close-btn">×</button>
             <div class="modal-book-cover">
                <img src="${selectedBook.cover}" alt="${selectedBook.title} cover" id="modal-cover-preview" />
            </div>
            <div class="modal-content__info">
                <h2>Edit Book</h2>
            <div>
                <label for="modal-cover">Cover URL:</label>
                <input type="text" id="modal-cover" value="${
					selectedBook.cover ? selectedBook.cover : ""
				}" placeholder="https://example.com/cover.jpg" />
            </div>
           
            <div>
                <label for="modal-category">Category:</label>
                <input type="text" id="modal-category" value="${selectedBook.category}" />
            </div>
            <div>
                <label for="modal-pages-read">Pages Read:</label>
                <input type="number" id="modal-pages-read" value="${selectedBook.pagesRead}" min="0" max="${selectedBook.pages}" />
            </div>
            <div>
                <label for="modal-status">Status:</label>
                <select id="modal-status">
                    <option value="${STATUS.QUEUE}" ${selectedBook.status === STATUS.QUEUE ? "selected" : ""}>To Be Read</option>
                    <option value="${STATUS.IN_PROGRESS}" ${
		selectedBook.status === STATUS.IN_PROGRESS ? "selected" : ""
	}>In Progress</option>
                    <option value="${STATUS.FINISHED}" ${selectedBook.status === STATUS.FINISHED ? "selected" : ""}>Finished</option>
                </select>
                <button id="save-book">Save Changes</button>
                <button id="remove-book">Remove Book</button>
            </div>
            </div>
        </div>
    `;

	document.body.appendChild(modal);

	// modal animation
	setTimeout(() => {
		modal.classList.add("show");
		const modalContent = modal.querySelector(".modal-content");
		setTimeout(() => modalContent.classList.add("show"), 10); // delay content animation slightly
	}, 10);

	const closeModalBtn = modal.querySelector(".close-btn");
	closeModalBtn.addEventListener("click", () => {
		const modalContent = modal.querySelector(".modal-content");
		modalContent.classList.remove("show");
		modalContent.classList.add("hide");

		setTimeout(() => {
			modal.classList.remove("show");
			modal.remove(); // remove modal after the animation completes
		}, 300); // delay removal until animation is finished
	});

	const saveBookBtn = modal.querySelector("#save-book");
	const removeBookBtn = modal.querySelector("#remove-book");
	removeBookBtn.addEventListener("click", () => {
		library.removeBook(selectedBook);
		renderBooks(library.getBooks());
		closeModalBtn.click();
	});
	saveBookBtn.addEventListener("click", () => {
		const pagesRead = parseInt(modal.querySelector("#modal-pages-read").value, 10);
		const status = modal.querySelector("#modal-status").value;
		const cover = modal.querySelector("#modal-cover").value;
		const category = modal.querySelector("#modal-category").value;

		selectedBook.updateProgress(pagesRead);
		selectedBook.updateStatus(status);
		selectedBook.updateCover(cover);
		selectedBook.updateCategory(category);

		modal.querySelector(".modal-content").classList.remove("show");
		modal.querySelector(".modal-content").classList.add("hide");

		setTimeout(() => {
			modal.classList.remove("show");
			modal.remove(); // remove modal after the animation completes
			renderBooks(library.getBooks());
		}, 300); // delay removal until animation is finished
	});
}
