$(document).ready(function() {
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
                const jsonString = JSON.stringify(response)

                const link = document.createElement('a')
                link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString)
                link.download = 'questions.json'

                // Simulate clicking on a newly created link to instantly download a file
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            },
            // error: function(response) {
            //     console.log(response.responseJSON.error)
            // }
        })
    })
})