const express = require('express')
const path = require('path')
const UserPlantsService = require('./userplants-service')
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const userPlantsRouter = express.Router()

userPlantsRouter
    .route('/')
    .all(checkUserExists)
    .get((req, res) => {
        // console.log(req.params.username)
        UserPlantsService.getPlantsByUserName(
            req.app.get('db'),
            req.params.username
        )
            .then(plants => {
                res.json(plants)
            })
    })



/* async/await syntax for promises */
async function checkUserExists(req, res, next) {
    // console.log(`running checkUserExists`)
    // console.log(`req.params.username: ${req.params.username}`)
    try {
    const article = await AuthService.getUserWithUserName(
        req.app.get('db'),
        req.params.username
    )

    if (!username)
        return res.status(404).json({
        error: `User doesn't exist`
        })

    res.username = username
    next()
    } catch (error) {
        next(error)
    }
}

module.exports = userPlantsRouter