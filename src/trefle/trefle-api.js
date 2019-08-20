const config = require('../config')
const request = require('request')
const rp = require('request-promise')

trefleApi = (req, res) => {
    const trefleUrl = config.TREFLE_URL
    const trefleKey = process.env.TREFLE_API_KEY
    const searchTerm  = req.query.q
    console.log(searchTerm)
    rp({
        uri: `${trefleUrl}?token=${trefleKey}&q=${searchTerm}`,
        json: true
    })
        .then(data => {
            console.log(data)
            res.send(data)
        })
        .catch(err => {
            console.log(err)
        })
}
        

module.exports = trefleApi