require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const plantsRouter = require('./plants/plants-router')
// const userPlantsRouter = require('./user-plants/userplants-router')
const trefleApi = require('./trefle/trefle-api')



const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)
app.use('/api/plants', plantsRouter)
// app.use('/api/username', userPlantsRouter)

app.get('/api/trefle', trefleApi)


app.get('/', (req, res) => {
    res.send('Greenhouse server running!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if(NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})


module.exports = app