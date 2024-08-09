document.addEventListener('DOMContentLoaded', () => {
    const flashcardContainer = document.getElementById('flashcard-container');
    const flashcardForm = document.getElementById('flashcard-form');
    const questionInput = document.getElementById('question-input');
    const answerInput = document.getElementById('answer-input');
    const startPresentationButton = document.getElementById('start-presentation');
    const modal = document.getElementById('presentation-modal');
    const closeModalButton = document.getElementById('close-modal');
    const presentationQuestion = document.getElementById('presentation-question');
    const presentationAnswer = document.getElementById('presentation-answer');
    const nextFlashcardButton = document.getElementById('next-flashcard');
    const body = document.body;

    let flashcards = [];
    let currentFlashcardIndex = 0;

    // Load flashcards from localStorage
    loadFlashcards();

    flashcardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addFlashcard(questionInput.value, answerInput.value);
        questionInput.value = '';
        answerInput.value = '';
    });

    startPresentationButton.addEventListener('click', () => {
        currentFlashcardIndex = 0;
        showFlashcardInPresentation();
        modal.style.display = 'flex';
        body.classList.add('modal-open');
    });

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
        body.classList.remove('modal-open');
    });

    nextFlashcardButton.addEventListener('click', () => {
        currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcards.length;
        showFlashcardInPresentation();
    });

    function addFlashcard(question, answer) {
        const flashcard = document.createElement('div');
        flashcard.classList.add('flashcard');
        flashcard.innerHTML = `
            <div class="question">${question}</div>
            <div class="answer">${answer}</div>
            <button>X</button>
        `;

        flashcard.addEventListener('click', () => {
            flashcard.classList.toggle('show');
        });

        const deleteButton = flashcard.querySelector('button');
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = flashcards.findIndex(f => f.question === question && f.answer === answer);
            if (index !== -1) flashcards.splice(index, 1);
            flashcardContainer.removeChild(flashcard);
            saveFlashcards();
        });

        flashcardContainer.appendChild(flashcard);
        flashcards.push({ question, answer });
        saveFlashcards();
    }

    function saveFlashcards() {
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
    }

    function loadFlashcards() {
        const storedFlashcards = JSON.parse(localStorage.getItem('flashcards'));
        if (storedFlashcards) {
            storedFlashcards.forEach(flashcard => addFlashcard(flashcard.question, flashcard.answer));
        }
    }

    function showFlashcardInPresentation() {
        const flashcard = flashcards[currentFlashcardIndex];
        presentationQuestion.innerText = flashcard.question;
        presentationAnswer.innerText = flashcard.answer;
        presentationAnswer.style.display = 'none';
    }

    presentationQuestion.addEventListener('click', () => {
        presentationAnswer.style.display = 'block';
    });
});
