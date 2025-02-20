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
    saveBookBtn.addEventListener("click", () => {
        const pagesRead = parseInt(
            modal.querySelector("#modal-pages-read").value,
            10
        );
        const status = modal.querySelector("#modal-status").value;

        selectedBook.updateProgress(pagesRead);
        selectedBook.updateStatus(status);

        modal.querySelector(".modal-content").classList.remove("show");
        modal.querySelector(".modal-content").classList.add("hide");

        setTimeout(() => {
            modal.classList.remove("show");
            modal.remove(); // remove modal after the animation completes
            renderBooks(library.getBooks());
        }, 300); // delay removal until animation is finished
    });
}
