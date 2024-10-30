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
        const csrfToken = $('meta[name="csrf-token"]').attr('content')

        $.ajax({
            url: '/',
            type: 'POST',
            headers: {
                'X-CSRF-Token': csrfToken,
            },
            contentType: 'application/json',
            data: JSON.stringify({
                questionTextInput,
                answer1Input,
                answer2Input,
                answer3Input,
                answer4Input,
                correctAnswerIndex,
                action: 'createQuest'
            }),
            success: function(response) {
                const newQuestionHtml = `
                    <div class="question" data-question-id="${response.id}">
                        <div class="question-header">
                            <h3 class="question-text">${response.questionText}</h3>
                            <form action="/" method="post" class="delete-quest-form">
                                <input type="hidden" name="questionId" value="${response.id}">
                                <button type="submit" class="delete-quest-button" name="action" value="deleteQuest" data-question-id="${response.id}">Delete question</button>
                            </form>
                        </div>
                        <div class="answers">
                            <p class="answers-text">${response.answer1}</p>
                            <p class="answers-text">${response.answer2}</p>
                            <p class="answers-text">${response.answer3}</p>
                            <p class="answers-text">${response.answer4}</p>
                        </div>
                    </div>
                `
                // Add new question on page
                $('#created-questions').append(newQuestionHtml)

                // Clear error message and reset form inputs
                $('.error-message').text("")
                $('.question-form')[0].reset()
            },

            error: function(response) {
                if (response.status === 400) {
                    $('.error-message').text(response.responseJSON.error)
                }
            }
        })
    })
})