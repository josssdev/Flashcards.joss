document.addEventListener('DOMContentLoaded', () => {
    const flashcardContainer = document.getElementById('flashcard-container');
    const flashcardForm = document.getElementById('flashcard-form');
    const titleInput = document.getElementById('title-input');
    const questionInput = document.getElementById('question-input');
    const answerInput = document.getElementById('answer-input');
    const startPresentationButton = document.getElementById('start-presentation');
    const searchInput = document.getElementById('search-input');
    const modal = document.getElementById('presentation-modal');
    const closeModalButton = document.getElementById('close-modal');
    const presentationTitle = document.getElementById('presentation-title');
    const presentationQuestion = document.getElementById('presentation-question');
    const presentationAnswer = document.getElementById('presentation-answer');
    const nextFlashcardButton = document.getElementById('next-flashcard');
    const body = document.body;

    

    let flashcards = [];
    let currentFlashcardIndex = 0;

    loadFlashcards();

    flashcardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addFlashcard(titleInput.value, questionInput.value, answerInput.value);
        flashcardForm.reset();
    });

    searchInput.addEventListener('input', handleSearch);

    startPresentationButton.addEventListener('click', () => {
        currentFlashcardIndex = 0;
        showFlashcardInPresentation();
        openModal();
    });

    closeModalButton.addEventListener('click', closeModal);

    nextFlashcardButton.addEventListener('click', showNextFlashcard);

    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowRight') {
                showNextFlashcard();
            } else if (e.key === 'ArrowLeft') {
                showPreviousFlashcard();
            }
        }
    });

    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        displayFlashcards(flashcards.filter(flashcard => 
            flashcard.title.toLowerCase().includes(searchTerm) ||
            flashcard.question.toLowerCase().includes(searchTerm) ||
            flashcard.answer.toLowerCase().includes(searchTerm)
        ));
    }

    function addFlashcard(title, question, answer) {
        const flashcard = { title, question, answer };
        flashcards.push(flashcard);
        saveFlashcards();
        displayFlashcards(flashcards);
    }

    function editFlashcard(index, newTitle, newQuestion, newAnswer) {
        flashcards[index] = { title: newTitle, question: newQuestion, answer: newAnswer };
        saveFlashcards();
        displayFlashcards(flashcards);
    }

    function deleteFlashcard(index) {
        flashcards.splice(index, 1);
        saveFlashcards();
        displayFlashcards(flashcards);
    }

    function saveFlashcards() {
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
    }

    function loadFlashcards() {
        const storedFlashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
        flashcards = storedFlashcards;
        displayFlashcards(flashcards);
    }

    function displayFlashcards(flashcardsToDisplay) {
        flashcardContainer.innerHTML = '';
        flashcardsToDisplay.forEach((flashcard, index) => {
            const card = document.createElement('div');
            card.className = 'flashcard';
            card.innerHTML = `
                <h3>${flashcard.title}</h3>
                <p><strong>Pregunta:</strong> ${flashcard.question}</p>
                <p><strong>Respuesta:</strong> ${flashcard.answer}</p>
                <button class="edit-button">Editar</button>
                <button class="delete-button">Eliminar</button>
            `;

            card.querySelector('.edit-button').addEventListener('click', () => {
                editFlashcardPrompt(index);
            });

            card.querySelector('.delete-button').addEventListener('click', () => {
                deleteFlashcard(index);
            });

            flashcardContainer.appendChild(card);
        });
    }

    function editFlashcardPrompt(index) {
        const flashcard = flashcards[index];
        const newTitle = prompt("Edita el título:", flashcard.title);
        const newQuestion = prompt("Edita la pregunta:", flashcard.question);
        const newAnswer = prompt("Edita la respuesta:", flashcard.answer);
        if (newTitle && newQuestion && newAnswer) {
            editFlashcard(index, newTitle, newQuestion, newAnswer);
        }
    }

    function showFlashcardInPresentation() {
        const flashcard = flashcards[currentFlashcardIndex];
        presentationTitle.innerText = flashcard.title;
        presentationQuestion.innerText = flashcard.question;
        presentationAnswer.innerText = flashcard.answer;
        presentationAnswer.style.display = 'none';
    }

    function showNextFlashcard() {
        currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcards.length;
        showFlashcardInPresentation();
    }

    function showPreviousFlashcard() {
        currentFlashcardIndex = (currentFlashcardIndex - 1 + flashcards.length) % flashcards.length;
        showFlashcardInPresentation();
    }

    presentationQuestion.addEventListener('click', () => {
        presentationAnswer.style.display = 'block';
    });

    function openModal() {
        modal.style.display = 'flex';
        body.classList.add('modal-open');
    }

    function closeModal() {
        modal.style.display = 'none';
        body.classList.remove('modal-open');
    }

    function openModal() {
        modal.style.display = 'flex'; // Mantén la visualización como 'flex' para centrar el contenido.
        // Forzar un reflujo para asegurar que la transición ocurra.
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10); // Pequeño retraso para asegurar que la transición ocurra.
        body.classList.add('modal-open'); // Esta clase asegura que la animación de escala sea suave.
    }
    
    function closeModal() {
        // Inicia el cierre con la animación inversa.
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        // Retrasa el cierre hasta que la animación termine.
        setTimeout(() => {
            modal.style.display = 'none';
            body.classList.remove('modal-open');
        }, 500); // Tiempo en milisegundos que coincide con la duración de la transición.
    }
    
    function showFlashcardInPresentation() {
        const flashcard = flashcards[currentFlashcardIndex];
        presentationTitle.innerText = flashcard.title;
        presentationQuestion.innerText = flashcard.question;
        presentationAnswer.innerText = flashcard.answer;
        presentationAnswer.style.display = 'none';
    }
    
    function showNextFlashcard() {
        // Añadir la animación de salida
        presentationQuestion.classList.add('presentation-slide', 'slideOutToLeft');
        presentationAnswer.classList.add('presentation-slide', 'slideOutToLeft');
        
        setTimeout(() => {
            currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcards.length;
            showFlashcardInPresentation();
            
            // Añadir la animación de entrada
            presentationQuestion.classList.remove('slideOutToLeft');
            presentationAnswer.classList.remove('slideOutToLeft');
            presentationQuestion.classList.add('slideInFromRight');
            presentationAnswer.classList.add('slideInFromRight');
        }, 500); // Esperar la duración de la animación de salida
    
        setTimeout(() => {
            presentationQuestion.classList.remove('presentation-slide', 'slideInFromRight');
            presentationAnswer.classList.remove('presentation-slide', 'slideInFromRight');
        }, 1000); // Remover la clase después de la animación de entrada
    }
    
    function showPreviousFlashcard() {
        // Añadir la animación de salida
        presentationQuestion.classList.add('presentation-slide', 'slideOutToRight');
        presentationAnswer.classList.add('presentation-slide', 'slideOutToRight');
        
        setTimeout(() => {
            currentFlashcardIndex = (currentFlashcardIndex - 1 + flashcards.length) % flashcards.length;
            showFlashcardInPresentation();
            
            // Añadir la animación de entrada
            presentationQuestion.classList.remove('slideOutToRight');
            presentationAnswer.classList.remove('slideOutToRight');
            presentationQuestion.classList.add('slideInFromLeft');
            presentationAnswer.classList.add('slideInFromLeft');
        }, 500); // Esperar la duración de la animación de salida
    
        setTimeout(() => {
            presentationQuestion.classList.remove('presentation-slide', 'slideInFromLeft');
            presentationAnswer.classList.remove('presentation-slide', 'slideInFromLeft');
        }, 1000); // Remover la clase después de la animación de entrada
    }
    
    

    

});
