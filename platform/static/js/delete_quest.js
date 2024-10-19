$(document).ready(function() {
    $(".delete-quest-form").submit(function(event) {
        event.preventDefault()

        let $form = $(this)
        let questionId = $form.find("input[name=questionId]").val()
        console.log(questionId)

        $.ajax({
            url: '/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                questionId,
                action: 'deleteQuest'
            }),
            success: function(response) {
                if (response.deleteQuestion) {
                    console.log(1111)
                    $form.closest('.question').remove()
                }
            },
            error: function(response) {
                console.log(response.responseJSON.error)
            }
        
        })
    })
})