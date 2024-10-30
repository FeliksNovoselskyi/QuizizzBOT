$(document).ready(function () {
    const $questions = $("#created-questions")

    function sortingElements($container, dataAttr) {
        // Check if there are elements that can be sorted
        if ($container.length) {
            new Sortable($container[0], {
                animation: 150,
                onEnd: function () {
                    const order = []
                    const containerCells = $container.children()
                    
                    // Prepare order before being sent to the server
                    containerCells.each(function (index) {
                        const cellId = $(this).data(dataAttr)
                        order.push({
                            id: cellId,
                            order: index + 1
                        })
                    })
    
                    const csrfToken = $('meta[name="csrf-token"]').attr('content')
                    
                    $.ajax({
                        url: "/",
                        type: "POST",
                        headers: {
                            'X-CSRF-Token': csrfToken,
                        },
                        contentType: 'application/json',
                        data: JSON.stringify({
                            cell_order: order,
                            action: "cell_order_upgrade",
                        })
                    })
                }
            })
        }
    }

    sortingElements(
        $container=$questions,
        dataAttr="question-id"
    )
})