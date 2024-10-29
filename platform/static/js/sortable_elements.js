$(document).ready(function () {
    const $questions = $("#created-questions")

    // Check if there are elements that can be sorted
    if ($questions.length) {
        new Sortable($questions[0], {
            animation: 150,
            onEnd: function () {
                const order = []
                const containerCells = $questions.children()
                
                // Prepare order before being sent to the server
                containerCells.each(function (index) {
                    const cellId = $(this).data("question-id")
                    order.push({
                        id: cellId,
                        order: index + 1
                    })
                })

                $.ajax({
                    url: "/",
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        cell_order: order,
                        action: "cell_order_upgrade",
                    }),
                    success: function () {}
                })
            }
        })
    }
    
})