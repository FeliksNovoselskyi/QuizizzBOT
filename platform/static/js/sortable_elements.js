$(document).ready(function () {
    const $questions = $("#created-questions")

    if ($questions.length) {
        new Sortable($questions[0], {
            animation: 150,
            onEnd: function () {
                const order = []
                const containerCells = $questions.children()
                
                containerCells.each(function (index) {
                    const cellId = $(this).data("question-id")
                    order.push({
                        id: cellId,
                        order: index + 1
                    })
                })
                console.log(order)

                $.ajax({
                    url: "/",
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        cell_order: order,
                        action: "cell_order_upgrade",
                    }),
                    success: function () {
                        
                    }
                })
            }
        })
    }
    
})