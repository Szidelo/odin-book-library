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
            <button class="close-modal">×</button>
            <h2>Edit Book</h2>
            <div>
                <label for="modal-title">Title:</label>
                <input type="text" id="modal-title" value="${
                    selectedBook.title
                }" disabled />
            </div>
            <div>
                <label for="modal-author">Author:</label>
                <input type="text" id="modal-author" value="${
                    selectedBook.author
                }" disabled />
            </div>
            <div>
                <label for="modal-category">Category:</label>
                <input type="text" id="modal-category" value="${
                    selectedBook.category
                }" disabled />
            </div>
            <div>
                <label for="modal-pages-read">Pages Read:</label>
                <input type="number" id="modal-pages-read" value="${
                    selectedBook.pagesRead
                }" min="0" max="${selectedBook.pages}" />
            </div>
            <div>
                <label for="modal-status">Status:</label>
                <select id="modal-status">
                    <option value="${STATUS.QUEUE}" ${
        selectedBook.status === STATUS.QUEUE ? "selected" : ""
    }>To Be Read</option>
                    <option value="${STATUS.IN_PROGRESS}" ${
        selectedBook.status === STATUS.IN_PROGRESS ? "selected" : ""
    }>In Progress</option>
                    <option value="${STATUS.FINISHED}" ${
        selectedBook.status === STATUS.FINISHED ? "selected" : ""
    }>Finished</option>
                </select>
            </div>
            <button id="save-book">Save Changes</button>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModalBtn = modal.querySelector(".close-modal");
    closeModalBtn.addEventListener("click", () => {
        modal.remove();
    });

    const saveBookBtn = modal.querySelector("#save-book");
    saveBookBtn.addEventListener("click", () => {
        const pagesRead = parseInt(
            modal.querySelector("#modal-pages-read").value,
            10
        );
        const status = modal.querySelector("#modal-status").value;

        selectedBook.updateProgress(pagesRead);
        selectedBook.updateStatus(status);

        modal.remove();

        renderBooks(library.getBooks());
    });
}
