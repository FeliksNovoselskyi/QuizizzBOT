$(document).ready(function() {
    // Process a button click to load a .json file with test questions
    // in order to upload this file to chat with the bot in the future
    $(document).on('submit', '#download-form', function(event) {
        event.preventDefault()

        const csrfToken = $('meta[name="csrf-token"]').attr('content')

        $.ajax({
            url: '/',
            type: 'POST',
            headers: {
                'X-CSRF-Token': csrfToken,
            },
            contentType: 'application/json',
            data: JSON.stringify({
                action: 'downloadFile'
            }),
            success: function(response) {
                // Converts a response object to formatted JSON with indentation
                const jsonString = JSON.stringify(response, null, 2)

                // Creating a page link element
                // Putting a link in it that will prompt you to select a location
                // in the computer's file system
                const link = document.createElement('a')
                link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString)
                link.download = 'questions.json'

                // Simulate clicking on a newly created link to instantly download a file
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        })
    })
})