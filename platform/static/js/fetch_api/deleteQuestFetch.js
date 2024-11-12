$(document).ready(function() {
    // Delegation of events
    // to be able to handle events of dynamically added elements
    $(document).on('submit', '.delete-quest-form', function(event) {
        event.preventDefault()

        // Get form using jQuery for correctly questions deleting
        let $form = $(this)
        let questionId = $form.find("input[name=questionId]").val()

        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questionId,
                action: 'deleteQuest'
            })
        })
        .then(response => {
            if (!response.ok) {
                throw response
            }
            return response.json()
        })
        // Successfully deleted question
        .then(data => {
            if (data.deleteQuestion) {
                $form.closest('.question').remove()
            }
        })

        // Possible errors
        .catch(error => {
            // Check if error is an instance of Response class
            // It is checked to ensure that the request has been sent, even if it is not correct
            if (error instanceof Response) {
                error.json().then(err => {
                    console.error(err.error)
                })
            }
        })
    })
})

// Response.json() takes the Response stream and reads it to the end
// It returns a promise that resolves to the result of parsing the response body as a string