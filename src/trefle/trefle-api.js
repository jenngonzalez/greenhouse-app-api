const config = require('../config')
const rp = require('request-promise')
const request = require('request')


trefleApi = (req, res) => {
    const trefleUrl = config.TREFLE_URL
    const trefleKey = process.env.TREFLE_API_KEY
    const searchTerm  = req.query.q
    rp({
        uri: `${trefleUrl}?token=${trefleKey}&q=${searchTerm}`,
        json: true
    })
        .then(data =>  new Promise(function(resolve, reject) {
            const userPlants = []
            data.forEach(plant => {
                rp({
                    uri: `${trefleUrl}/${plant.id}?token=${trefleKey}`,
                    json: true
                })
                .then(plantData => {
                    userPlants.push(plantData)
                }) .catch(err => {
                    console.log(err)
                })
            })
            setTimeout(() => {
                resolve(userPlants)
            }, 1000)
            return Promise.all(userPlants)
        }))
        .then(userPlants => {
            res.send(userPlants[1])
        })
        .catch(err => console.log(err))
}


    

module.exports = trefleApi