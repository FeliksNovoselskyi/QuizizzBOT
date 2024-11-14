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
                if (response.downloadFile) {
                    console.log(111111)
                }
            },
            // error: function(response) {
            //     console.log(response.responseJSON.error)
            // }
        })
    })
})