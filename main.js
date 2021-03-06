$(document.readyState(function () {
    $('title').autocomplete({
        source: async function(req, res) {
            let data = await fetch(`https://localhost:3000/search?query=${req.term}`)
                .then (results => results.json())
                .then (results => results.map(result => {
                    return {
                        label: result.title,
                        value: result.title,
                        id: result._id
                    }
                }))
            res(data)
        },
        minLegth : 2,
        select : function (event, ui) {
            console.log(ui.item.id)
            fetch(`http://localhost:3000/get/${ui.item.id}`)
        }
})
}))