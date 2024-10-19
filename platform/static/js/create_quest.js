$(document).ready(function() {
    // Create question ajax request
    $(".question-form").submit(function(event) {
        event.preventDefault()

        const questionTextInput = $('#questionTextInput').val()
        const answer1Input = $('#answer1Input').val()
        const answer2Input = $('#answer2Input').val()
        const answer3Input = $('#answer3Input').val()
        const answer4Input = $('#answer4Input').val()

        console.log(questionTextInput, answer1Input, answer2Input, answer3Input, answer4Input)

        $.ajax({
            url: '/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                questionTextInput,
                answer1Input,
                answer2Input,
                answer3Input,
                answer4Input,
                action: 'createQuest'
            }),
            success: function(response) {
                console.log(response.message)
                console.log(response.id)
                const newQuestionHtml = `
                    <div class="question">
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
                $('#created-questions').append(newQuestionHtml)
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