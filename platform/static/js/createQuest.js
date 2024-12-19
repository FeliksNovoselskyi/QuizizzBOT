$(document).ready(function() {
    function deselectOtherCheckboxes(className) {
        $(`.${className}`).change(function() {
            // If the current checkbox is selected, deselect all other checkboxes
            if ($(this).prop('checked')) {
                $(`.${className}`).not(this).prop('checked', false)
            }
        })
    }

    deselectOtherCheckboxes('correct-answer-checkbox')
    deselectOtherCheckboxes('time-checkbox')

    // Create question ajax request
    $(".question-form").submit(function(event) {
        event.preventDefault()

        const questionTextInput = $('#questionTextInput').val()
        const answer1Input = $('#answer1Input').val()
        const answer2Input = $('#answer2Input').val()
        const answer3Input = $('#answer3Input').val()
        const answer4Input = $('#answer4Input').val()

        const checkboxCorrectAnswers = [
            $('#correctAnswer1Input'),
            $('#correctAnswer2Input'),
            $('#correctAnswer3Input'),
            $('#correctAnswer4Input')
        ]

        const checkboxQuestionTime = [
            $('#15SecondInput'),
            $('#30SecondInput'),
            $('#45SecondInput'),
            $('#60SecondInput')
        ]

        function chooseCorrectAnswer(checkboxAnswers) {
            const correctAnswers = checkboxAnswers.filter(checkbox => checkbox.prop('checked'))

            if (correctAnswers.length === 1) {
                const correctAnswerIndex = checkboxAnswers.indexOf(correctAnswers[0])
                return correctAnswerIndex
            }
            return null
        }

        const correctAnswerIndex = chooseCorrectAnswer(checkboxCorrectAnswers)
        const questionTimeIndex = chooseCorrectAnswer(checkboxQuestionTime)

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
                questionTimeIndex,
                action: 'createQuest'
            }),
            success: function(response) {
                function getCorrectAnswer(index) {
                    if (response.correctAnswer === index) {
                        return 'corr-answer'
                    } else {
                        return 'incorr-answer'
                    }
                }

                const newQuestionHtml = `
                    <div class="question" data-question-id="${response.id}">
                        <div class="question-header">
                            <div class="question-name-seconds">
                                <h3 class="question-text">${response.questionText}</h3>
                                <p class="question-answer-time">${response.questionAnswerTime} sec</p>
                            </div>

                            <h3 class="question-text"></h3>
                            <form action="/" method="post" class="delete-quest-form">
                                <input type="hidden" name="questionId" value="${response.id}">
                                <button type="submit" class="delete-quest-button" name="action" value="deleteQuest" data-question-id="${response.id}">Delete question</button>
                            </form>
                        </div>
                        <div class="answers">
                            

                            <p class="answers-text ${getCorrectAnswer(0)}">${response.answer1}</p>
                            <p class="answers-text ${getCorrectAnswer(1)}">${response.answer2}</p>
                            <p class="answers-text ${getCorrectAnswer(2)}">${response.answer3}</p>
                            <p class="answers-text ${getCorrectAnswer(3)}">${response.answer4}</p>
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