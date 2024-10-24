$(document).ready(function() {
    // Delegation of events
    // to be able to handle events of dynamically added elements
    $(document).on('submit', '.delete-quest-form', function(event) {
        event.preventDefault()

        let $form = $(this)
        let questionId = $form.find("input[name=questionId]").val()

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
                    $form.closest('.question').remove()
                }
            },
            error: function(response) {
                console.log(response.responseJSON.error)
            }
        })
    })
})