const getAll = (request, response) => {
    return response.status(200).send({
        "message": "It works!"
    })
}

module.exports = {
    getAll
}