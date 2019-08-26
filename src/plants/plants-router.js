const express = require('express')
const path = require('path')
const PlantsService = require('./plants-service')
const { requireAuth } = require('../middleware/jwt-auth')

const plantsRouter = express.Router()
const jsonBodyParser = express.json()

plantsRouter
    .route('/')
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { name, family, watered, notes, image } = req.body
        const newPlant = { name, family, watered, notes, image }

        if (req.body.name == null)
            return res.status(400).json({
                error: `Missing plant name in request body`
            })

    newPlant.user_id = req.user.id

    PlantsService.insertPlant(
        req.app.get('db'),
        newPlant
    )
        .then(plant => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${plant.id}`))
                .json(PlantsService.serializePlant(plant))
        })
        .catch(next)
    })


module.exports = plantsRouter