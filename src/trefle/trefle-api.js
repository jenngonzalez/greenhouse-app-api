const config = require('../config')
const rp = require('request-promise')
const request = require('request')


const getPlants = (searchTerm, pageSize) => {
    const trefleUrl = config.TREFLE_URL
    const trefleKey = process.env.TREFLE_API_KEY
    return rp({
        uri: `${trefleUrl}?token=${trefleKey}&q=${searchTerm}&page_size=${pageSize}`,
        json: true
    })
        .then(data =>  {
            const userPlants = data.map(plant => {
                return rp({
                    uri: `${trefleUrl}/${plant.id}?token=${trefleKey}`,
                    json: true
                })
            })
            return Promise.all(userPlants)
        })
}

const trefleApi = async (req, res) => {
    const searchTerm  = req.query.q
    const maxResults = 25
    let finalResults = []
   
    while(finalResults.length < maxResults) {
        try {
            const plants = await getPlants(searchTerm, maxResults)
            const filteredPlants = plants.filter(plant => plant.common_name)
            finalResults = [...finalResults, ...filteredPlants]
            if (plants.length < 25) {
                break
            }
        } catch(error) {
            console.log(error)
        }
    }
    res.send(finalResults.slice(0, maxResults))
}


    

module.exports = trefleApi