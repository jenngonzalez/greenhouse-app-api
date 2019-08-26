const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
    const authToken = req.get('Authorization') || ''
    // console.log(authToken)
    let bearerToken
    if (!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({
            error: 'Missing bearer token'
        })
    } else {
        bearerToken = authToken.slice(7, authToken.length)
        // console.log(bearerToken)
    }

    try {
        // query to db looking for user with a user_name matching the sub in the JWT payload:
        const payload = AuthService.verifyJwt(bearerToken)

        console.log(payload)

        AuthService.getUserWithEmail(
            req.app.get('db'),
            payload.sub
        ) .then(user => {
            if(!user)
                return res.status(401).json({
                    error: 'Unauthorized request'
                })
            console.log(user)
            req.user = user
            next()
        })
        .catch(err => {
            console.error(err)
            next(err)
        })
    } catch(error) {
        res.status(401).json({
            error: 'Unauthorized request'
        })
        console.log(error)
    }

}

module.exports = { requireAuth }