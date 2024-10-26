$(document).ready(function() {
    $('.correct-answer-checkbox').change(function() {
        // If the current checkbox is selected, deselect all other checkboxes
        if ($(this).prop('checked')) {
            $('.correct-answer-checkbox').not(this).prop('checked', false)
        }
    })

    // Create question ajax request
    $(".question-form").submit(function(event) {
        event.preventDefault()

        // Get form input values
        // using jQuery
        const questionTextInput = $('#questionTextInput').val()
        const answer1Input = $('#answer1Input').val()
        const answer2Input = $('#answer2Input').val()
        const answer3Input = $('#answer3Input').val()
        const answer4Input = $('#answer4Input').val()

        const checkboxAnswers = [
            $('#correctAnswer1Input'),
            $('#correctAnswer2Input'),
            $('#correctAnswer3Input'),
            $('#correctAnswer4Input')
        ]

        function chooseCorrectAnswer() {
            const correctAnswers = checkboxAnswers.filter(checkbox => checkbox.prop('checked'))

            if (correctAnswers.length === 1) {
                const correctAnswerIndex = checkboxAnswers.indexOf(correctAnswers[0])
                return correctAnswerIndex
            }
            return null
        }

        const correctAnswerIndex = chooseCorrectAnswer()

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
                correctAnswerIndex,
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

            // Add new question on page
            // insertAdjacentHTML method is used to correctly add new code
            // using dom-tree
            document.getElementById('created-questions').insertAdjacentHTML('beforeend', newQuestionHtml)
            
            // Clear error message and reset form inputs
            document.querySelector('.error-message').textContent = ""
            document.querySelector('.question-form').reset()
        })
        // Errors during form validation
        .catch(error => {
            // Check if error is an instance of Response class
            // It is checked to ensure that the request has been sent, even if it is not correct
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

// Response.json() takes the Response stream and reads it to the end
// It returns a promise that resolves to the result of parsing the response body as a string