// Set timestamp when page loads
const timestampField = document.getElementById("timestamp");
if (timestampField) {
    const now = new Date();
    timestampField.value = now.toISOString();
}

// Modal functionality
const modalTriggers = document.querySelectorAll(".modal-trigger");
const modalOverlays = document.querySelectorAll(".modal-overlay");
const modalCloseButtons = document.querySelectorAll(".modal-close");

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("active");
        const closeBtn = modal.querySelector(".modal-close");
        if (closeBtn) closeBtn.focus();
    }
}

function closeModal(modal) {
    modal.classList.remove("active");
}

modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
        const modalId = trigger.getAttribute("data-modal");
        openModal(modalId);
    });
});

modalCloseButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        closeModal(btn.closest(".modal-overlay"));
    });
});

modalOverlays.forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closeModal(overlay);
        }
    });
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modalOverlays.forEach((overlay) => {
            if (overlay.classList.contains("active")) {
                closeModal(overlay);
            }
        });
    }
});