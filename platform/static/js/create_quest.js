$(document).ready(function() {
    // Create question ajax request
    $(".question-form").submit(function(event) {
        event.preventDefault()

        const questionTextInput = $('#questionTextInput').val()
        const answer1Input = $('#answer1Input').val()
        const answer2Input = $('#answer2Input').val()
        const answer3Input = $('#answer3Input').val()
        const answer4Input = $('#answer4Input').val()

        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questionTextInput,
                answer1Input,
                answer2Input,
                answer3Input,
                answer4Input,
                action: 'createQuest'
            })
        })
        .then(response => {
            if (!response.ok) {
                throw response
            }
            return response.json()
        })
        // Successfully created question
        .then(data => {
            const newQuestionHtml = `
                <div class="question">
                    <div class="question-header">
                        <h3 class="question-text">${data.questionText}</h3>
                        <form action="/" method="post" class="delete-quest-form">
                            <input type="hidden" name="questionId" value="${data.id}">
                            <button type="submit" class="delete-quest-button" name="action" value="deleteQuest" data-question-id="${data.id}">Delete question</button>
                        </form>
                    </div>
                    <div class="answers">
                        <p class="answers-text">${data.answer1}</p>
                        <p class="answers-text">${data.answer2}</p>
                        <p class="answers-text">${data.answer3}</p>
                        <p class="answers-text">${data.answer4}</p>
                    </div>
                </div>
            `
            document.getElementById('created-questions').insertAdjacentHTML('beforeend', newQuestionHtml)
            document.querySelector('.error-message').textContent = ""
            document.querySelector('.question-form').reset()
        })
        // Errors during form validation
        .catch(error => {
            if (error instanceof Response) {
                error.json().then(err => {
                    document.querySelector('.error-message').textContent = err.error
                })
            } else {
                console.error(error)
            }
        })
    })
})