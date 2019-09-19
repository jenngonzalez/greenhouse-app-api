const express = require('express')
const path = require('path')
const PlantsService = require('./plants-service')
const AuthService = require('../auth/auth-service')
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

plantsRouter
    .route('/:username')
    .all(checkUserExists)
    .get((req, res) => {
        PlantsService.getPlantsByUserName(
            req.app.get('db'),
            req.params.username
        )
            .then(plants => {
                res.json(plants)
            })
    })

plantsRouter
  .route('/:username/:plant')
  .delete(requireAuth, (req, res, next) => {
    PlantsService.deletePlant(
      req.app.get('db'),
      req.params.plant,
      req.params.username
    )
      .then(numRowsAffected => {
        res
          .status(204)
          .end()
      })
      .catch(next)
  })
  .patch(jsonBodyParser, requireAuth, (req, res, next) => {
    const plantId = req.params.plant
    const { name, family, watered, notes, image } = req.body
    const plantToUpdate = { name, family, watered, notes, image }

    const numberOfValues = Object.values(plantToUpdate).filter(Boolean).length
    if(numberOfValues === 0) {
      return res.status(400).json({
          error: {
              message: `Request body must contain either 'name', 'family', 'watered', 'notes' or 'image'`
          }
      })
    }
  
    PlantsService.updatePlant(
      req.app.get('db'),
      plantId,
      plantToUpdate
    )
      .then(newPlant => {
        res
          .status(200)
          .json(newPlant)
      })
      .catch(next)
  })



/* async/await syntax for promises */
async function checkUserExists(req, res, next) {
    try {
      const username = await AuthService.getUserWithUserName(
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
        console.log(error)
      next(error)
    }
  }


module.exports = plantsRouter
